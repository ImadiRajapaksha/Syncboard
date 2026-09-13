import { render, screen } from '@testing-library/react';
import Board from './Board';

jest.mock('socket.io-client', () => ({
  io: () => ({ on: jest.fn(), disconnect: jest.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
});

test('renders columns and tasks once data loads', async () => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/columns')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: 'todo', title: 'To Do', tasks: [{ id: 't1', title: 'Write tests' }] },
        ],
      });
    }
    return Promise.resolve({ ok: true, json: async () => [{ _id: 'board1' }] });
  });

  render(<Board token="fake-token" />);

  expect(await screen.findByText('To Do')).toBeInTheDocument();
  expect(screen.getByText('Write tests')).toBeInTheDocument();
});

test('shows cached data immediately if present in localStorage', () => {
  localStorage.setItem(
    'syncboard_cache',
    JSON.stringify({
      boardId: 'board1',
      columns: [{ id: 'todo', title: 'To Do', tasks: [] }],
      savedAt: Date.now(),
    })
  );
  global.fetch = jest.fn(() => new Promise(() => {}));
  render(<Board token="fake-token" />);
  expect(screen.getByText('To Do')).toBeInTheDocument();
});