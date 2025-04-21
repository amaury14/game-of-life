import { useCallback, useRef } from 'react';

import { advanceStepsLogic } from '../../lib/helpers/utils';
import { useAppDispatch } from './hooks';

/**
 * Custom hook to handle advancing game generations with a delay.
 * 
 * This hook provides a mechanism for advancing the game state by a specified number of steps, with a delay between 
 * each step. It also includes functionality to cancel the generation advancement process. It uses a timeout reference
 * (`timeoutRef`) to manage the cancellation of the timeout if needed. 
 * 
 * @returns An object with two properties:
 *   - `advanceStates`: A function that advances the generations by a specified number of steps and delay.
 *   - `cancelAdvance`: A function that cancels the scheduled generation advancement.
 */
const useAdvanceSteps = () => {
    const appDispatch = useAppDispatch();
    // Timeout ref to cancel proccess
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Advance generations using steps and delay, use custom hook dispatch to get the next generation
    const advanceSteps = useCallback((steps: number, delay = 500) => {
        advanceStepsLogic(timeoutRef, steps, delay, appDispatch);
    }, [appDispatch]);

    // Cancel the the dispatch of the generations
    const cancelAdvance = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return { advanceSteps, cancelAdvance };
};

export default useAdvanceSteps;
