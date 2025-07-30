# Pupper API Documentation

## Endpoints

### GET /dogs

Returns a list of all dogs available for adoption.

**Response:**
```json
{
  "dogs": [
    {
      "id": "string",
      "name": "string",
      "species": "string",
      "shelter": "string",
      "city": "string",
      "state": "string",
      "description": "string",
      "birthday": "string",
      "weightInPounds": number,
      "color": "string",
      "photo": "string",
      "originalPhoto": "string",
      "thumbnailPhoto": "string",
      "shelterEntryDate": "string"
    }
  ],
  "nextToken": "string" // Optional, for pagination
}


GET /dogs/{id}
Returns details for a specific dog.

Parameters:

id (path): The unique identifier of the dog

Response:
{
  "id": "string",
  "name": "string",
  "species": "string",
  "shelter": "string",
  "city": "string",
  "state": "string",
  "description": "string",
  "birthday": "string",
  "weightInPounds": number,
  "color": "string",
  "photo": "string",
  "originalPhoto": "string",
  "thumbnailPhoto": "string",
  "shelterEntryDate": "string"
}

POST /dogs
Creates a new dog listing.

Request Body:
{
  "name": "string",
  "species": "string",
  "shelter": "string",
  "city": "string",
  "state": "string",
  "description": "string",
  "birthday": "string",
  "weightInPounds": number,
  "color": "string",
  "image": "string", // Base64 encoded image
  "shelterEntryDate": "string"
}

Response:
{
  "message": "Dog created successfully",
  "id": "string"
}

POST /interactions
Records a user interaction with a dog (like or dislike).

Request Body:
{
  "dogId": "string",
  "interaction": "LIKE" | "DISLIKE"
}

Response:
{
  "message": "Interaction recorded"
}

GET /likes
Returns all dogs liked by the current user.

Response:
[
  {
    "id": "string",
    "name": "string",
    "species": "string",
    "shelter": "string",
    "city": "string",
    "state": "string",
    "description": "string",
    "birthday": "string",
    "weightInPounds": number,
    "color": "string",
    "photo": "string",
    "originalPhoto": "string",
    "thumbnailPhoto": "string",
    "shelterEntryDate": "string"
  }
]

POST /generate-preview
Generates a preview image of a dog based on a description.

Request Body:
{
  "description": "string"
}

Response:
{
  "image": "string" // Base64 encoded image
}


## Step 20: Add a health check endpoint

File to update: `/home/ghaas0ab/pupper-app/backend/backend/lambda.py`

Add a new handler for the health check endpoint:

```python
elif method == 'GET' and path == '/health':
    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0"
        })
    }


