# Rate-Limited URL Shortener

A modern, rate-limited URL shortener built with React (Vite), Node.js, Express, and MongoDB.

## 🚀 Getting Started with Docker

The easiest way to run this application is using Docker. You don't need to have Node.js or MongoDB installed directly on your machine.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

> **Note:** When using Docker, no `.env` files are needed. Environment variables are configured automatically via `docker-compose.yml`.

> **Note:** Ensure ports `5178`, `3004`, and `27017` are not in use before running.

### Running the App

1. **Clone the repository:**
```bash
   git clone https://github.com/Rahulkarna-cdr/Rate-Limited_URl_Shortener.git
   cd Rate-Limited_URl_Shortener
```

2. **Start the containers:**
```bash
   docker compose up --build
```

3. **Access the application:**
   - **Frontend UI:** Open your browser and go to `http://localhost:5178`
   - **Backend API:** `http://localhost:3004` (Health check: `http://localhost:3004/health`)

4. **To stop the application:**
   Press `Ctrl + C` in the terminal, or run the following command in another terminal window inside the project directory:
```bash
   docker compose down
```

## 🛠️ Architecture
- **Frontend:** React + Vite (Served via Nginx in production)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Running locally from official Docker image)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Shorten a URL |
| GET | `/:shortCode` | Redirect to original URL |
| GET | `/api/links` | Get recent links |
| GET | `/api/analytics/:shortCode` | Get click analytics |


## 💻 Manual Setup (Without Docker)

If you prefer to run it locally without Docker:

**1. Setup MongoDB**
Ensure you have a MongoDB instance running locally or a MongoDB Atlas URI.

**2. Backend Setup:**
```bash
cd backend
npm install
npm run dev
```
Create a `.env` inside `backend/` with the following:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri_here
```

**3. Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```
Create a `.env` inside `frontend/` with the following:
```env
VITE_API_BASE_URL=http://localhost:3000
```