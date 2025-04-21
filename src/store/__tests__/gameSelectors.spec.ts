
import { selectGenerationsCount, selectGrid, selectPopulationCount } from '../selectors/gameSelectors';
import { RootState } from '../store';

// Helper to create mock grid
const createGrid = (rows: number, cols: number, aliveCells: number[][]): boolean[][] => {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    for (const [r, c] of aliveCells) {
        grid[r][c] = true;
    }
    return grid;
};

describe('gameSelectors', () => {
    const mockGrid = createGrid(3, 3, [
        [0, 0],
        [1, 1],
        [2, 2]
    ]); // 3 alive cells

    const mockState: RootState = {
        game: {
            cols: 3,
            error: '',
            generationsCount: 5,
            grid: mockGrid,
            rows: 3
        }
    } as RootState;

    test('selectGrid should return the grid', () => {
        const result = selectGrid(mockState);
        expect(result).toEqual(mockGrid);
    });

    test('selectGenerationsCount should return the generations count', () => {
        const result = selectGenerationsCount(mockState);
        expect(result).toBe(5);
    });

    test('selectPopulationCount should return the correct population count', () => {
        const result = selectPopulationCount(mockState);
        expect(result).toBe(3); // we have 3 alive cells
    });
});
