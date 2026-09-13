import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTaskForm from './AddTaskForm';

beforeEach(() => {
  global.fetch = jest.fn();
});

test('renders an input and a disabled Add button when empty', () => {
  render(<AddTaskForm token="t" boardId="b1" columnId="todo" />);
  expect(screen.getByPlaceholderText('New task title')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '+ Add' })).toBeDisabled();
});

test('enables the Add button once text is typed', () => {
  render(<AddTaskForm token="t" boardId="b1" columnId="todo" />);
  fireEvent.change(screen.getByPlaceholderText('New task title'), { target: { value: 'New task' } });
  expect(screen.getByRole('button', { name: '+ Add' })).toBeEnabled();
});

test('submits the task and clears the input on success', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
  render(<AddTaskForm token="t" boardId="b1" columnId="todo" />);

  const input = screen.getByPlaceholderText('New task title');
  fireEvent.change(input, { target: { value: 'New task' } });
  fireEvent.click(screen.getByRole('button', { name: '+ Add' }));

  await waitFor(() => expect(input.value).toBe(''));
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/tasks'),
    expect.objectContaining({ method: 'POST' })
  );
});

test('shows an error message if creation fails', async () => {
  global.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Could not create' }) });
  render(<AddTaskForm token="t" boardId="b1" columnId="todo" />);

  fireEvent.change(screen.getByPlaceholderText('New task title'), { target: { value: 'New task' } });
  fireEvent.click(screen.getByRole('button', { name: '+ Add' }));

  expect(await screen.findByText('Could not create')).toBeInTheDocument();
});