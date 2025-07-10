import boto3
import requests
import uuid
from PIL import Image
import io

def process_image(image_data):
    img = Image.open(io.BytesIO(image_data))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Original as PNG
    original_buffer = io.BytesIO()
    img.save(original_buffer, format='PNG')
    original_data = original_buffer.getvalue()
    
    # 400x400 PNG
    standard_img = img.resize((400, 400), Image.Resampling.LANCZOS)
    standard_buffer = io.BytesIO()
    standard_img.save(standard_buffer, format='PNG')
    standard_data = standard_buffer.getvalue()
    
    # 50x50 PNG
    thumbnail_img = img.resize((50, 50), Image.Resampling.LANCZOS)
    thumbnail_buffer = io.BytesIO()
    thumbnail_img.save(thumbnail_buffer, format='PNG')
    thumbnail_data = thumbnail_buffer.getvalue()
    
    return original_data, standard_data, thumbnail_data

def upload_labrador_retrievers():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('pupper-dogs')
    s3 = boto3.client('s3')
    bucket_name = "pupper-photos-957798448417"
    
    # Verified Labrador Retriever photos
    labradors = [
        {
            "name": "Max", "color": "Yellow", "shelter": "Golden Paws Rescue", 
            "city": "Seattle", "state": "WA", "birthday": "2021-03-15", 
            "weightInPounds": 70, "description": "Friendly yellow lab who loves fetch and swimming.",
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/3/34/Labrador_on_Quantock_%282175262184%29.jpg"
        },
        {
            "name": "Bella", "color": "Yellow", "shelter": "Happy Tails Shelter",
            "city": "Portland", "state": "OR", "birthday": "2020-07-22",
            "weightInPounds": 65, "description": "Sweet yellow lab, great with kids.",
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg"
        },
        {
            "name": "Charlie", "color": "Chocolate", "shelter": "Rescue Haven",
            "city": "Denver", "state": "CO", "birthday": "2022-01-10",
            "weightInPounds": 75, "description": "Energetic chocolate lab who loves outdoor adventures.",
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/6/64/Chocolate_Labrador_Retriever.jpg"
        },
        {
            "name": "Luna", "color": "Black", "shelter": "Second Chance Rescue",
            "city": "Austin", "state": "TX", "birthday": "2021-11-05",
            "weightInPounds": 60, "description": "Gentle black lab, perfect family companion.",
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/0/04/Labrador_Retriever_%281210559%29.jpg"
        },
        {
            "name": "Rocky", "color": "Yellow", "shelter": "Animal Friends",
            "city": "Phoenix", "state": "AZ", "birthday": "2020-09-18",
            "weightInPounds": 80, "description": "Strong yellow lab who loves playing fetch.",
            "photo_url": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Golden_Retriever_standing_Tucker.jpg"
        }
    ]
    
    for lab_data in labradors:
        dog_id = str(uuid.uuid4())
        
        try:
            response = requests.get(lab_data["photo_url"])
            if response.status_code == 200:
                # Process images
                original_data, standard_data, thumbnail_data = process_image(response.content)
                
                # Upload to S3 - ALL PNG
                s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/original.png", Body=original_data, ContentType='image/png')
                s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/standard.png", Body=standard_data, ContentType='image/png')
                s3.put_object(Bucket=bucket_name, Key=f"{dog_id}/thumbnail.png", Body=thumbnail_data, ContentType='image/png')
                
                photo_url = f"https://{bucket_name}.s3.amazonaws.com/{dog_id}/standard.png"
                
                # Create DynamoDB record
                dog_record = {
                    "id": dog_id,
                    "name": lab_data["name"],
                    "species": "Labrador Retriever",
                    "shelter": lab_data["shelter"],
                    "city": lab_data["city"],
                    "state": lab_data["state"],
                    "shelterEntryDate": "2024-12-01",
                    "description": lab_data["description"],
                    "birthday": lab_data["birthday"],
                    "weightInPounds": lab_data["weightInPounds"],
                    "color": lab_data["color"],
                    "photo": photo_url,
                    "originalPhoto": f"https://{bucket_name}.s3.amazonaws.com/{dog_id}/original.png",
                    "thumbnailPhoto": f"https://{bucket_name}.s3.amazonaws.com/{dog_id}/thumbnail.png"
                }
                
                table.put_item(Item=dog_record)
                print(f"Added Labrador: {lab_data['name']} ({dog_id})")
                
        except Exception as e:
            print(f"Error adding {lab_data['name']}: {e}")
    
    print("Finished uploading Labrador Retrievers")

if __name__ == "__main__":
    upload_labrador_retrievers()
