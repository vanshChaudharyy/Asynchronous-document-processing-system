# Asynchronous Document Processing API

## 🚀 Overview

This system allows users to submit documents for asynchronous processing using a scalable, queue-based architecture. It ensures non-blocking API behavior and reliable background execution.

---

## 🧱 Architecture

Client → Express API → Redis Queue → Worker → MongoDB

- **Express API**: Handles incoming requests and job creation
- **BullMQ + Redis**: Manages job queue and retry logic
- **Worker**: Processes jobs asynchronously
- **MongoDB**: Persists job state and results

---

## ⚙️ Tech Stack

- Node.js (Express)
- BullMQ + Redis
- MongoDB (Mongoose)
- Axios (for webhook callbacks)
- Docker (optional)

---

## ✨ Features

- Asynchronous job processing
- Job status tracking (queued, processing, completed, failed)
- Retry mechanism (3 attempts with exponential backoff)
- Concurrent processing (worker concurrency = 5)
- Webhook callback on job completion/failure
- Persistent storage using MongoDB

---

## 📡 API Endpoints

### 🔹 Create Job

**POST /jobs**

Request:

```json
{
  "file_url": "https://example.com/doc.pdf",
  "webhook_url": "optional"
}
```

Response:

```json
{
  "job_id": "uuid",
  "status": "queued"
}
```

---

### 🔹 Get Job Status

**GET /jobs/{job_id}**

Response:

```json
{
  "job_id": "uuid",
  "status": "completed",
  "created_at": "...",
  "started_at": "...",
  "completed_at": "...",
  "result": {
    "message": "Document processed successfully"
  }
}
```

---

### 🔹 List All Jobs

**GET /jobs**

---

## ▶️ Running Locally

### 1. Install dependencies

```bash
npm install
```

---

### 2. Start Redis

```bash
redis-server
```

---

### 3. Start MongoDB

```bash
mongod
```

---

### 4. Start Worker

```bash
node src/worker.js
```

---

### 5. Start API

```bash
node src/app.js
```

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

---

## 🧠 Design Decisions

- Used **BullMQ** for reliable asynchronous job processing
- Used **Redis** as a message broker for queue management
- Used **MongoDB** for persistent job storage across services
- Worker-based architecture enables horizontal scaling
- Retry logic ensures fault tolerance and reliability
- Webhook support allows event-driven integrations

---

## ⚠️ Error Handling

- Invalid input returns HTTP 400
- Job not found returns HTTP 404
- Worker failures are retried automatically (max 3 attempts)
- Failed jobs are marked with error details

---

## 📈 Scalability

- Multiple workers can be added for horizontal scaling
- Queue ensures load distribution
- Stateless API allows easy scaling behind load balancers

---

## 🔥 Bonus Implemented

- Job listing API
- Webhook callback on completion
- MongoDB-based persistence
- Retry & backoff strategy
