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
    aws_cognito as cognito,
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

        # User interactions table
        self.interactions_table = dynamodb.Table(
            self, "UserInteractionsTable",
            table_name="pupper-interactions",
            partition_key=dynamodb.Attribute(
                name="userId",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="dogId",
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
                "TABLE_NAME": "pupper-dogs",
                "INTERACTIONS_TABLE": "pupper-interactions"
            },

            code=_lambda.Code.from_inline("""
import json
import boto3
from boto3.dynamodb.conditions import Key
import base64
import uuid
from decimal import Decimal
from datetime import datetime

def get_user_id_from_token(event):
    try:
        auth_header = event.get('headers', {}).get('Authorization') or event.get('headers', {}).get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.replace('Bearer ', '')
        parts = token.split('.')
        if len(parts) != 3:
            return None
            
        payload = parts[1]
        payload += '=' * (4 - len(payload) % 4)
        
        decoded_bytes = base64.b64decode(payload)
        payload_json = json.loads(decoded_bytes.decode('utf-8'))
        
        return payload_json.get('sub')
    except Exception as e:
        print(f"Token decode error: {str(e)}")
        return None

def handler(event, context):
    print("=== LAMBDA INVOKED ===")
    print(f"Method: {event.get('httpMethod')}, Path: {event.get('path')}")
    
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE"
    }
    
    try:
        method = event.get('httpMethod', '')
        path = event.get('path', '')
        
        if method == 'OPTIONS':
            return {"statusCode": 200, "headers": headers, "body": ""}
        
        dynamodb = boto3.resource('dynamodb')
        
        if method == 'GET' and path == '/dogs':
            table = dynamodb.Table('pupper-dogs')
            response = table.scan()
            items = response.get('Items', [])
            for item in items:
                if 'weightInPounds' in item and isinstance(item['weightInPounds'], Decimal):
                    item['weightInPounds'] = float(item['weightInPounds'])
            return {"statusCode": 200, "headers": headers, "body": json.dumps(items)}
        
        elif method == 'POST' and path == '/interactions':
            print("=== INTERACTIONS ENDPOINT ===")
            
            # GET REAL USER ID FROM TOKEN
            user_id = get_user_id_from_token(event)
            if not user_id:
                print("No valid user ID found")
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"message": "Unauthorized"})}
            
            print(f"User ID: {user_id}")
            
            body = json.loads(event.get('body', '{}'))
            dog_id = body.get('dogId')
            interaction = body.get('interaction')
            
            print(f"Recording: user={user_id}, dog={dog_id}, interaction={interaction}")
            
            if not dog_id or interaction not in ['LIKE', 'DISLIKE']:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": "Invalid request"})}
            
            interactions_table = dynamodb.Table('pupper-interactions')
            interactions_table.put_item(Item={
                'userId': user_id,
                'dogId': dog_id,
                'interaction': interaction,
                'timestamp': datetime.utcnow().isoformat()
            })
            
            print("Interaction saved successfully")
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"message": "Interaction recorded"})}
        
        elif method == 'GET' and path == '/likes':
            print("=== LIKES ENDPOINT ===")
            
            # GET REAL USER ID FROM TOKEN
            user_id = get_user_id_from_token(event)
            if not user_id:
                print("No valid user ID found")
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"message": "Unauthorized"})}
            
            print(f"Getting likes for user: {user_id}")
            
            interactions_table = dynamodb.Table('pupper-interactions')
            response = interactions_table.query(
                KeyConditionExpression=Key('userId').eq(user_id),
                FilterExpression='interaction = :like',
                ExpressionAttributeValues={':like': 'LIKE'}
            )
            
            dog_ids = [item['dogId'] for item in response['Items']]
            print(f"Found {len(dog_ids)} liked dogs for user {user_id}")
            
            if not dog_ids:
                return {"statusCode": 200, "headers": headers, "body": json.dumps([])}
            
            dogs_table = dynamodb.Table('pupper-dogs')
            liked_dogs = []
            for dog_id in dog_ids:
                dog_response = dogs_table.get_item(Key={'id': dog_id})
                if 'Item' in dog_response:
                    item = dog_response['Item']
                    if 'weightInPounds' in item and isinstance(item['weightInPounds'], Decimal):
                        item['weightInPounds'] = float(item['weightInPounds'])
                    liked_dogs.append(item)
            
            return {"statusCode": 200, "headers": headers, "body": json.dumps(liked_dogs)}
        
        elif method == 'POST' and path == '/dogs':
            body = json.loads(event.get('body', '{}'))
            if 'image' not in body:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": "No image provided"})}
            
            s3 = boto3.client('s3')
            bucket_name = 'pupper-photos-957798448417'
            dog_id = str(uuid.uuid4())
            
            original_image_data = base64.b64decode(body['image'])
            
            s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/original.jpg", Body=original_image_data, ContentType='image/jpeg')
            s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/standard.jpg", Body=original_image_data, ContentType='image/jpeg')
            s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/thumbnail.jpg", Body=original_image_data, ContentType='image/jpeg')
            
            photo_url = f"https://{bucket_name}.s3.amazonaws.com/{dog_id}/standard.jpg"
            
            dog_data = {
                'id': dog_id,
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
                'originalPhoto': f"https://{bucket_name}.s3.amazonaws.com/{dog_id}/original.jpg",
                'thumbnailPhoto': f"https://{bucket_name}.s3.amazonaws.com/{dog_id}/thumbnail.jpg",
                'shelterEntryDate': body.get('shelterEntryDate', '')
            }
            
            table = dynamodb.Table('pupper-dogs')
            table.put_item(Item=dog_data)
            
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"message": "Dog created successfully", "id": dog_id})}
        
        else:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"message": "Not found"})}
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"message": f"Error: {str(e)}"})}
""")


        )

        # Grant permissions
        self.dogs_table.grant_read_write_data(lambda_fn)
        self.interactions_table.grant_read_write_data(lambda_fn)
        bucket.grant_read_write(lambda_fn)

        # COMPLETELY NEW API GATEWAY - force recreation
        api = apigateway.RestApi(
            self, "PupperApiClean",  # NEW ID
            rest_api_name="Pupper Dogs API Clean",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=["*"],
                allow_methods=["GET", "POST", "OPTIONS", "DELETE"],
                allow_headers=["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
            )
        )

        # ONLY proxy - no individual resources
        api.root.add_proxy(
            default_integration=apigateway.LambdaIntegration(lambda_fn),
            any_method=True
        )

        # Outputs
        CfnOutput(self, "ApiUrl", value=api.url, description="API Gateway URL")
        CfnOutput(self, "BucketName", value=bucket_name, description="S3 Bucket Name")
