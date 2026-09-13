import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Board', () => () => <div>Mock Board</div>);

beforeEach(() => {
  localStorage.clear();
});

test('shows the login form when there is no saved token', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
});

test('shows the board when a token is already saved', () => {
  localStorage.setItem('syncboard_token', 'saved-token');
  render(<App />);
  expect(screen.getByText('Mock Board')).toBeInTheDocument();
});