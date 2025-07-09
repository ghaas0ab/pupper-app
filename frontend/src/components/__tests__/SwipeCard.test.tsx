import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwipeCard from '../SwipeCard';

const mockDog = {
  id: '1',
  name: 'Max',
  species: 'Golden Retriever',
  city: 'Boston',
  state: 'MA',
  photo: 'test.jpg',
  weightInPounds: 60,
  color: 'Golden',
  description: 'Friendly dog',
  birthday: '2019-05-15'
};

describe('SwipeCard Component', () => {
  const mockOnLike = jest.fn();
  const mockOnDislike = jest.fn();

  beforeEach(() => {
    mockOnLike.mockClear();
    mockOnDislike.mockClear();
  });

  test('renders dog information correctly', () => {
    render(<SwipeCard dog={mockDog} onLike={mockOnLike} onDislike={mockOnDislike} />);
    
    expect(screen.getByText('Max, 5')).toBeInTheDocument();
    expect(screen.getByText('Boston, MA')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText('60 lbs')).toBeInTheDocument();
  });

  test('calls onLike when like button is clicked', () => {
    render(<SwipeCard dog={mockDog} onLike={mockOnLike} onDislike={mockOnDislike} />);
    
    const likeButton = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(likeButton);
    
    expect(mockOnLike).toHaveBeenCalledTimes(1);
  });

  test('calls onDislike when dislike button is clicked', () => {
    render(<SwipeCard dog={mockDog} onLike={mockOnLike} onDislike={mockOnDislike} />);
    
    const dislikeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(dislikeButton);
    
    expect(mockOnDislike).toHaveBeenCalledTimes(1);
  });
});
