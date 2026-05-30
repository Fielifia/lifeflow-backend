# LifeFlow Fitness Backend

Backend API for LifeFlow Fitness.

Built with:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Docker

## Features

- User registration and login
- JWT authentication
- Workout management
- Workout templates
- Personal best calculation
- Statistics aggregation
- Exercise library integration
- Notes support

## Requirements

- Node.js 18+
- npm
- MongoDB

## Installation

```bash
git clone <repo-url>
cd lifeflow-backend
npm install
```

## Environment Variables

Copy `.env.example` to `.env`.

Example:

```env
PORT=5000
JWT_SECRET=your-secret
MONGO_URI=your-mongodb-uri
RAPIDAPI_KEY=your-api-key
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

Server runs on:

`http://localhost:5000`

## Testing

```bash
npm test
```

Uses Vitest for backend unit testing.

## Code Quality

```bash
npm run lint
npm run lint:fix
```

## Docker

```bash
npm run docker:dev
npm run docker:prod
```

## API Resources

```bash
/auth
/users
/workouts
/templates
/exercises
/stats
```

## Architecture

The backend follows a layered structure:

```bash
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── scripts/
```

## Related Repositories

- [Frontend](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-frontend)
- [Deployment](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-deploy)
- [Project Hub](https://gitlab.lnu.se/1dv613/student/sa226jf/project-hub)