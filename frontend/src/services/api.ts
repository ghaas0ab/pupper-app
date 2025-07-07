import { Dog } from '../types/Dog';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const dogService = {
  async getAllDogs(): Promise<Dog[]> {
    try {
      console.log(`Fetching dogs from ${API_BASE_URL}/dogs`);
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`Failed to fetch dogs: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} dogs`);
      return data;
    } catch (error) {
      console.error('Error in getAllDogs:', error);
      throw error;
    }
  },

  async createDog(dogData: any, image: File): Promise<void> {
    try {
      console.log(`Creating new dog with data:`, Object.keys(dogData));
      
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(image);
      });
      console.log('Image converted to base64');

      const payload = {
        ...dogData,
        image: base64Image,
        shelterEntryDate: new Date().toISOString().split('T')[0]
      };
      
      console.log(`Sending POST request to ${API_BASE_URL}/dogs`);
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`Failed to create dog: ${response.status} ${errorText}`);
      }
      
      console.log('Dog created successfully');
    } catch (error) {
      console.error('Error in createDog:', error);
      throw error;
    }
  }
};
