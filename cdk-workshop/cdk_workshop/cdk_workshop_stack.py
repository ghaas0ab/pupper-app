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

        # S3 bucket
        bucket_name = "pupper-photos-957798448417"
        bucket = s3.Bucket.from_bucket_name(self, "DogPhotosBucket", bucket_name)

        # Lambda function
        lambda_fn = _lambda.Function(
            self, "DogsApiFunction",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="index.handler",
            timeout=Duration.seconds(30),
            memory_size=512,
            environment={
                "BUCKET_NAME": bucket_name,
                "TABLE_NAME": "pupper-dogs"
            },
            code=_lambda.Code.from_inline("""
import json
import boto3
import base64
import uuid
from decimal import Decimal

def handler(event, context):
    print(f"Event: {json.dumps(event)}")
    
    # CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    }
    
    try:
        method = event.get('httpMethod', '')
        path = event.get('path', '')
        
        # Handle OPTIONS for CORS
        if method == 'OPTIONS':
            return {
                "statusCode": 200,
                "headers": headers,
                "body": ""
            }
        
        # GET /dogs
        if method == 'GET' and path == '/dogs':
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('pupper-dogs')
            
            response = table.scan()
            items = response.get('Items', [])
            
            # Convert Decimal to float
            for item in items:
                if 'weightInPounds' in item and isinstance(item['weightInPounds'], Decimal):
                    item['weightInPounds'] = float(item['weightInPounds'])
            
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(items)
            }
        
        # POST /dogs
        elif method == 'POST' and path == '/dogs':
            body = json.loads(event.get('body', '{}'))
            print(f"Body: {body}")
            
            if 'image' not in body:
                return {
                    "statusCode": 400,
                    "headers": headers,
                    "body": json.dumps({"message": "No image provided"})
                }
            
            # Upload to S3
            s3 = boto3.client('s3')
            bucket_name = 'pupper-photos-957798448417'
            
            image_data = base64.b64decode(body['image'])
            image_key = f"{uuid.uuid4()}.jpg"
            
            s3.put_object(
                Bucket=bucket_name,
                Key=image_key,
                Body=image_data,
                ContentType='image/jpeg',
            )
            
            photo_url = f"https://{bucket_name}.s3.amazonaws.com/{image_key}"
            
            # Save to DynamoDB
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
            
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"message": "Dog created successfully", "id": dog_data['id']})
            }
        
        else:
            return {
                "statusCode": 404,
                "headers": headers,
                "body": json.dumps({"message": "Not found"})
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"message": f"Internal server error: {str(e)}"})
        }
""")
        )

        # Grant permissions
        self.dogs_table.grant_read_write_data(lambda_fn)
        bucket.grant_read_write(lambda_fn)

        # API Gateway with CORS
        api = apigateway.RestApi(
            self, "PupperApi",
            rest_api_name="Pupper Dogs API",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=["*"],
                allow_methods=["GET", "POST", "OPTIONS"],
                allow_headers=["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
            )
        )

        # Add proxy integration
        api.root.add_proxy(
            default_integration=apigateway.LambdaIntegration(lambda_fn),
            any_method=True
        )

        # Outputs
        CfnOutput(self, "ApiUrl", value=api.url, description="API Gateway URL")
        CfnOutput(self, "BucketName", value=bucket_name, description="S3 Bucket Name")
