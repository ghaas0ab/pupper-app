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

        # Use existing S3 bucket instead of creating a new one
        bucket_name = "pupper-photos-957798448417"
        bucket = s3.Bucket.from_bucket_name(self, "DogPhotosBucket", bucket_name)

        # Powertools layer
        powertools_layer = _lambda.LayerVersion.from_layer_version_arn(
            self, "PowertoolsLayer",
            layer_version_arn="arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV2:68"
        )

        # Lambda function for API with improved error handling
        lambda_fn = _lambda.Function(
            self, "DogsApiFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="index.handler",
            timeout=Duration.seconds(30),
            memory_size=512,
            layers=[powertools_layer],
            environment={
                "POWERTOOLS_SERVICE_NAME": "pupper-api",
                "POWERTOOLS_METRICS_NAMESPACE": "PupperApp",
                "LOG_LEVEL": "DEBUG"
            },
            code=_lambda.Code.from_inline("""
import json
import boto3
import base64
import uuid
import os
from decimal import Decimal
from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.event_handler import APIGatewayRestResolver
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.metrics import MetricUnit

# Set up enhanced logging
log_level = os.environ.get("LOG_LEVEL", "INFO")
logger = Logger(level=log_level)
tracer = Tracer()
metrics = Metrics()

# Configure CORS properly
app = APIGatewayRestResolver()

# Set CORS attributes separately
app.cors = True
app.cors_headers = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token", "Accept"]
app.cors_credentials = True

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

@app.get("/")
@tracer.capture_method
def root():
    logger.debug("Root endpoint called")
    return {"message": "Pupper API is running!"}

@app.get("/dogs")
@tracer.capture_method
def get_dogs():
    try:
        logger.info("Getting all dogs")
        metrics.add_metric(name="DogsRequested", unit=MetricUnit.Count, value=1)
    
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('pupper-dogs')
        
        # Check if table exists
        try:
            response = table.scan()
            items = response.get('Items', [])
            logger.info(f"Found {len(items)} dogs")
            
            # Convert Decimal to float for JSON serialization
            for item in items:
                if 'weightInPounds' in item and isinstance(item['weightInPounds'], Decimal):
                    item['weightInPounds'] = float(item['weightInPounds'])
            
            return items
        except dynamodb.meta.client.exceptions.ResourceNotFoundException:
            logger.error("DynamoDB table 'pupper-dogs' not found")
            # Return empty array instead of error
            return []
            
    except Exception as e:
        logger.exception(f"Error getting dogs: {str(e)}")
        # Return empty array instead of error
        return []

@app.post("/dogs")
@tracer.capture_method
def create_dog():
    try:
        logger.info("Creating new dog")
        metrics.add_metric(name="DogsCreated", unit=MetricUnit.Count, value=1)
        
        body = app.current_event.json_body
        logger.info(f"Received dog data: {list(body.keys())}")
        
        if 'image' not in body:
            logger.error("No image provided")
            return {"message": "No image provided"}, 400
        
        # Upload image to S3
        s3 = boto3.client('s3')
        bucket_name = 'pupper-photos-957798448417'
        
        try:
            image_data = base64.b64decode(body['image'])
            image_key = f"dogs/{uuid.uuid4()}.jpg"
            
            s3.put_object(
                Bucket=bucket_name, 
                Key=image_key, 
                Body=image_data, 
                ContentType='image/jpeg',
                ACL='public-read'  # Make object publicly readable
            )
            photo_url = f"https://{bucket_name}.s3.amazonaws.com/{image_key}"
            logger.info(f"Image uploaded to {photo_url}")
        except Exception as e:
            logger.exception(f"Error uploading image to S3: {str(e)}")
            return {"message": f"Error uploading image: {str(e)}"}, 500
        
        # Save to DynamoDB
        try:
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('pupper-dogs')
            
            dog_data = {
                'id': str(uuid.uuid4()),
                'name': body.get('name', ''),
                'species': body.get('species', ''),
                'shelter': body.get('shelter', ''),
                'city': body.get('city', ''),
                'state': body.get('state', ''),
                'description': body.get('description', ''),
                'birthday': body.get('birthday', ''),
                'weightInPounds': int(body.get('weightInPounds', 0)) if body.get('weightInPounds') else 0,
                'color': body.get('color', ''),
                'photo': photo_url,
                'shelterEntryDate': body.get('shelterEntryDate', '')
            }
            
            table.put_item(Item=dog_data)
            logger.info(f"Created dog: {dog_data['name']}")
            
            return {"message": "Dog created successfully", "id": dog_data['id']}
        except Exception as e:
            logger.exception(f"Error saving to DynamoDB: {str(e)}")
            return {"message": f"Error saving dog data: {str(e)}"}, 500
            
    except Exception as e:
        logger.exception(f"Unexpected error in create_dog: {str(e)}")
        return {"message": f"Internal server error: {str(e)}"}, 500

@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST)
@tracer.capture_lambda_handler
@metrics.log_metrics
def handler(event, context):
    logger.debug(f"Received event: {json.dumps(event)}")
    try:
        return app.resolve(event, context)
    except Exception as e:
        logger.exception(f"Unhandled error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token,Accept",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            "body": json.dumps({"message": f"Internal server error: {str(e)}"})
        }
""")
        )

        # Grant Lambda permissions to DynamoDB and S3
        self.dogs_table.grant_read_write_data(lambda_fn)
        bucket.grant_read_write(lambda_fn)

        # API Gateway
        api = apigateway.RestApi(
            self, "PupperApi",
            rest_api_name="Pupper Dogs API",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=["*"],
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token", "Accept", "Origin"],
                allow_credentials=True,
                max_age=Duration.days(1)
            )
        )

        # Single proxy integration for all routes
        api.root.add_proxy(
            default_integration=apigateway.LambdaIntegration(lambda_fn),
            any_method=True
        )

        # Outputs
        CfnOutput(self, "ApiUrl", value=api.url, description="API Gateway URL")
        CfnOutput(self, "BucketName", value=bucket_name, description="S3 Bucket Name")
