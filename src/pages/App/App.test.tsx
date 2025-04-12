import { render, screen } from '@testing-library/react';

import App from './App';

describe('App component', () => {
    it('renders the header and footer', () => {
        render(<App />);

        const elements = screen.getAllByText(/Game of Life/i);
        expect(elements).toHaveLength(2);

        const header = elements.find((el) => el.closest('header') || el.tagName === 'H2');
        const footer = elements.find((el) => el.closest('footer') || el.tagName === 'FOOTER' || el.parentElement?.className.includes('footer'));

        expect(header).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });
});
