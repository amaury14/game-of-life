import { getNextGeneration } from '../gameService';

describe('getNextGeneration', () => {
    it('should return a new generation with correct updates', () => {
        const initialGrid = [
            [false, true, false],
            [false, true, false],
            [false, true, false]
        ];

        const initialState = {
            cols: 3,
            error: '',
            generationsCount: 0,
            grid: initialGrid,
            rows: 3
        };

        const result = getNextGeneration(initialState);

        expect(result.grid).toEqual([
            [false, false, false],
            [true, true, true],
            [false, false, false]
        ]);
        expect(result.generationsCount).toBe(1);
    });

    it('should return the same empty grid if all cells are dead', () => {
        const emptyGrid = [
            [false, false, false],
            [false, false, false],
            [false, false, false]
        ];

        const initialState = {
            cols: 3,
            error: '',
            generationsCount: 5,
            grid: emptyGrid,
            rows: 3
        };

        const result = getNextGeneration(initialState);

        expect(result.grid).toEqual(emptyGrid);
        expect(result.generationsCount).toBe(6); // count must increase
    });

    it('should bring a cell to life if it has exactly 3 neighbors', () => {
        const initialGrid = [
            [true, true, false],
            [false, false, false],
            [false, true, false]
        ];

        const initialState = {
            cols: 3,
            error: '',
            generationsCount: 0,
            grid: initialGrid,
            rows: 3
        };

        const result = getNextGeneration(initialState);

        // The cell (1,1) must be "born"
        expect(result.grid[1][1]).toBe(true);
        expect(result.generationsCount).toBe(1);
    });
});
