# LifeFlow Backend
Backend API for the LifeFlow Fitness project.
This is a Node.js + Express server that will power the LifeFlow application.

## Requirements
- Node.js (recommended v18+)
- npm

## Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd lifeflow-backend
npm install
```

## Run the development server
Start the server with:
```bash
node index.js
```
The server will run on:
```
http://localhost:5000
```
If everything works, visiting the URL in your browser should show:
```bash
"Hello from the backend 🚀"
```

## Environment variables
Create a `.env` file in the root of the project and copy the content from `.env.example`.

Example:
```bash
PORT=5000
```

## Available endpoints
### GET /
Test endpoint to verify that the backend is running.

Response:
```bash
"Hello from the backend 🚀"
```
