from aws_cdk import (
    aws_s3 as s3,
    aws_iam as iam,
    RemovalPolicy,
)

def create_bucket(scope):
    # Create bucket without public access
    bucket = s3.Bucket(
        scope, "DogPhotosBucket",
        removal_policy=RemovalPolicy.RETAIN,
        cors=[s3.CorsRule(
            allowed_methods=[s3.HttpMethods.GET],
            allowed_origins=["*"],
            allowed_headers=["*"],
            max_age=3000
        )],
        block_public_access=s3.BlockPublicAccess.BLOCK_ALL
    )
    
    # Instead of making it public, we'll use CloudFront or signed URLs
    # This is a placeholder for now
    
    return bucket, bucket.bucket_name
