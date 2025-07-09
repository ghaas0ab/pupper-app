import { fetchAuthSession } from 'aws-amplify/auth';
import { Dog } from '../types/Dog';

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function getAuthHeaders() {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.accessToken?.toString();
    console.log('Auth token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {};
  }
}

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

  async createDog(dogData: any, image?: File, generatedImage?: string): Promise<void> {
    try {
      const payload: any = { ...dogData };
      
      if (image) {
        const base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(image);
        });
        payload.image = base64Image;
      } else if (generatedImage) {
        payload.image = generatedImage;
      }
      
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
  },

  async recordInteraction(dogId: string, interaction: 'LIKE' | 'DISLIKE'): Promise<void> {
    console.log('Recording interaction:', { dogId, interaction });
    const authHeaders = await getAuthHeaders();
    console.log('Auth headers:', authHeaders);
    
    const response = await fetch(`${API_BASE_URL}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ dogId, interaction })
    });
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to record interaction: ${response.status} - ${errorText}`);
    }
  },

  async getLikedDogs(): Promise<Dog[]> {
    console.log('Fetching liked dogs...');
    const authHeaders = await getAuthHeaders();
    console.log('Auth headers for likes:', authHeaders);
    
    const response = await fetch(`${API_BASE_URL}/likes`, {
      headers: authHeaders
    });
    
    console.log('Likes response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching likes:', errorText);
      throw new Error(`Failed to fetch liked dogs: ${response.status} - ${errorText}`);
    }
    return await response.json();
  }
};
