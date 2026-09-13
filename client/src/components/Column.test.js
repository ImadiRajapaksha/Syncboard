import { render, screen, fireEvent } from '@testing-library/react';
import Column from './Column';

beforeEach(() => {
  global.fetch = jest.fn();
});

test('renders the column title, tasks, and add-task form', () => {
  const tasks = [{ _id: 't1', title: 'Task one', version: 0 }];
  render(<Column id="todo" title="To Do" tasks={tasks} token="t" boardId="b1" onRefreshNeeded={() => {}} />);

  expect(screen.getByText('To Do')).toBeInTheDocument();
  expect(screen.getByText('Task one')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('New task title')).toBeInTheDocument();
});

test('sends a PUT request when a task is dropped', async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, status: 200 });
  render(<Column id="done" title="Done" tasks={[]} token="t" boardId="b1" onRefreshNeeded={() => {}} />);

  const dropTarget = screen.getByText('Done').closest('.column');
  const dataTransfer = { getData: () => JSON.stringify({ id: 't1', version: 2 }) };

  fireEvent.drop(dropTarget, { dataTransfer });

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/tasks/t1'),
    expect.objectContaining({ method: 'PUT' })
  );
});