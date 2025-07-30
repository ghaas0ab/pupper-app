from constructs import Construct
from aws_cdk import (
    Duration,
    Stack,
    CfnOutput,
    aws_iam as iam,
    aws_lambda as _lambda,
    aws_cloudwatch as cloudwatch,
    aws_xray as xray,
    aws_logs as logs,
)
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))
from backend.dynamodb import create_tables
from backend.s3 import create_bucket
from backend.api import create_api

class pupperStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create DynamoDB tables
        self.dogs_table, self.interactions_table = create_tables(self)

        # Create S3 bucket
        bucket, bucket_name = create_bucket(self)

        # Create our own Pillow layer
        pillow_layer = _lambda.LayerVersion(
            self, "PillowLayer",
            code=_lambda.Code.from_asset("layers/pillow"),
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_9],
            description="Pillow library for image processing"
        )

        # Lambda function - using code from backend/lambda.py
        lambda_fn = _lambda.Function(
            self, "DogsApiFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="lambda.handler",
            timeout=Duration.seconds(30),
            memory_size=512,
            layers=[pillow_layer],
            environment={
                "BUCKET_NAME": bucket_name,
                "TABLE_NAME": "pupper-dogs",
                "INTERACTIONS_TABLE": "pupper-interactions",
                "REGION": self.region
            },
            code=_lambda.Code.from_asset("../backend/backend"),
            log_retention=logs.RetentionDays.ONE_MONTH, # Set logs to expire after one month
            tracing=_lambda.Tracing.ACTIVE # Enable X-Ray tracing
        )

        # Add CloudWatch alarms
        lambda_errors_alarm = cloudwatch.Alarm(
            self, "LambdaErrorsAlarm",
            metric=lambda_fn.metric_errors(),
            threshold=5,
            evaluation_periods=1,
            alarm_description="Alarm if the Lambda function has too many errors",
            alarm_name="PupperLambdaErrors"
        )

        lambda_duration_alarm = cloudwatch.Alarm(
            self, "LambdaDurationAlarm",
            metric=lambda_fn.metric_duration(),
            threshold=5000, # 5 seconds
            evaluation_periods=1,
            alarm_description="Alarm if the Lambda function takes too long to execute",
            alarm_name="PupperLambdaDuration"
        )

        # Grant permissions
        self.dogs_table.grant_read_write_data(lambda_fn)
        self.interactions_table.grant_read_write_data(lambda_fn)
        bucket.grant_read_write(lambda_fn)
        
        # Add Bedrock permissions
        lambda_fn.add_to_role_policy(iam.PolicyStatement(
            actions=["bedrock:InvokeModel"],
            resources=["arn:aws:bedrock:*::foundation-model/amazon.nova-canvas-v1:0"]
        ))

        # Add Rekognition permissions
        lambda_fn.add_to_role_policy(iam.PolicyStatement(
            actions=["rekognition:DetectLabels"],
            resources=["*"]
        ))

        # Create API Gateway
        api = create_api(self, lambda_fn)

        # Outputs
        CfnOutput(self, "ApiUrl", value=api.url, description="API Gateway URL")
        CfnOutput(self, "BucketName", value=bucket_name, description="S3 Bucket Name")
        CfnOutput(self, "DynamoDBTableName", value="pupper-dogs", description="DynamoDB Table Name")
        CfnOutput(self, "InteractionsTableName", value="pupper-interactions", description="Interactions Table Name")
        CfnOutput(self, "Region", value=self.region, description="AWS Region")