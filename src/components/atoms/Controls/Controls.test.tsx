import { render, screen, fireEvent } from '@testing-library/react';
import Controls from './Controls';

describe('Controls component', () => {
    const mockStep = jest.fn();
    const mockStart = jest.fn();
    const mockPause = jest.fn();
    const mockReset = jest.fn();
    const mockAdvance = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls step when "Advance One Generation" button is clicked', () => {
        render(<Controls step={mockStep} startGame={mockStart} pauseGame={mockPause} resetGame={mockReset} advanceSteps={mockAdvance} />);
        fireEvent.click(screen.getByRole('button', { name: /Advance one generation/i }));
        expect(mockStep).toHaveBeenCalled();
    });

    it('calls startGame when "Start Game Simulation" button is clicked', () => {
        render(<Controls step={mockStep} startGame={mockStart} pauseGame={mockPause} resetGame={mockReset} advanceSteps={mockAdvance} />);
        fireEvent.click(screen.getByRole('button', { name: /Start game simulation/i }));
        expect(mockStart).toHaveBeenCalled();
    });

    it('calls pauseGame when "Pause Game Simulation" button is clicked', () => {
        render(<Controls step={mockStep} startGame={mockStart} pauseGame={mockPause} resetGame={mockReset} advanceSteps={mockAdvance} />);
        fireEvent.click(screen.getByRole('button', { name: /Pause game simulation/i }));
        expect(mockPause).toHaveBeenCalled();
    });

    it('calls resetGame when "Reset Game Simulation" button is clicked', () => {
        render(<Controls step={mockStep} startGame={mockStart} pauseGame={mockPause} resetGame={mockReset} advanceSteps={mockAdvance} />);
        fireEvent.click(screen.getByRole('button', { name: /Reset game simulation/i }));
        expect(mockReset).toHaveBeenCalled();
    });

    it('updates the steps input and calls advanceStates with correct value', () => {
        render(<Controls step={mockStep} startGame={mockStart} pauseGame={mockPause} resetGame={mockReset} advanceSteps={mockAdvance} />);

        const input = screen.getByLabelText(/number of generations to advance/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: '5' } });

        // Verify internal state is reflected in the button text
        expect(screen.getByRole('button', { name: /Advance 5 generations/i })).toBeInTheDocument();

        // Trigger the advance button
        fireEvent.click(screen.getByRole('button', { name: /Advance 5 generations/i }));

        expect(mockAdvance).toHaveBeenCalledWith(5);
    });
});
