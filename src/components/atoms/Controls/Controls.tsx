import React, { ChangeEvent, useState } from 'react';

import './Controls.css';
import { ControlsProps } from './ControlsProps';

/**
 * Controls component provides user interface buttons and inputs
 * to control the Game of Life simulation (advance, start, pause,
 * advance (x), reset).
 */
const Controls: React.FC<ControlsProps> = ({ advanceSteps, pauseGame, resetGame, startGame, step }) => {
    // Local state to keep track of how many steps (generations) to advance
    const [steps, setSteps] = useState<number>(1);

    // Handle change in the input for number of steps
    const onStepsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSteps(parseInt(e.target.value, 10) || 0);
    };

    // Call the advanceStates function passed via props using the selected steps
    const advanceXSteps = () => {
        advanceSteps(steps);
    };

    return (
        <div className="controls">
            {/* Buttons for basic simulation control */}
            <button aria-label="Advance One Generation" onClick={step}>Advance One Generation</button>
            <button aria-label="Start Game Simulation" onClick={startGame}>Start Game Simulation</button>
            <button aria-label="Pause Game Simulation" onClick={pauseGame}>Pause Game Simulation</button>

            {/* Input and button to advance multiple generations */}
            <div className="advance-container">
                <label className="advance-label" htmlFor="steps-input">Advance generations:</label>
                <input
                    aria-label="Number of generations to advance"
                    className="advance-input"
                    id="steps-input"
                    min="1"
                    type="number"
                    value={steps}
                    onChange={onStepsChange}
                />
                <button aria-label={`Advance ${steps} Generations`} onClick={advanceXSteps}>
                    Advance {steps} Generations
                </button>
            </div>
            {/* Reset the game to the initial state */}
            <button aria-label="Reset Game Simulation" onClick={resetGame}>Reset Game Simulation</button>
        </div>
    );
};

export default Controls;
