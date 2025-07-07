import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('pupper-dogs')

# S3 bucket name
bucket_name = "pupper-photos-957798448417"

# Dog photo mapping
dog_photos = [
    {"id": "1", "filename": "buddy.jpg"},
    {"id": "2", "filename": "luna.jpg"},
    {"id": "3", "filename": "max.jpg"},
    {"id": "4", "filename": "bella.jpg"},
    {"id": "5", "filename": "charlie.jpg"},
    {"id": "6", "filename": "daisy.jpg"},
    {"id": "7", "filename": "rocky.jpg"},
    {"id": "8", "filename": "molly.jpg"},
    {"id": "9", "filename": "zeus.jpg"},
    {"id": "10", "filename": "rosie.jpg"}
]

# Update each dog record with S3 URL
for dog_photo in dog_photos:
    try:
        # Generate S3 URL
        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{dog_photo['filename']}"
        
        # Update DynamoDB
        response = table.update_item(
            Key={'id': dog_photo["id"]},
            UpdateExpression='SET photo = :photo',
            ExpressionAttributeValues={':photo': s3_url},
            ReturnValues="UPDATED_NEW"
        )
        
        print(f"Updated dog {dog_photo['id']} photo URL to {s3_url}")
        print(f"DynamoDB response: {response['Attributes']}")
        
    except Exception as e:
        print(f"Error updating dog {dog_photo['id']}: {e}")
