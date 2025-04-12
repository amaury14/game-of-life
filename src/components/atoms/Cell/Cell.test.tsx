import { render, screen, fireEvent } from '@testing-library/react';
import Cell from './Cell';

describe('Cell component', () => {
    const mockToggleCell = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders as alive when isAlive is true', () => {
        render(<Cell isAlive={true} toggleCell={mockToggleCell} ariaLabel="Cell 1" />);
        const cell = screen.getByRole('button', { name: /Cell 1/i });

        expect(cell).toHaveClass('cell');
        expect(cell).toHaveClass('alive');
        expect(cell).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders as dead when isAlive is false', () => {
        render(<Cell isAlive={false} toggleCell={mockToggleCell} ariaLabel="Cell 2" />);
        const cell = screen.getByRole('button', { name: /Cell 2/i });

        expect(cell).toHaveClass('cell');
        expect(cell).not.toHaveClass('alive');
        expect(cell).toHaveAttribute('aria-pressed', 'false');
    });

    it('calls toggleCell on click', () => {
        render(<Cell isAlive={false} toggleCell={mockToggleCell} ariaLabel="Clickable Cell" />);
        const cell = screen.getByRole('button', { name: /Clickable Cell/i });

        fireEvent.click(cell);
        expect(mockToggleCell).toHaveBeenCalled();
    });
});
