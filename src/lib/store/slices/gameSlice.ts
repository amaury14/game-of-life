import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initializeGrid } from '../../helpers/utils';
import { GameState } from '../../types/gameState';
import { initialCols, initialRows } from '../../constants/constant';
import { fetchNextGeneration } from '../thunks/gameThunks';

const initialState: GameState = {
    cols: initialCols,
    generationsCount: 0,
    grid: initializeGrid(initialRows, initialCols),
    rows: initialRows
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // Sets board dimensions
        setBoardDimensionsAction(state, action: PayloadAction<{ rows: number; cols: number }>) {
            const { rows, cols } = action.payload;
            state.cols = cols;
            state.rows = rows;
            state.grid = initializeGrid(rows, cols);
        },
        // Toggles state of a given cell
        toggleCellAction(state, action: PayloadAction<{ row: number; col: number }>) {
            const { row, col } = action.payload;
            state.grid[row][col] = !state.grid[row][col];
        },
        // Resets the state of the game
        resetAction(state) {
            state.grid = initializeGrid(state.rows, state.cols);
            state.generationsCount = 0;
        }
    },
    /**
     * Handles the fulfilled state of the fetchNextGeneration async action.
     * 
     * When the `fetchNextGeneration` action is successfully fulfilled, this case updates the game state with the 
     * newly computed generation grid and increments the generation count. The updated state is obtained from the payload 
     * of the fulfilled action.
     * 
     * @param builder - The builder object used to configure the reducer for the async action.
     */
    extraReducers: (builder) => {
        builder.addCase(fetchNextGeneration.fulfilled, (_, action) => {
            return action.payload;
        });
    }
});

export const { resetAction, setBoardDimensionsAction, toggleCellAction } = gameSlice.actions;
export default gameSlice.reducer;
