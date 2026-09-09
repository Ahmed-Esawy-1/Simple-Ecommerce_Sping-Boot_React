# Simple Ecommerce

A full-stack e-commerce application built with **React.js** and **Spring Boot**.

The project provides product management, shopping cart functionality, order management, AI-powered features, semantic product search, and an AI chatbot.

## 🛠️ Technologies

### Frontend

* React.js
* Vite
* JavaScript
* CSS
* Axios
* React Context API

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven
* PostgreSQL
* pgvector
* Spring AI
* Google Gemini

### Development Tools

* Git & GitHub
* Docker
* Docker Compose

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Ahmed-Esawy-1/Simple-Ecommerce_Java-Sping-Boot_React.git
```

Navigate to the project:

```bash
cd Simple-Ecommerce_Java-Sping-Boot_React
```

---

# ⚙️ Backend Setup

## 1. Requirements

Before running the backend, make sure you have installed:

* Java 21+
* Maven
* Docker Desktop
* PostgreSQL / PostgreSQL-compatible database

---

## 2. Start the Database

The backend includes a Docker Compose configuration.

Navigate to the backend folder:

```bash
cd backend
```

Start the required services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

---

## 3. Configure Environment Variables

The application uses environment variables for sensitive configuration.

The Google AI API key is **not stored directly in the source code**.

The application expects:

```text
GOOGLE_API_KEY
```

### Windows PowerShell

You can temporarily set the variable with:

```powershell
$env:GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
```

Or configure it permanently through Windows Environment Variables.

> Never commit your real API key to GitHub.

---

## 4. Run the Spring Boot Backend

From the `backend` directory:

### Windows

```powershell
.\mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

The backend will normally start on:

```text
http://localhost:8080
```

---

# 💻 Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔗 Frontend & Backend Connection

The React frontend communicates with the Spring Boot REST API.

The backend runs on:

```text
http://localhost:8080
```

The frontend runs on:

```text
http://localhost:5173
```

Make sure the API configuration in:

```text
frontend/src/api/config.js
```

points to the correct backend URL.

For local development:

```text
http://localhost:8080
```

---

# 🤖 AI Features

The application uses **Spring AI** and **Google Gemini** to provide AI-powered functionality.

Features include:

* AI product description generation
* AI product image generation
* AI chatbot
* Semantic product search
* Product embeddings
* Vector-based search using pgvector

The Google API key is provided through:

```text
GOOGLE_API_KEY
```

The backend configuration uses the environment variable rather than storing the API key directly in the repository.

---

# 🗄️ Database

The backend uses PostgreSQL.

The project also uses **pgvector** for vector similarity search and AI embeddings.

Database initialization scripts are located in:

```text
backend/src/main/resources/init/schema.sql
```

---

# 🧪 Testing

To run the backend tests:

```powershell
cd backend
.\mvnw.cmd test
```

---

# 🏗️ Build the Backend

Create a production build:

```powershell
cd backend
.\mvnw.cmd clean package
```

The generated JAR file will be available inside:

```text
backend/target/
```

---

# 📦 Build the Frontend

From the frontend directory:

```bash
npm run build
```

The production files will be generated in:

```text
frontend/dist/
```

---

# 🔄 Running the Complete Application

You need two terminals.

### Terminal 1 — Backend

```powershell
cd backend
docker compose up -d
.\mvnw.cmd spring-boot:run
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔐 Security

Sensitive information should never be committed to Git.

Use environment variables for:

* Google API keys
* Database passwords
* Authentication secrets
* Other private credentials

Example:

```properties
spring.ai.google.genai.api-key=${GOOGLE_API_KEY}
```

Do not replace `${GOOGLE_API_KEY}` with the actual API key inside `application.properties`.

---

# 📌 Features

* Product management
* Product search
* Product details
* Shopping cart
* Order management
* AI product description generation
* AI product image generation
* AI chatbot
* Semantic search
* PostgreSQL database
* pgvector integration
* REST APIs
* React frontend
* Spring Boot backend
* Docker database setup

---

# 👨‍💻 Author

**Ahmed Esawy**

Full Stack Java Developer

Technologies:

**Java • Spring Boot • React • JavaScript • PostgreSQL • Docker • Spring AI**
