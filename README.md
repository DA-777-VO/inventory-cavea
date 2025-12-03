# 🎬 Cinema Inventory Management System

A full-stack web application for managing cinema inventory with support for 500,000+ records.

**Tech Stack:**
- **Frontend:** Angular 20, TypeScript, Bootstrap 5
- **Backend:** Node.js 22 LTS, Express.js, TypeScript, Sequelize v6
- **Database:** PostgreSQL

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Running the Application](#-running-the-application)
- [Testing with 500,000 Records](#-testing-with-500000-records)
- [Available Scripts](#-available-scripts)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- ✅ View inventory items with pagination (20 items per page)
- ✅ Filter by location (cinema)
- ✅ Sort by name, price, or location
- ✅ Add new inventory items
- ✅ Delete inventory items
- ✅ View statistics by location
- ✅ Manage locations (CRUD) - Add, edit, and delete cinema locations
- ✅ Form validation
- ✅ Responsive design
- ✅ Optimized for large datasets (500,000+ records)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v22 or newer ([Download](https://nodejs.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

---

## 🛠 Tech Stack

**Backend:**
- **Node.js** (LTS) & Express
- **TypeScript**
- **Sequelize ORM**
- **PostgreSQL Database**

**Frontend:**
- **Angular 20**
- **TypeScript**
- **Bootstrap 5**

---

## 📦 Installation

### Backend Setup

#### 1. Clone the repository

```bash
git clone https://github.com/DA-777-VO/inventory-cavea
cd inventory-backend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the backend root directory:

```bash
cp .env
```

Edit the `.env` file with your PostgreSQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cinema_inventory
DB_USER=postgres
DB_PASSWORD=your_password
```

**Alternative:** You can also use a connection string:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cinema_inventory
```

#### 4. Create the database

**Option A: Using psql**

```bash
psql -U postgres
```

```sql
CREATE DATABASE cinema_inventory;
```

**Option B: Using createdb command**

```bash
createdb -U postgres cinema_inventory
```

#### 5. Verify installation

The backend will automatically:
- Create tables on first run
- Seed initial locations (5 cinemas)

---

### Frontend Setup

#### 1. Navigate to frontend directory

```bash
cd inventory-frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Verify environment configuration

Check that `src/environments/environment.ts` points to your backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd inventory-backend
npm run dev
```

The backend API will be available at: `http://localhost:3000`

### Start Frontend Server

**In a new terminal:**

```bash
cd inventory-frontend
npm start
```

The application will open automatically at: `http://localhost:4200`

---

## 🧪 Testing with 500,000 Records

### Manual Seeding

```bash
cd inventory-backend
npm run seed
```

### Clear Database

To remove all inventory records:

```bash
npm run clear-db
```
---

## 🎮 Available Scripts

### Backend Scripts

| Command            | Description                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Start development server with hot reload |
| `npm start`        | Start production server                  |
| `npm run tsc`      | Compile TypeScript to JavaScript         |
| `npm run seed`     | Populate database with 500,000 records   |
| `npm run clear-db` | Clear all database records               |
| `npm run lint`     | Run ESLint                               |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (ng serve) |
| `npm run build` | Build for production |
| `ng generate component name` | Generate a new component |
| `ng generate service name` | Generate a new service |

---

## 🐛 Troubleshooting

### Backend Issues

#### "Unable to connect to the database"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```
2. Check `.env` credentials match your PostgreSQL setup
3. Ensure database exists:
   ```bash
   psql -U postgres -l
   ```

#### "Port 3000 is already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change PORT in .env
PORT=3001
```

#### Database seed is slow

**Solution:**
1. Reduce record count for testing (in `src/seed.ts`):
   ```typescript
   const TOTAL_RECORDS = 100000; // Instead of 500000
   ```
2. Increase batch size (in `src/seed.ts`):
   ```typescript
   const BATCH_SIZE = 20000; // Instead of 10000
   ```
3. Optimize PostgreSQL settings (in `postgresql.conf`):
   ```
   shared_buffers = 256MB
   effective_cache_size = 1GB
   ```

### Frontend Issues

#### "Cannot GET /api/inventories"

**Solution:**
1. Verify backend is running on port 3000
2. Check `src/environments/environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:3000/api'
   ```
3. Open browser console (F12) and check for CORS errors

#### CORS errors

**Solution:**
Ensure `src/index.ts` in backend has:
```typescript
import cors from 'cors';
app.use(cors());
```

#### Slow page loading

**Solution:**
1. Verify backend pagination is working (check Network tab in DevTools)
2. Ensure indexes exist on database (run migrations)
3. Check if backend is using efficient queries (check console logs)

### General Issues

#### Module not found errors

**Solution:**
```bash
# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript compilation errors

**Solution:**
```bash
# Clean build and rebuild
npm run build
```

---

## 🔒 Security Notes

**For Development:**
- CORS is enabled for all origins
- No authentication is implemented
- Database credentials are in `.env` (not in git)

**For Production:**
- Configure CORS to allow only specific origins
- Implement authentication/authorization
- Use environment variables for sensitive data
- Enable HTTPS
- Set up rate limiting
- Validate all user inputs

---

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## 👤 Author

David Apakin :)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

---

## 📞 Support

**apakin.david@gmail.com**