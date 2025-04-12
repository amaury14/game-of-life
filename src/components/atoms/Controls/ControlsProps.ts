export interface ControlsProps {
    advanceSteps: (steps: number) => void;
    pauseGame: () => void;
    resetGame: () => void;
    startGame: () => void;
    step: () => void;
}
