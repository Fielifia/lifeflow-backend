# LifeFlow Fitness Backend

Backend API for LifeFlow Fitness.

Built with:

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Features

- User registration and login
- JWT authentication
- Workout management
- Workout templates
- Personal best detection
- Statistics aggregation
- Exercise library integration
- Notes support

## Requirements

- Node.js 22+
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

Server runs on:

`http://localhost:5000`

Uses nodemon for automatic server reload during development.

## Production

```bash
npm start
```
Starts the Express server in production mode.

The API is typically deployed through Docker and served behind a reverse proxy.

## Testing

Run automated tests:

```bash
npm test
```

Unit tests are implemented using Vitest and executed automatically in the CI/CD pipeline.

## CI/CD

The backend is automatically validated through GitLab CI/CD.

Pipeline checks include:

- ESLint
- Vitest unit tests
- Docker image build verification

All checks must pass before deployment.

## Code Quality

```bash
npm run lint
npm run lint:fix
```

The project uses ESLint and JSDoc conventions to maintain code quality and consistency.

## API Resources

```txt
/auth
/exercises
/stats
/templates
/users
/workouts
```

## Architecture

The backend follows a layered structure:

```txt
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── scripts/
├── app.js
└── server.js
```

## License

This project is licensed under the MIT License. See the [LICENSE](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-backend/-/blob/main/LICENSE?ref_type=heads) file for details.

## Related Repositories

- [Frontend](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-frontend)
- [Deployment](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-deploy)
- [Project Hub](https://gitlab.lnu.se/1dv613/student/sa226jf/project-hub)