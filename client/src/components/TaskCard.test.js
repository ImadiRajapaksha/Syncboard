import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskCard from './TaskCard';

const task = { _id: 't1', title: 'Write report', version: 2 };

beforeEach(() => {
  global.fetch = jest.fn();
  window.confirm = jest.fn(() => true);
});

test('renders the task title and Edit/Delete buttons', () => {
  render(<TaskCard task={task} token="t" onRefreshNeeded={() => {}} />);
  expect(screen.getByText('Write report')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
});

test('switches to edit mode and saves a new title', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ...task, title: 'Updated', version: 3 }) });
  render(<TaskCard task={task} token="t" onRefreshNeeded={() => {}} />);

  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  const input = screen.getByDisplayValue('Write report');
  fireEvent.change(input, { target: { value: 'Updated' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/tasks/t1'),
    expect.objectContaining({ method: 'PUT' })
  ));
});

test('calls onRefreshNeeded on a 409 conflict during edit', async () => {
  global.fetch.mockResolvedValueOnce({ status: 409 });
  const onRefreshNeeded = jest.fn();
  render(<TaskCard task={task} token="t" onRefreshNeeded={onRefreshNeeded} />);

  fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
  fireEvent.change(screen.getByDisplayValue('Write report'), { target: { value: 'Updated' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));

  await waitFor(() => expect(onRefreshNeeded).toHaveBeenCalled());
});

test('deletes the task after confirmation', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, status: 204 });
  render(<TaskCard task={task} token="t" onRefreshNeeded={() => {}} />);

  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/tasks/t1'),
    expect.objectContaining({ method: 'DELETE' })
  ));
});

test('does not delete if the user cancels the confirmation', () => {
  window.confirm = jest.fn(() => false);
  render(<TaskCard task={task} token="t" onRefreshNeeded={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(global.fetch).not.toHaveBeenCalled();
});