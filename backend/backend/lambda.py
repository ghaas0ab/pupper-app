# Fixed version of lambda.py with syntax error fixed and duplicate code removed
import json
import boto3
from boto3.dynamodb.conditions import Key
import base64
import uuid
from decimal import Decimal
from datetime import datetime
from PIL import Image
import io
import os
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def process_image(image_data):
    img = Image.open(io.BytesIO(image_data))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    original_buffer = io.BytesIO()
    img.save(original_buffer, format='PNG')
    original_data = original_buffer.getvalue()
    
    # 400x400 PNG with high quality
    standard_img = img.resize((400, 400), Image.Resampling.LANCZOS)
    standard_buffer = io.BytesIO()
    standard_img.save(standard_buffer, format='PNG', optimize=True)
    standard_data = standard_buffer.getvalue()
    
    # Better 50x50 thumbnail with sharpening
    thumbnail_img = img.resize((50, 50), Image.Resampling.LANCZOS)
    # Apply sharpening filter
    from PIL import ImageFilter
    thumbnail_img = thumbnail_img.filter(ImageFilter.SHARPEN)
    thumbnail_buffer = io.BytesIO()
    thumbnail_img.save(thumbnail_buffer, format='PNG', optimize=True)
    thumbnail_data = thumbnail_buffer.getvalue()
    
    return original_data, standard_data, thumbnail_data

def validate_dog_input(body):
    required_fields = ['name', 'species', 'shelter']
    missing_fields = [field for field in required_fields if not body.get(field)]

    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"

    return True, ""

def generate_image_with_nova(description):
    bedrock = boto3.client('bedrock-runtime')
    body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {"text": description},
        "imageGenerationConfig": {"numberOfImages": 1, "height": 512, "width": 512}
    }
    response = bedrock.invoke_model(modelId='amazon.nova-canvas-v1:0', body=json.dumps(body))
    return json.loads(response['body'].read())['images'][0]

def classify_dog_breed(image_data):
    rekognition = boto3.client('rekognition')
    try:
        response = rekognition.detect_labels(Image={'Bytes': image_data}, MaxLabels=20, MinConfidence=60)
        labels = [label['Name'].lower() for label in response['Labels']]
        labrador_keywords = ['labrador', 'retriever', 'lab']
        is_labrador = any(keyword in ' '.join(labels) for keyword in labrador_keywords)
        return is_labrador, labels
    except Exception as e:
        logger.error(f"Rekognition error: {str(e)}")
        return False, []

def get_user_id_from_token(event):
    try:
        auth_header = event.get('headers', {}).get('Authorization') or event.get('headers', {}).get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        token = auth_header.replace('Bearer ', '')
        parts = token.split('.')
        if len(parts) != 3:
            return None
        payload = parts[1] + '=' * (4 - len(parts[1]) % 4)
        decoded_bytes = base64.b64decode(payload)
        payload_json = json.loads(decoded_bytes.decode('utf-8'))
        return payload_json.get('sub')
    except Exception as e:
        logger.error(f"Token decode error: {str(e)}")
        return None

def handler(event, context):
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

            # Get pagination parameters
            query_params = event.get('queryStringParameters', {}) or {}
            limit = int(query_params.get('limit', 20))
            start_key = query_params.get('nextToken')

            # Prepare scan parameters
            scan_params = {
                'Limit': limit
            }
            
            if start_key:
                try:
                    scan_params['ExclusiveStartKey'] = json.loads(start_key)
                except:
                    return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": "Invalid pagination token"})}

            # Execute scan
            response = table.scan(**scan_params)

            # Process items
            items = response.get('Items', [])
            for item in items:
                if 'weightInPounds' in item and isinstance(item['weightInPounds'], Decimal):
                    item['weightInPounds'] = float(item['weightInPounds'])

            # Prepare response
            result = {
                "dogs": items
            }

            # Add pagination token if more results exist
            if 'LastEvaluatedKey' in response:
                result['nextToken'] = json.dumps(response['LastEvaluatedKey'])
            
            return {"statusCode": 200, "headers": headers, "body": json.dumps(result)}
        
        elif method == 'GET' and path.startswith('/dogs/'):
            dog_id = path.split('/')[-1]
            table = dynamodb.Table('pupper-dogs')
            response = table.get_item(Key={'id': dog_id})
            if 'Item' not in response:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"message": "Dog not found"})}
            item = response['Item']
            if 'weightInPounds' in item and isinstance(item['weightInPounds'], Decimal):
                item['weightInPounds'] = float(item['weightInPounds'])
            return {"statusCode": 200, "headers": headers, "body": json.dumps(item)}
        
        elif method == 'POST' and path == '/interactions':
            user_id = get_user_id_from_token(event)
            if not user_id:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"message": "Unauthorized"})}
            body = json.loads(event.get('body', '{}'))
            dog_id = body.get('dogId')
            interaction = body.get('interaction')
            if not dog_id or interaction not in ['LIKE', 'DISLIKE']:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": "Invalid request"})}
            interactions_table = dynamodb.Table('pupper-interactions')
            interactions_table.put_item(Item={'userId': user_id, 'dogId': dog_id, 'interaction': interaction, 'timestamp': datetime.utcnow().isoformat()})
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"message": "Interaction recorded"})}
        
        elif method == 'GET' and path == '/likes':
            user_id = get_user_id_from_token(event)
            if not user_id:
                return {"statusCode": 401, "headers": headers, "body": json.dumps({"message": "Unauthorized"})}
            interactions_table = dynamodb.Table('pupper-interactions')
            response = interactions_table.query(KeyConditionExpression=Key('userId').eq(user_id), FilterExpression='interaction = :like', ExpressionAttributeValues={':like': 'LIKE'})
            dog_ids = [item['dogId'] for item in response['Items']]
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
        
        elif method == 'POST' and path == '/generate-preview':
            body = json.loads(event.get('body', '{}'))
            description = body.get('description')
            if not description:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": "No description provided"})}
            try:
                generated_image = generate_image_with_nova(description)
                return {"statusCode": 200, "headers": headers, "body": json.dumps({"image": generated_image})}
            except Exception as e:
                return {"statusCode": 500, "headers": headers, "body": json.dumps({"message": f"Generation failed: {str(e)}"})}
        
        elif method == 'POST' and path == '/dogs':
            body = json.loads(event.get('body', '{}'))

            # Validate input
            is_valid, error_message = validate_dog_input(body)
            if not is_valid:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": error_message})}
            
            if body.get('image'):
                image_data = base64.b64decode(body['image'])
            elif body.get('generateImageDescription'):
                generated_image = generate_image_with_nova(body['generateImageDescription'])
                image_data = base64.b64decode(generated_image)
            else:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"message": "No image provided"})}
            
            is_labrador, detected_labels = classify_dog_breed(image_data)
            if not is_labrador:
                return {"statusCode": 422, "headers": headers, "body": json.dumps({"message": "Only Labrador retrievers are accepted for adoption listings.", "detectedLabels": detected_labels})}
            
            original_data, standard_data, thumbnail_data = process_image(image_data)
            s3 = boto3.client('s3')
            bucket_name = os.environ.get('BUCKET_NAME', 'pupper-photos-957798448417')
            region = os.environ.get('REGION', 'us-east-1')
            dog_id = str(uuid.uuid4())
            
            try:
                s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/original.png", Body=original_data, ContentType='image/png')
                s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/standard.png", Body=standard_data, ContentType='image/png')
                s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/thumbnail.png", Body=thumbnail_data, ContentType='image/png')
            except Exception as e:
                logger.error(f"Error uploading to S3: {str(e)}")
                return {"statusCode": 500, "headers": headers, "body": json.dumps({"message": "Error uploading to S3"})}

            photo_url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{dog_id}/standard.png"
            dog_data = {
                'id': dog_id, 'name': body.get('name', ''), 'species': body.get('species', ''), 'shelter': body.get('shelter', ''),
                'city': body.get('city', ''), 'state': body.get('state', ''), 'description': body.get('description', ''),
                'birthday': body.get('birthday', ''), 'weightInPounds': int(body.get('weightInPounds', 0)) if body.get('weightInPounds') else 0,
                'color': body.get('color', ''), 'photo': photo_url,
                'originalPhoto': f"https://{bucket_name}.s3.{region}.amazonaws.com/{dog_id}/original.png",
                'thumbnailPhoto': f"https://{bucket_name}.s3.{region}.amazonaws.com/{dog_id}/thumbnail.png",
                'shelterEntryDate': body.get('shelterEntryDate', '')
            }
            try:
                table = dynamodb.Table('pupper-dogs')
                table.put_item(Item=dog_data)
            except Exception as e:
                logger.error(f"DynamoDB error: {str(e)}")
                return {"statusCode": 500, "headers": headers, "body": json.dumps({"message": f"Failed to save dog data: {str(e)}"})}
            
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"message": "Dog created successfully", "id": dog_id})}
        
        else:
            return {"statusCode": 404, "headers": headers, "body": json.dumps({"message": "Not found"})}
            
    except Exception as e:
        logger.error(f"ERROR: {str(e)}")
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"message": f"Error: {str(e)}"})}
