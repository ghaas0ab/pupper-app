import boto3
import requests

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("pupper-dogs")

# Dog photos from Unsplash (dog-specific)
dog_photos = [
    {"id": "1", "url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800", "filename": "buddy.jpg"},
    {"id": "2", "url": "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800", "filename": "luna.jpg"},
    {"id": "3", "url": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800", "filename": "max.jpg"},
    {"id": "4", "url": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800", "filename": "bella.jpg"},
    {"id": "5", "url": "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800", "filename": "charlie.jpg"},
    {"id": "6", "url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800", "filename": "daisy.jpg"},
    {"id": "7", "url": "https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=800", "filename": "rocky.jpg"},
    {"id": "8", "url": "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800", "filename": "molly.jpg"},
    {"id": "9", "url": "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800", "filename": "zeus.jpg"},
    {"id": "10", "url": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800", "filename": "rosie.jpg"}
]

bucket_name = "pupper-photos-957798448417"

for dog_photo in dog_photos:
    try:
        # Download photo
        response = requests.get(dog_photo["url"])
        if response.status_code == 200:
            # Upload to S3
            s3.put_object(
                Bucket=bucket_name,
                Key=dog_photo["filename"],
                Body=response.content,
                ContentType='image/jpeg'
            )
            
            # Update DynamoDB with S3 URL
            s3_url = f"https://{bucket_name}.s3.amazonaws.com/{dog_photo['filename']}"
            table.update_item(
                Key={'id': dog_photo["id"]},
                UpdateExpression='SET photo = :photo',
                ExpressionAttributeValues={':photo': s3_url}
            )
            
            print(f"Uploaded and updated dog {dog_photo['id']}: {dog_photo['filename']}")
        
    except Exception as e:
        print(f"Error with dog {dog_photo['id']}: {e}")
