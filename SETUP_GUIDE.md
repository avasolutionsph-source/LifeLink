# BloodSync - Quick Setup Guide

This guide will help you get BloodSync running on your local machine in under 10 minutes.

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js installed (v16 or higher) - [Download here](https://nodejs.org/)
- [ ] MySQL installed (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## Quick Start (5 Steps)

### Step 1: Database Setup (2 minutes)

1. Open MySQL Workbench or your MySQL terminal
2. Create the database:
   ```sql
   CREATE DATABASE bloodsync_db;
   ```
3. Run the schema file:
   - Option A: In MySQL Workbench, open `database/schema.sql` and execute
   - Option B: From terminal:
     ```bash
     mysql -u root -p bloodsync_db < database/schema.sql
     ```
4. Load mock data:
   - Option A: In MySQL Workbench, open `database/mock_data.sql` and execute
   - Option B: From terminal:
     ```bash
     mysql -u root -p bloodsync_db < database/mock_data.sql
     ```

### Step 2: Backend Setup (2 minutes)

1. Open terminal in the `backend` folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and update your MySQL password:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
   DB_NAME=bloodsync_db
   DB_PORT=3306
   JWT_SECRET=bloodsync_demo_secret_2024
   PORT=5000
   ```
5. Start the server:
   ```bash
   npm start
   ```

   You should see: `🩸 BloodSync API server running on port 5000`

### Step 3: Frontend Setup (2 minutes)

1. Open a NEW terminal in the `client` folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Start the React app:
   ```bash
   npm start
   ```

   The browser should automatically open to `http://localhost:3000`

### Step 4: Login

Use these credentials:
- **Username**: `admin`
- **Password**: `admin123`

### Step 5: Explore

You're all set! The system includes:
- 15 registered donors
- 5 hospitals in Naga City
- 25+ blood inventory units
- 20 donation records
- 13 blood requests

## Verification Checklist

After setup, verify everything works:

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Can login with admin/admin123
- [ ] Dashboard shows statistics
- [ ] Can view donors list
- [ ] Can view inventory
- [ ] Can view hospitals

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**:
- Check if MySQL is running
- Verify your password in `backend/.env`
- Make sure database `bloodsync_db` exists

### Issue: "Port 5000 already in use"
**Solution**:
- Change PORT in `backend/.env` to 5001
- Update `REACT_APP_API_URL` in `client/.env` to `http://localhost:5001/api`

### Issue: "npm install fails"
**Solution**:
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue: Login doesn't work
**Solution**:
- Make sure you ran `mock_data.sql`
- Check browser console for errors
- Verify backend is running

### Issue: CORS errors
**Solution**:
- This should not happen in development
- Make sure you're accessing frontend via `http://localhost:3000`
- Don't use `127.0.0.1` instead of `localhost`

## Running Both Servers at Once

Instead of opening two terminals, you can run both from the root directory:

```bash
npm install
npm run dev
```

This will start both backend and frontend simultaneously.

## Demo Data Overview

### Hospitals
- Bicol Medical Center
- Mother Seton Hospital
- St. John Hospital
- Naga City Hospital
- NICC Doctors Hospital

### Blood Types Available
All 8 major blood types: A+, A-, B+, B-, AB+, AB-, O+, O-

### Sample Donors
Juan Dela Cruz (O+), Maria Santos (A+), Pedro Reyes (B+), and 12 more

### Sample Requests
Mix of Pending, Approved, and Completed requests with various urgency levels

## Next Steps

After successful setup:

1. **Explore the Dashboard** - See overall statistics
2. **Try Registering a Donor** - Go to Donors → Register New Donor
3. **Submit a Blood Request** - Go to Requests → New Blood Request
4. **Record a Donation** - Go to Donations → Record New Donation
5. **View Reports** - Go to Reports to see analytics

## Development Tips

### Backend Development
- API runs on `http://localhost:5000`
- Test endpoints: `http://localhost:5000/api/health`
- View logs in the backend terminal

### Frontend Development
- Hot reload enabled - changes reflect immediately
- Check browser console for errors
- React DevTools recommended for debugging

### Database Changes
- After modifying database, restart backend server
- Use MySQL Workbench to view/edit data directly
- Keep backup of your data before major changes

## Production Deployment

When you're ready to deploy:

1. **Backend**: Deploy to Render, Railway, or Heroku
2. **Frontend**: Deploy to Vercel or Netlify
3. **Database**: Use PlanetScale, Supabase, or managed MySQL
4. **Update**: Change `REACT_APP_API_URL` to your production backend URL

Detailed deployment instructions are in the main README.md

## Getting Help

If you're stuck:
1. Check the error message in the terminal
2. Look at browser console (F12)
3. Review this guide and README.md
4. Verify all prerequisites are installed
5. Make sure all steps were completed in order

## System Requirements

**Minimum**:
- 4GB RAM
- 2GB free disk space
- Modern browser (Chrome, Firefox, Edge)

**Recommended**:
- 8GB RAM
- 5GB free disk space
- Chrome browser with React DevTools

---

**You're ready to use BloodSync!** 🩸

If everything is running correctly, you should now have a fully functional blood donation management system running locally.
