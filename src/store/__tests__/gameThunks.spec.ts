import { configureStore } from '@reduxjs/toolkit';

import { getNextGeneration } from '../../services/gameService';
import { RootState } from '../store';
import { fetchNextGeneration } from '../thunks/gameThunks';

// Mock the API call function
jest.mock('../../services/gameService', () => ({
    getNextGeneration: jest.fn()
}));

describe('fetchNextGeneration', () => {
    it('should dispatch the correct action with API response', async () => {
        // Create the mock state that will be returned by getState
        const mockState: RootState = {
            game: {
                cols: 2,
                error: '',
                generationsCount: 0,
                grid: [[true, false], [false, true]],
                rows: 2
            }
        };

        // Simulate the API response
        const mockApiResponse = {
            cols: 2,
            generationsCount: 1,
            grid: [[false, true], [true, false]],
            rows: 2
        };

        (getNextGeneration as jest.Mock).mockResolvedValue(mockApiResponse);

        // Create a mock store
        const store = configureStore({
            reducer: {
                game: (state = mockState.game, action) => {
                    switch (action.type) {
                        case 'game/fetchNextGeneration/fulfilled':
                            return { ...state, ...mockApiResponse };
                        default:
                            return state;
                    }
                }
            }
        });

        // Dispatch the thunk
        const result = await store.dispatch(fetchNextGeneration());

        // Verify if the API response was handled correctly
        expect(getNextGeneration).toHaveBeenCalledWith(mockState.game); // The function should have been called with the game state.
        expect(result.type).toBe('game/fetchNextGeneration/fulfilled');
        expect(result.payload).toEqual(mockApiResponse); // Expect the result to match the API response.

        // Check if the new state was updated correctly
        const updatedState = store.getState().game;
        expect(updatedState.grid).toEqual(mockApiResponse.grid);
        expect(updatedState.generationsCount).toBe(mockApiResponse.generationsCount);
    });

    it('should handle errors if the API call fails', async () => {
        const mockState: RootState = {
            game: {
                cols: 2,
                error: '',
                generationsCount: 0,
                grid: [[true, false], [false, true]],
                rows: 2
            }
        };

        const mockApiError = new Error('Failed to fetch next generation');
        (getNextGeneration as jest.Mock).mockRejectedValue(mockApiError);

        const store = configureStore({
            reducer: {
                game: (state = mockState.game, action) => {
                    switch (action.type) {
                        case 'game/fetchNextGeneration/rejected':
                            return { ...state, error: mockApiError.message };
                        default:
                            return state;
                    }
                },
            },
        });

        // Dispatch the thunk
        const result = await store.dispatch(fetchNextGeneration());

        // Verify that the result is an error
        expect(result.type).toBe('game/fetchNextGeneration/rejected');

        // Verify if the error state was updated correctly
        const updatedState = store.getState().game;
        expect(updatedState.error).toBe(mockApiError.message);
    });
});
