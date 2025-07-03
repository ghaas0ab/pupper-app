import boto3
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('pupper-dogs')

dogs = [
    {"id": "1", "name": "Buddy", "species": "Golden Retriever", "shelter": "Happy Paws Shelter", "city": "Seattle", "state": "WA", "shelterEntryDate": "2024-01-15", "description": "Friendly and energetic dog.", "birthday": "2022-03-10", "weightInPounds": 65, "color": "Golden", "photo": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400"},
    {"id": "2", "name": "Luna", "species": "Border Collie", "shelter": "City Animal Rescue", "city": "Portland", "state": "OR", "shelterEntryDate": "2024-02-01", "description": "Smart and active dog.", "birthday": "2021-07-22", "weightInPounds": 45, "color": "Black & White", "photo": "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400"},
    {"id": "3", "name": "Max", "species": "German Shepherd", "shelter": "Rescue Haven", "city": "Denver", "state": "CO", "shelterEntryDate": "2024-01-20", "description": "Loyal and protective companion.", "birthday": "2020-11-05", "weightInPounds": 75, "color": "Brown & Black", "photo": "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400"},
    {"id": "4", "name": "Bella", "species": "Labrador Mix", "shelter": "Loving Hearts Shelter", "city": "Austin", "state": "TX", "shelterEntryDate": "2024-02-10", "description": "Gentle and loving family dog.", "birthday": "2022-01-18", "weightInPounds": 55, "color": "Chocolate", "photo": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400"},
    {"id": "5", "name": "Charlie", "species": "Beagle", "shelter": "Second Chance Rescue", "city": "Phoenix", "state": "AZ", "shelterEntryDate": "2024-01-30", "description": "Playful and curious dog.", "birthday": "2021-09-12", "weightInPounds": 35, "color": "Tri-color", "photo": "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400"},
    {"id": "6", "name": "Daisy", "species": "Pit Bull Mix", "shelter": "Animal Friends", "city": "Miami", "state": "FL", "shelterEntryDate": "2024-02-05", "description": "Sweet and affectionate dog.", "birthday": "2020-05-30", "weightInPounds": 60, "color": "Brindle", "photo": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400"},
    {"id": "7", "name": "Rocky", "species": "Husky", "shelter": "Hope Animal Shelter", "city": "Chicago", "state": "IL", "shelterEntryDate": "2024-01-25", "description": "Energetic and adventurous.", "birthday": "2021-12-03", "weightInPounds": 70, "color": "Gray & White", "photo": "https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=400"},
    {"id": "8", "name": "Molly", "species": "Cocker Spaniel", "shelter": "Paws & Hearts", "city": "Boston", "state": "MA", "shelterEntryDate": "2024-02-08", "description": "Calm and gentle companion.", "birthday": "2022-04-15", "weightInPounds": 40, "color": "Golden", "photo": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"},
    {"id": "9", "name": "Zeus", "species": "Rottweiler", "shelter": "Safe Haven Rescue", "city": "Nashville", "state": "TN", "shelterEntryDate": "2024-01-18", "description": "Strong and loyal guardian.", "birthday": "2020-08-20", "weightInPounds": 85, "color": "Black & Tan", "photo": "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400"},
    {"id": "10", "name": "Rosie", "species": "Poodle Mix", "shelter": "Forever Friends", "city": "San Diego", "state": "CA", "shelterEntryDate": "2024-02-12", "description": "Intelligent and hypoallergenic.", "birthday": "2021-06-08", "weightInPounds": 25, "color": "Cream", "photo": "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=400"}
]

for dog in dogs:
    table.put_item(Item=dog)
    print(f"Added {dog['name']}")