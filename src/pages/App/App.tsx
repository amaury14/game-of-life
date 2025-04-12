import React from 'react';

import Board from '../../components/organisms/Board/Board';
import './App.css';

/**
 * App component is the root component of the Game of Life application.
 * It renders the main title, game board, and a footer.
 */
const App: React.FC = () => {
    return (
        <div className="app-container">
            {/* Application title */}
            <h2 className="app-header">Game of Life</h2>

            {/* Main game board component */}
            <main className="board-wrapper">
                <Board />
            </main>

            {/* Footer with copyright */}
            <footer className="app-footer">
                <p>© 2025 Conway&apos;s Game of Life</p>
            </footer>
        </div>
    );
}

export default App;
