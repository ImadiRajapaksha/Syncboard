let boards = [
  {
    id: "board1",
    name: "SyncBoard",
    columns: [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "Doing" },
      { id: "done", title: "Done" },
    ],
  },
];

let tasks = [
  { id: "1", boardId: "board1", columnId: "todo", title: "Design wireframes" },
  { id: "2", boardId: "board1", columnId: "todo", title: "Set up repo" },
  { id: "3", boardId: "board1", columnId: "doing", title: "Build Board component" },
];

module.exports = { boards, tasks };