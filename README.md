# SyncBoard

A Kanban-style team task board — full-stack workshop project.

## Team

- Rajapaksha I A (36297) — MongoDB Atlas setup, Mongoose connection, backend restructure (routes/controllers/models)
- Arachchi W A S G T W (37325) — Task model and controller (MongoDB CRUD)
- Kavindya E M S (36076) — Version-based conflict detection, schema diagram
- Gimhani K H H T (37307) — JWT authentication (register, login, protected routes)
- Thejali D A S K (34939) — README updates, database documentation, Postman collection

## How to Run

1. Clone the repository:
   \\\`
   git clone https://github.com/ImadiRajapaksha/Syncboard.git
   \\\`
2. Navigate to the client folder:
   \\\`
   cd Syncboard/client
   \\\`
3. Install dependencies:
   \\\`
   npm install
   \\\`
4. Start the development server:
   \\\`
   npm start
   \\\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend API

The backend is an Express server providing REST endpoints for boards and tasks (currently using mock data — MongoDB integration is planned for a later milestone).

### Running the backend

1. Navigate to the server folder:
   \`\`\`
   cd Syncboard/server
   \`\`\`
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Start the server:
   \`\`\`
   npm run dev
   \`\`\`
4. The API will be available at [http://localhost:5000](http://localhost:5000).

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/boards | Get all boards |
| GET | /api/boards/:id | Get a single board |
| GET | /api/boards/:id/columns | Get columns (with tasks) for a board |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a single task |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

### API Documentation

A Postman collection covering all endpoints is available at `api-docs/SyncBoard API.postman_collection.json`. Import it into Postman to test the API directly.

### Running the full app (frontend + backend)

1. Start the backend (see above) — leave it running.
2. In a separate terminal, start the frontend:

```bash
cd Syncboard/client
npm install
npm start
```

3. Open http://localhost:3000 — the board will load data live from the backend API.## Database

SyncBoard uses MongoDB Atlas (free tier) via Mongoose. Boards and Tasks are stored as documents; Tasks reference their parent Board by ID. A schema diagram is available at docs/schema-diagram.png.

### Setting up your own database connection

1. Create a free MongoDB Atlas account and cluster.
2. Create a `.env` file inside the server folder (not committed to Git) containing:

```env
MONGODB_URI=your-connection-string-here
JWT_SECRET=your-secret-string-here
PORT=5000
```

3. Ask a team member for the shared connection string during development, or set up your own cluster.

### Seeding sample data

```bash
cd Syncboard/server
node seed.js
```