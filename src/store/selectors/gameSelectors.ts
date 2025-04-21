import { createSelector } from 'reselect';

import { countPopulation } from '../../lib/helpers/utils';
import { RootState } from '../store';

/**
 * Base selector to retrieve the entire Redux state.
 * Used as an input selector for more specific memoized selectors.
 *
 * @param {RootState} state - The entire Redux store state.
 * @returns {RootState} The complete state object.
 */
const selectState = (state: RootState) => state;

/**
 * Selector to retrieve the current game grid from the Redux state.
 * Uses memoization via reselect to avoid unnecessary recalculations 
 * when the grid hasn't changed.
 *
 * @returns {boolean[][]} The current grid state representing alive/dead cells.
 */
export const selectGrid = createSelector(
    [selectState],
    (state) => state?.game?.grid
);

/**
 * Selector to retrieve the current generation count from the game state.
 *
 * @param {RootState} state - The entire Redux store state.
 * @returns {number} The current generation count from the game state.
 */
export const selectGenerationsCount = createSelector(
    [selectState],
    (state) => state?.game?.generationsCount
);

/**
 * Selector to calculate and retrieve the population count from the game grid.
 * This selector uses the `countPopulation` helper function to compute the count.
 *
 * @param {boolean[][]} grid - The current state of the game grid.
 * @returns {number} The population count (total number of alive cells) in the grid.
 */
export const selectPopulationCount = createSelector(
    [selectGrid],
    (grid) => countPopulation(grid)
);
