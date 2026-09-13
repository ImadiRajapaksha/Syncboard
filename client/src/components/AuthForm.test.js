import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';

beforeEach(() => {
  global.fetch = jest.fn();
  localStorage.clear();
});

test('renders the login form by default', () => {
  render(<AuthForm onAuthSuccess={() => {}} />);
  expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

test('toggles to the register form', () => {
  render(<AuthForm onAuthSuccess={() => {}} />);
  fireEvent.click(screen.getByText('Need an account? Register'));
  expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
});

test('calls onAuthSuccess with a token on successful login', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ token: 'fake-token', user: { id: '1', email: 'a@a.com' } }),
  });
  const onAuthSuccess = jest.fn();
  render(<AuthForm onAuthSuccess={onAuthSuccess} />);

  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@a.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

  await waitFor(() => expect(onAuthSuccess).toHaveBeenCalledWith('fake-token'));
  expect(localStorage.getItem('syncboard_token')).toBe('fake-token');
});

test('shows an error message on failed login', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: 'Invalid credentials' }),
  });
  render(<AuthForm onAuthSuccess={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@a.com' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

  expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
});