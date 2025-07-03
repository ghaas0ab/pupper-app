from constructs import Construct
from aws_cdk import (
    Duration,
    Stack,
    RemovalPolicy,
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

        # Dogs table - stores dog information with encrypted names
        self.dogs_table = dynamodb.Table(
            self, "DogsTable",
            table_name="pupper-dogs",
            partition_key=dynamodb.Attribute(
                name="dog_id",
                type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,  # For development only
            point_in_time_recovery=True,  # Component requirement: data protection
        )
        
        # Add GSI for filtering by state, color, etc.
        self.dogs_table.add_global_secondary_index(
            index_name="StateIndex",
            partition_key=dynamodb.Attribute(
                name="state",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="created_at",
                type=dynamodb.AttributeType.STRING
            )
        )

        bucket = s3.Bucket(self, "DataBucket", bucket_name="dog-photo-957798448417")

        lambda_fn = _lambda.Function(
            self, "ApiFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="index.handler",
            code=_lambda.Code.from_inline("def handler(event, context): return {'statusCode': 200}")
        )

        api = apigateway.LambdaRestApi(
            self, "Api",
            handler=lambda_fn
        )
