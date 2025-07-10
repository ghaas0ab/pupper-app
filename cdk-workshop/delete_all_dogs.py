import boto3

def delete_all_dogs():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('pupper-dogs')
    s3 = boto3.client('s3')
    bucket_name = "pupper-photos-957798448417"
    
    # Scan all items
    response = table.scan()
    items = response['Items']
    
    # Delete from DynamoDB and S3
    for item in items:
        dog_id = item['id']
        
        # Delete from DynamoDB
        table.delete_item(Key={'id': dog_id})
        print(f"Deleted dog {dog_id} from DynamoDB")
        
        # Delete from S3 (all formats)
        try:
            s3.delete_object(Bucket=bucket_name, Key=f"{dog_id}/original.jpg")
            s3.delete_object(Bucket=bucket_name, Key=f"{dog_id}/original.png")
            s3.delete_object(Bucket=bucket_name, Key=f"{dog_id}/standard.jpg") 
            s3.delete_object(Bucket=bucket_name, Key=f"{dog_id}/standard.png") 
            s3.delete_object(Bucket=bucket_name, Key=f"{dog_id}/thumbnail.jpg")
            s3.delete_object(Bucket=bucket_name, Key=f"{dog_id}/thumbnail.png")
            print(f"Deleted S3 objects for dog {dog_id}")
        except:
            pass
    
    print(f"Deleted {len(items)} dogs total")

if __name__ == "__main__":
    delete_all_dogs()
