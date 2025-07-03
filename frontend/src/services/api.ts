import { Dog } from '../types/Dog';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const dogService = {
  async getAllDogs(): Promise<Dog[]> {
    const response = await fetch(`${API_BASE_URL}/dogs`);
    if (!response.ok) throw new Error('Failed to fetch dogs');
    return response.json();
  }
};