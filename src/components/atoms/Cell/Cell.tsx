import React from 'react';

import './Cell.css';
import { CellProps } from './CellProps';

/**
 * Cell component represents a single cell in the Game of Life grid.
 * It is optimized with React.memo to avoid unnecessary re-renders when props don't change.
 */
const Cell: React.FC<CellProps> = React.memo(({ ariaLabel, isAlive, toggleCell }) => {
    return (
        <div
            // Accessibility: make the div behave like a button
            aria-label={ariaLabel}
            aria-pressed={isAlive}
            role="button"
            // Apply class "cell" and conditionally add "alive" if the cell is active
            className={`cell ${isAlive ? 'alive' : ''}`}
            // Handle click to toggle the cell's state
            onClick={toggleCell}
        />
    );
});

// Set a display name for easier debugging in React DevTools
Cell.displayName = 'Cell';

export default Cell;
