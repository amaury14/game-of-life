import { countNeighbors, initializeGrid } from '../lib/helpers/utils';
import { GameState } from '../lib/types/gameState';

/**
 * Generates the next state (generation) of the game grid based on the current state.
 * 
 * The function applies the rules of Conway's Game of Life to the current grid and computes the next grid state. 
 * The rules are as follows:
 * - A live cell survives to the next generation if it has exactly 2 or 3 live neighbors.
 * - A dead cell becomes alive if it has exactly 3 live neighbors.
 * 
 * The function also increments the generation count.
 * 
 * @param currentState - The current state of the game, including the grid and the generations count.
 * 
 * @returns A new `GameState` object representing the next generation, with an updated grid and generations count.
 */
export function getNextGeneration(currentState: GameState): GameState {
    const { grid, generationsCount } = currentState;
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

    return {
        ...currentState,
        generationsCount: generationsCount + 1, 
        grid: newGrid,
    };
}
