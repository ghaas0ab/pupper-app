from constructs import Construct
from aws_cdk import (
    Duration,
    Stack,
    RemovalPolicy,
    CfnOutput,
    aws_iam as iam,
    aws_sqs as sqs,
    aws_sns as sns,
    aws_sns_subscriptions as subs,
    aws_lambda as _lambda,
    aws_dynamodb as dynamodb,
    aws_apigateway as apigateway,
    aws_s3 as s3,
)


class pupperStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Existing resources
        queue = sqs.Queue(
            self, "pupperQueue",
            visibility_timeout=Duration.seconds(300),
        )

        topic = sns.Topic(
            self, "pupperTopic"
        )

        topic.add_subscription(subs.SqsSubscription(queue))

        # Dogs table
        self.dogs_table = dynamodb.Table(
            self, "DogsTable",
            table_name="pupper-dogs",
            partition_key=dynamodb.Attribute(
                name="id",
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        # S3 bucket for dog photos (private for now)
        bucket = s3.Bucket(
            self, "DogPhotosBucket", 
            bucket_name="pupper-photos-957798448417",
            removal_policy=RemovalPolicy.DESTROY
        )

        # Lambda function for API
        lambda_fn = _lambda.Function(
            self, "DogsApiFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="index.handler",
            code=_lambda.Code.from_inline("""
import json
import boto3
from decimal import Decimal

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def handler(event, context):
    print(f"Event: {json.dumps(event)}")
    
    try:
        path = event.get('path', '')
        method = event.get('httpMethod', '')
        
        # Handle root path
        if path == '/':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Pupper API is running!'})
            }
        
        # Handle /dogs path
        if path == '/dogs' and method == 'GET':
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('pupper-dogs')
            response = table.scan()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps(response['Items'], default=decimal_default)
            }
        
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'})
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
""")
        )

        # Grant Lambda permissions to DynamoDB
        self.dogs_table.grant_read_write_data(lambda_fn)

        # API Gateway
        api = apigateway.RestApi(
            self, "PupperApi",
            rest_api_name="Pupper Dogs API",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=["Content-Type", "Authorization"]
            )
        )

        dogs_resource = api.root.add_resource("dogs")
        dogs_resource.add_method("GET", apigateway.LambdaIntegration(lambda_fn))
        
        # Add root path handler
        api.root.add_method("GET", apigateway.LambdaIntegration(lambda_fn))

        # Outputs
        CfnOutput(self, "ApiUrl", value=api.url, description="API Gateway URL")
        CfnOutput(self, "BucketName", value=bucket.bucket_name, description="S3 Bucket Name")