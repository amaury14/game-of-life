import { createAsyncThunk } from '@reduxjs/toolkit';

import { getNextGeneration } from '../../../services/gameService';
import { RootState } from '../store';

/**
 * Asynchronously fetches the next generation of the game state.
 * 
 * This function simulates an API call to fetch the next generation of the game grid. It retrieves the current game state 
 * from the Redux store and computes the next generation using the `getNextGeneration` function.
 * 
 * @returns The next game state, which includes the updated grid and generations count.
 */
export const fetchNextGeneration = createAsyncThunk(
    'game/fetchNextGeneration',
    async (_, { getState }) => {
        const state = getState() as RootState;
        return getNextGeneration(state.game); // simulates an API response
    }
);
