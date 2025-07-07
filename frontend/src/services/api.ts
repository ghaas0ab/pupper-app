import { Dog } from '../types/Dog';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const dogService = {
  async getAllDogs(): Promise<Dog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dogs: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dogs:', error);
      throw error;
    }
  },

  async createDog(dogData: any, image: File): Promise<void> {
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(image);
      });

      const payload = {
        ...dogData,
        image: base64Image
      };
      
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
        throw new Error(`Failed to create dog: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating dog:', error);
      throw error;
    }
  }
};
