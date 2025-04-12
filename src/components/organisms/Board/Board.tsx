import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { delayBetweenSteps, initialCols, initialRows } from '../../../lib/constants/constant';
import useAdvanceSteps from '../../../lib/hooks/useAdvanceSteps';
import { useAppDispatch } from '../../../lib/hooks/hooks';
import { selectGenerationsCount, selectGrid, selectPopulationCount } from '../../../lib/store/selectors/gameSelectors';
import { toggleCellAction, setBoardDimensionsAction, resetAction } from '../../../lib/store/slices/gameSlice';
import { fetchNextGeneration } from '../../../lib/store/thunks/gameThunks';
import Cell from '../../atoms/Cell/Cell';
import Controls from '../../atoms/Controls/Controls';
import './Board.css';

/**
 * Board component manages the main grid of cells in Conway's Game of Life.
 * It includes control buttons and handles the logic for cell toggling, simulation steps,
 * continuous simulation, and resetting the game.
 */
const Board: React.FC = () => {
    const { advanceSteps, cancelAdvance } = useAdvanceSteps(); // Custom hook for stepped simulation
    const appDispatch = useAppDispatch();
    const dispatch = useDispatch();

    // Select state from Redux
    const populationCount = useSelector(selectPopulationCount);
    const generationsCount = useSelector(selectGenerationsCount);
    const grid = useSelector(selectGrid);

    // Local state to track interval for automatic simulation
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    // Advances simulation by a defined number of steps using delay
    const advanceStepsFunc = useCallback((steps: number) => {
        advanceSteps(steps, delayBetweenSteps)
    }, [advanceSteps]);

    // Resets the game board
    const resetGame = useCallback(() => {
        dispatch(resetAction());
    }, [dispatch]);

    // Starts the game loop using setInterval
    const startGame = useCallback(() => {
        if (intervalId) return; // Prevent multiple intervals, already running
        const id = setInterval(() => {
            appDispatch(fetchNextGeneration());
        }, delayBetweenSteps);
        setIntervalId(id);
    }, [appDispatch, intervalId]);

    // Advances the simulation by a single generation
    const step = useCallback(() => {
        appDispatch(fetchNextGeneration());
    }, [appDispatch]);

    // Pauses the game simulation by clearing interval or canceling timeout sequence
    const pauseGame = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        } else {
            cancelAdvance();
        }
    }, [intervalId, cancelAdvance]);

    // Toggles a single cell on the board
    const toggleCell = useCallback((row: number, col: number) => {
        dispatch(toggleCellAction({ row, col }));
    }, [dispatch]);

    // Initialize board dimensions on mount
    useEffect(() => {
        dispatch(setBoardDimensionsAction({
            cols: initialCols,
            rows: initialRows
        }));
    }, [dispatch]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <div className="board-container">
            <div className="controls-container">
                {/* Display current population and generation count */}
                <span
                    aria-label={`Population: ${populationCount}`}
                    className="controls-label">
                    Population: {populationCount}
                </span>
                <span
                    aria-label={`Generations: ${generationsCount}`}
                    className="controls-label">
                    Generations: {generationsCount}
                </span>

                {/* Control panel to interact with the board */}
                <Controls
                    advanceSteps={advanceStepsFunc}
                    pauseGame={pauseGame}
                    resetGame={resetGame}
                    startGame={startGame}
                    step={step}
                />
            </div>

            {/* Main grid rendering all cells */}
            <div className="board">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <Cell
                                ariaLabel={`Cell at row ${rowIndex + 1}, column ${colIndex + 1} is ${cell ? 'alive' : 'dead'}`}
                                isAlive={cell}
                                key={`${rowIndex}-${colIndex}`}
                                toggleCell={() => toggleCell(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;
