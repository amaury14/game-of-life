import { directions } from '../../constants/constant';

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
 * Generates the next state (generation) of the game grid based on the current grid.
 * 
 * The function applies the rules of Conway's Game of Life to the current grid and computes the next grid state. 
 * The rules are as follows:
 * - A live cell survives to the next generation if it has exactly 2 or 3 live neighbors.
 * - A dead cell becomes alive if it has exactly 3 live neighbors.
 * 
 * The function also increments the generation count.
 * 
 * @param grid - The current grid.
 * 
 * @returns A new grid 2D array representing the next generation.
 */
export function getNextGeneration(grid: boolean[][]): boolean[][] {
    const rows = grid.length;
    const cols = grid[0].length;
    // Initializes a new grid with all dead cells
    const newGrid = initializeGrid(rows, cols);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(row, col, grid);
            // Apply Game of Life rules
            if (grid[row][col]) {
                newGrid[row][col] = neighbors === 2 || neighbors === 3;
            } else {
                newGrid[row][col] = neighbors === 3;
            }
        }
    }

    return newGrid;
}
