import { render, screen, fireEvent } from '@testing-library/react';

import Board from '../Board/Board';

// Basic grid mock (2x2)
const mockGrid = [
    [true, false],
    [false, true]
];

// Mocks for hooks and dispatch
const mockDispatch = jest.fn();
const mockAppDispatch = jest.fn();
const mockAdvanceSteps = jest.fn();

// Manually control the selections
jest.mock('react-redux', () => ({
    useSelector: (selectorFn: any) =>
        selectorFn({
            game: {
                cols: 2,
                error: '',
                generationsCount: 5,
                grid: mockGrid,
                rows: 2
            }
        }),
    useDispatch: () => mockDispatch,
}));

// Hooks Mock
jest.mock('../../../store/hooks/hooks', () => ({
    useAppDispatch: () => mockAppDispatch
}));

// useAdvanceStates Mock
jest.mock('../../../store/hooks/useAdvanceSteps', () => () => mockAdvanceSteps);

// Thunk Mock
jest.mock('../../../store/thunks/gameThunks', () => ({
    fetchNextGeneration: () => ({ type: 'FETCH_NEXT_GEN' })
}));

// Cell Mock with interaction
jest.mock('../../atoms/Cell/Cell', () => ({
    __esModule: true,
    default: ({ isAlive, toggleCell, ariaLabel }: any) => (
        <div data-testid="cell" aria-label={ariaLabel} onClick={toggleCell}>
            {isAlive ? '🟩' : '⬜'}
        </div>
    )
}));

// Controls Mock with Interactive Buttons
jest.mock('../../atoms/Controls/Controls', () => ({
    __esModule: true,
    default: ({ step, startGame, pauseGame, resetGame }: any) => (
        <div data-testid="controls">
            <button onClick={step}>Step</button>
            <button onClick={startGame}>Start</button>
            <button onClick={pauseGame}>Pause</button>
            <button onClick={resetGame}>Reset</button>
        </div>
    )
}));

describe('Board component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders stats, cells, and controls', () => {
        render(<Board />);

        expect(screen.getByText(/Population:/)).toBeInTheDocument();
        expect(screen.getByText(/Generations: 5/)).toBeInTheDocument();

        const cells = screen.getAllByTestId('cell');
        expect(cells).toHaveLength(4); // 2x2

        expect(screen.getByTestId('controls')).toBeInTheDocument();
    });

    it('clicks a cell and calls toggleCell', () => {
        render(<Board />);
        const cell = screen.getAllByTestId('cell')[0];

        fireEvent.click(cell);

        expect(mockDispatch).toHaveBeenCalledWith({
            type: expect.any(String),
            payload: { row: 0, col: 0 },
        });
    });

    it('calls control buttons correctly', () => {
        render(<Board />);

        fireEvent.click(screen.getByText('Step'));
        fireEvent.click(screen.getByText('Start'));
        fireEvent.click(screen.getByText('Pause'));
        fireEvent.click(screen.getByText('Reset'));

        expect(mockAppDispatch).toHaveBeenCalledWith({ type: 'FETCH_NEXT_GEN' });
        expect(mockDispatch).toHaveBeenCalledWith({ type: expect.stringMatching(/resetAction/) });
    });
});
