import { directions } from '../constants/constant';
import { fetchNextGeneration } from '../store/thunks/gameThunks';

/**
 * Initializes a grid with the specified number of rows and columns, 
 * filling all cells with `false` to represent dead cells.
 * 
 * @param rows - The number of rows in the grid.
 * @param cols - The number of columns in the grid.
 * 
 * @returns A 2D array (grid) with the specified dimensions, where each cell is initialized to `false`.
 */
export const initializeGrid = (rows: number, cols: number): boolean[][] =>
    Array.from({ length: rows }, () => Array(cols).fill(false));

/**
 * Checks if the given row and column are within the bounds of the grid.
 * 
 * @param row - The row index to check.
 * @param col - The column index to check.
 * @param grid - The 2D grid (array of boolean values) to check against.
 * 
 * @returns `true` if the row and column are within the grid's dimensions, `false` otherwise.
 */
export const isInBounds = (row: number, col: number, grid: boolean[][]): boolean =>
    row >= 0 && row < grid?.length && col >= 0 && col < grid[0].length;

/**
 * Counts the number of live neighbors around a given cell in the grid.
 * 
 * A cell's neighbors are the adjacent cells in the grid (horizontally, vertically, and diagonally).
 * The function considers cells that are within the grid bounds and are marked as `true` (alive).
 * 
 * @param row - The row index of the cell to check.
 * @param col - The column index of the cell to check.
 * @param grid - The 2D grid (array of boolean values) to check for live neighbors.
 * 
 * @returns The number of live neighbors (cells with `true` value) around the given cell.
 */
export const countNeighbors = (row: number, col: number, grid: boolean[][]): number => {
    return directions.reduce((count, [dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;

        return isInBounds(newRow, newCol, grid) && grid[newRow][newCol] ? count + 1 : count;
    }, 0);
};

/**
 * Counts the total number of live cells (cells with `true` value) in the grid.
 * 
 * This function iterates through the entire grid and sums the number of cells that are alive.
 * 
 * @param grid - The 2D grid (array of boolean values) representing the state of the cells.
 * 
 * @returns The total number of live cells in the grid.
 */
export const countPopulation = (grid: boolean[][]): number => {
    return grid.flat().reduce((acc, cell) => acc + (cell ? 1 : 0), 0);
}

/**
 * Advances the game states by executing the given number of steps with a specified delay between each step.
 * 
 * This function recursively dispatches an action (`fetchNextGeneration`) at each step, with a delay between steps.
 * It uses a timeout to control the delay and ensures the steps are executed in order.
 * The process stops once the desired number of steps (`steps`) is reached.
 * 
 * @param timeoutRef - A reference to store the current timeout, used to clear the timeout if necessary.
 * @param steps - The total number of steps to advance the game.
 * @param delay - The delay (in milliseconds) between each step.
 * @param dispatch - The dispatch function to trigger the action (e.g., `fetchNextGeneration`).
 * 
 * @returns void
 */
export const advanceStepsLogic = (
    timeoutRef: React.RefObject<NodeJS.Timeout | null>,
    steps: number,
    delay: number,
    dispatch: (action: unknown) => void
): void => {
    const executeStep = (timeoutRef: React.RefObject<NodeJS.Timeout | null>, step: number) => {
        if (step < steps) {
            dispatch(fetchNextGeneration());
            timeoutRef.current = setTimeout(() => executeStep(timeoutRef, step + 1), delay);
        }
    };
    executeStep(timeoutRef, 0);
};
