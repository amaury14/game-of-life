import { advanceStepsLogic, countNeighbors, countPopulation, initializeGrid, isInBounds } from './utils';

jest.useFakeTimers(); // Mock timers

describe('isInBounds', () => {
    const grid = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ];

    it('should return true for a valid cell (1,1)', () => {
        expect(isInBounds(1, 1, grid)).toBe(true);
    });

    it('should return false for negative row index', () => {
        expect(isInBounds(-1, 1, grid)).toBe(false);
    });

    it('should return false for negative column index', () => {
        expect(isInBounds(1, -1, grid)).toBe(false);
    });

    it('should return false for row index equal to grid length', () => {
        expect(isInBounds(3, 1, grid)).toBe(false);
    });

    it('should return false for column index equal to row length', () => {
        expect(isInBounds(1, 3, grid)).toBe(false);
    });

    it('should return false for indexes way out of bounds', () => {
        expect(isInBounds(100, 100, grid)).toBe(false);
    });

    it('should return true for bottom-right corner cell (2,2)', () => {
        expect(isInBounds(2, 2, grid)).toBe(true);
    });
});

describe('initializeGrid', () => {
    it('should create a grid with the correct number of rows and columns', () => {
        const rows = 4;
        const cols = 5;
        const grid = initializeGrid(rows, cols);

        expect(grid.length).toBe(rows);
        grid.forEach(row => {
            expect(row.length).toBe(cols);
        });
    });

    it('should initialize all cells to false', () => {
        const grid = initializeGrid(3, 3);
        grid.forEach(row => {
            row.forEach(cell => {
                expect(cell).toBe(false);
            });
        });
    });

    it('should return an empty array when rows or cols are zero', () => {
        expect(initializeGrid(0, 5)).toEqual([]);
        expect(initializeGrid(5, 0)).toEqual([[], [], [], [], []]);
    });

    it('should produce a new unique grid on each call', () => {
        const grid1 = initializeGrid(2, 2);
        const grid2 = initializeGrid(2, 2);
        expect(grid1).not.toBe(grid2); // different references
        expect(grid1).toEqual(grid2); // but same content
    });
});


describe('countNeighbors', () => {
    const grid = [
        [false, true, false],
        [true, true, false],
        [false, false, false]
    ];

    it('should count 2 neighbors for (1,1)', () => {
        expect(countNeighbors(1, 1, grid)).toBe(2);
    });

    it('should count 3 neighbors for (0,0)', () => {
        expect(countNeighbors(0, 0, grid)).toBe(3);
    });

    it('should count 1 neighbor for (2,2)', () => {
        expect(countNeighbors(2, 2, grid)).toBe(1);
    });

    it('should count 2 neighbor for (2,0)', () => {
        expect(countNeighbors(2, 0, grid)).toBe(2);
    });
});

describe('countPopulation', () => {
    it('should return 0 for an empty grid', () => {
        const grid: boolean[][] = [];
        expect(countPopulation(grid)).toBe(0);
    });

    it('should return 0 when all cells are false', () => {
        const grid = [
            [false, false],
            [false, false]
        ];
        expect(countPopulation(grid)).toBe(0);
    });

    it('should count the number of true cells correctly', () => {
        const grid = [
            [true, false],
            [false, true]
        ];
        expect(countPopulation(grid)).toBe(2);
    });

    it('should handle a grid with all cells true', () => {
        const grid = [
            [true, true],
            [true, true]
        ];
        expect(countPopulation(grid)).toBe(4);
    });

    it('should work on non-square grids', () => {
        const grid = [
            [true, false, true],
            [false, false, true]
        ];
        expect(countPopulation(grid)).toBe(3);
    });
});

describe('advanceStatesLogic', () => {
    let mockDispatch = jest.fn();
    let timeoutRef: React.RefObject<NodeJS.Timeout | null>;

    beforeEach(() => {
        jest.useFakeTimers();
        mockDispatch = jest.fn();
        timeoutRef = { current: null };
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should dispatch fetchNextGeneration actions the correct number of times with the specified delay', () => {
        const steps = 3;
        const delay = 1000;

        // Call the helper function
        advanceStepsLogic(timeoutRef, steps, delay, mockDispatch);

        // The first dispatch should have happened immediately:
        expect(mockDispatch).toHaveBeenCalledTimes(1);

        // Advance timers by 1000ms => Second dispatch should occur:
        jest.advanceTimersByTime(delay);
        expect(mockDispatch).toHaveBeenCalledTimes(2);

        // Advance timers by another 1000ms => Third dispatch:
        jest.advanceTimersByTime(delay);
        expect(mockDispatch).toHaveBeenCalledTimes(3);

        // Advance timers further; no additional dispatches should occur:
        jest.advanceTimersByTime(delay);
        expect(mockDispatch).toHaveBeenCalledTimes(3);
    });
});

