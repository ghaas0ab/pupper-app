import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Favorites from '../Favorites';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Favorites Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
  });

  test('renders empty state when no favorites', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    renderWithRouter(<Favorites />);
    
    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    expect(screen.getByText('Start swiping to add dogs to your favorites!')).toBeInTheDocument();
  });

  test('renders favorites when they exist', () => {
    const mockFavorites = [
      {
        id: '1',
        name: 'Buddy',
        species: 'Labrador',
        city: 'New York',
        state: 'NY',
        photo: 'test.jpg',
        weightInPounds: 50,
        color: 'Brown',
        description: 'Good boy',
        birthday: '2020-01-01'
      }
    ];
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockFavorites));
    
    renderWithRouter(<Favorites />);
    
    expect(screen.getByText('Buddy, 4')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });
});
