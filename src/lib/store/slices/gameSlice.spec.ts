import { configureStore } from '@reduxjs/toolkit';

import { initialCols, initialRows } from '../../constants/constant';
import { initializeGrid } from '../../helpers/utils';
import { fetchNextGeneration } from '../thunks/gameThunks';
import { RootState } from '../store';
import gameReducer, { toggleCellAction, setBoardDimensionsAction, resetAction } from './gameSlice';

jest.mock('../../helpers/logger', () => ({
    log: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    }
}));

describe('gameSlice', () => {
    const initialState = {
        cols: initialCols,
        error: '',
        generationsCount: 0,
        grid: initializeGrid(initialRows, initialCols),
        rows: initialRows
    };

    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                game: gameReducer
            }
        });
    });

    it('should handle initial state correctly', () => {
        const state = (store.getState() as RootState).game;
        expect(state.generationsCount).toBe(0);
        expect(state.grid.length).toEqual(initialRows);
        expect(state.rows).toBe(initialRows);
        expect(state.cols).toBe(initialCols);
    });

    it('should handle setBoardDimensionsAction', () => {
        const newDimensions = { rows: 5, cols: 5 };
        store.dispatch(setBoardDimensionsAction(newDimensions));

        const state = (store.getState() as RootState).game;
        expect(state.grid.length).toEqual(5);
        expect(state.rows).toBe(newDimensions.rows);
        expect(state.cols).toBe(newDimensions.cols);
    });

    it('should handle toggleCellAction', () => {
        const row = 0;
        const col = 0;

        // Toggle the cell
        store.dispatch(toggleCellAction({ row, col }));
        const stateAfterToggle = (store.getState() as RootState).game;
        expect(stateAfterToggle.grid[row][col]).toBe(true);

        // Toggle the cell back
        store.dispatch(toggleCellAction({ row, col }));
        const stateAfterSecondToggle = (store.getState() as RootState).game;
        expect(stateAfterSecondToggle.grid[row][col]).toBe(false);
    });

    it('should handle resetAction', () => {
        store.dispatch(toggleCellAction({ row: 0, col: 0 }));
        store.dispatch(resetAction());

        const state = (store.getState() as RootState).game;
        expect(state.grid.length).toEqual(initialRows);
        expect(state.grid[0][0]).toBe(false);
        expect(state.generationsCount).toBe(0);
    });

    it('should handle fetchNextGeneration.fulfilled action', async () => {
        const mockApiResponse = {
            grid: [
                [false, true],
                [true, false]
            ],
            generationsCount: 1
        };

        // Mock the async thunk result
        const action = { type: fetchNextGeneration.fulfilled.type, payload: mockApiResponse };
        const state = gameReducer(initialState, action);

        expect(state.grid).toEqual(mockApiResponse.grid);
        expect(state.generationsCount).toBe(mockApiResponse.generationsCount);
        expect(state.error).toBe('');
    });

    it('should handle fetchNextGeneration.rejected action', async () => {
        // Mock the async thunk result
        const action = {
            type: fetchNextGeneration.rejected.type,
            payload: 'Something went wrong',
            error: { message: 'Rejected' }
        };
        const state = gameReducer(initialState, action);

        expect(state.grid).toEqual(initialState.grid);
        expect(state.generationsCount).toBe(initialState.generationsCount);
        expect(state.error).toBe('Rejected');
    });
});

