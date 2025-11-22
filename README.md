# BloodSync - Blood Donation Management System

**Demo Version** - A comprehensive blood donation management system for hospitals in Naga City, Philippines.

## Overview

BloodSync is a full-stack web application designed to streamline blood donation management across multiple hospitals. The system tracks donors, blood inventory, donation records, and blood requests with real-time availability monitoring.

## Features

### Core Functionality
- **Donor Registration**: Register and manage blood donors with eligibility tracking
- **Blood Inventory Management**: Track blood units across multiple hospitals with expiry monitoring
- **Donation Records**: Log and track all blood donations with donor history
- **Blood Request System**: Handle blood requests from hospitals with approval workflow
- **Hospital Network**: Manage multiple hospitals in Naga City
- **Reports & Analytics**: Comprehensive reporting with customizable date ranges

### Key Highlights
- Real-time inventory tracking across all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Expiry date monitoring with alerts for units expiring within 30 days
- Multi-status request workflow (Pending → Approved → Completed)
- Urgency-level classification (Low, Medium, High, Critical)
- Donor eligibility status management
- Interactive dashboard with statistics and quick actions

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Project Structure

```
HOSPITAL/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── donors.js             # Donor management routes
│   │   ├── hospitals.js          # Hospital routes
│   │   ├── inventory.js          # Inventory management routes
│   │   ├── donations.js          # Donation records routes
│   │   └── requests.js           # Blood request routes
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js         # Main layout wrapper
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Donors.js         # Donor management
│   │   │   ├── Inventory.js      # Inventory tracking
│   │   │   ├── Donations.js      # Donation records
│   │   │   ├── Requests.js       # Blood requests
│   │   │   ├── Hospitals.js      # Hospital network
│   │   │   └── Reports.js        # Analytics & reports
│   │   ├── config/
│   │   │   └── api.js            # API configuration
│   │   ├── App.js                # Main app component
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── database/
│   ├── schema.sql                # Database schema
│   └── mock_data.sql             # Mock data for demo
│
├── package.json                  # Root package.json
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Step 1: Clone/Download the Project
```bash
cd HOSPITAL
```

### Step 2: Database Setup

1. **Create the database** in MySQL:
```bash
mysql -u root -p
```

2. **Run the schema** (creates tables):
```bash
mysql -u root -p < database/schema.sql
```

3. **Load mock data**:
```bash
mysql -u root -p < database/mock_data.sql
```

Alternatively, you can run both SQL files from MySQL Workbench or your preferred MySQL client.

### Step 3: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bloodsync_db
DB_PORT=3306

JWT_SECRET=your_secret_key_change_this
PORT=5000
```

5. Start the backend server:
```bash
npm start
```

The API should now be running on `http://localhost:5000`

### Step 4: Frontend Setup

1. Open a new terminal and navigate to client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. The `.env` should contain:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the React development server:
```bash
npm start
```

The app should open automatically at `http://localhost:3000`

### Step 5: Login to the System

Use the following demo credentials:
- **Username**: `admin`
- **Password**: `admin123`

## Hospitals in the System

The demo includes 5 real hospitals from Naga City:

| Hospital Name | Address | Contact |
|--------------|---------|---------|
| Bicol Medical Center | Concepcion Pequeña, Naga City | (054) 472-2400 |
| Mother Seton Hospital | Brgy. Del Rosario, Naga City | (054) 472-6173 |
| St. John Hospital | P. Burgos St., Naga City | (054) 811-3000 |
| Naga City Hospital | Penafrancia Ave., Naga City | (054) 473-9110 |
| NICC Doctors Hospital | Roxas Ave., Naga City | (054) 473-8093 |

## Mock Data Included

- **15 Donors** with various blood types and eligibility statuses
- **25+ Blood Inventory Units** across all hospitals
- **20 Donation Records** from different donors and hospitals
- **13 Blood Requests** with various statuses (Pending, Approved, Completed)
- **1 Admin Account** for system management

## Usage Guide

### Dashboard
- View overall statistics (total donors, available units, pending requests)
- Monitor blood inventory by type with color-coded availability
- Quick access to common actions

### Donor Management
- Register new donors with complete information
- Search and filter donors by blood type
- Track donation history and eligibility status
- View contact information

### Inventory Management
- Monitor blood units across all hospitals
- Filter by blood type, hospital, and status
- Track expiry dates with automatic alerts
- View collection dates and availability

### Donation Records
- Record new donations (automatically updates inventory)
- Link donations to specific donors and hospitals
- Track health status of donors
- View complete donation history

### Blood Requests
- Submit new blood requests from hospitals
- Set urgency levels (Low, Medium, High, Critical)
- Approve/reject pending requests
- Mark approved requests as completed
- Automatic inventory updates on completion

### Hospital Network
- View all registered hospitals
- Access hospital-specific statistics
- Monitor inventory levels per hospital
- Track donation and request history

### Reports & Analytics
- Filter data by custom date ranges
- View donation statistics by blood type and hospital
- Monitor current inventory status
- Analyze request patterns by status and urgency
- Track units expiring soon

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Donors
- `GET /api/donors` - Get all donors (with filters)
- `GET /api/donors/:id` - Get specific donor
- `POST /api/donors` - Create new donor
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor (auth required)
- `GET /api/donors/stats/overview` - Donor statistics

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/:id` - Get specific hospital
- `GET /api/hospitals/:id/stats` - Hospital statistics

### Inventory
- `GET /api/inventory` - Get inventory (with filters)
- `GET /api/inventory/summary` - Inventory summary
- `POST /api/inventory` - Add inventory unit (auth required)
- `PUT /api/inventory/:id` - Update unit (auth required)
- `DELETE /api/inventory/:id` - Delete unit (auth required)

### Donations
- `GET /api/donations` - Get all donations (with filters)
- `GET /api/donations/:id` - Get specific donation
- `POST /api/donations` - Record donation (auth required)
- `GET /api/donations/stats/overview` - Donation statistics

### Blood Requests
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/:id` - Get specific request
- `POST /api/requests` - Create request
- `PUT /api/requests/:id/status` - Update status (auth required)
- `DELETE /api/requests/:id` - Delete request (auth required)
- `GET /api/requests/stats/overview` - Request statistics

## Deployment

### Backend (Render/Railway)
1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `.env`
6. Deploy

### Frontend (Vercel/Netlify)
1. Create a new project
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/build`
4. Add environment variable `REACT_APP_API_URL` with your backend URL
5. Deploy

### Database (PlanetScale/Supabase)
1. Create a new MySQL database
2. Import `schema.sql`
3. Import `mock_data.sql`
4. Update backend `.env` with connection details

## Development Notes

### Running Both Servers Concurrently
From the root directory:
```bash
npm run dev
```

This will run both backend and frontend simultaneously.

### Building for Production
Frontend:
```bash
cd client
npm run build
```

This creates an optimized production build in `client/build/`

## Security Considerations

### Demo Version
- Password for demo is plain text compatible for easy testing
- In production, ensure all passwords are properly hashed with bcrypt
- Change JWT_SECRET to a strong random string
- Enable HTTPS in production
- Add rate limiting for API endpoints
- Implement CORS properly for production domains

### Database Security
- Use environment variables for all sensitive data
- Never commit `.env` files to version control
- Use prepared statements (already implemented)
- Regular database backups recommended

## Troubleshooting

### Cannot connect to database
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `bloodsync_db` exists
- Verify MySQL port (default 3306)

### API errors
- Check backend server is running on port 5000
- Verify `.env` configuration
- Check browser console for detailed errors
- Ensure CORS is configured properly

### Frontend not loading
- Verify React dev server is running on port 3000
- Check `REACT_APP_API_URL` in client `.env`
- Clear browser cache and reload
- Check for JavaScript console errors

### Login not working
- Verify admin credentials: username `admin`, password `admin123`
- Check if mock_data.sql was loaded properly
- Verify backend authentication routes are working
- Check browser network tab for API responses

## Future Enhancements

- Email notifications for critical requests
- SMS alerts for donors when their blood type is needed
- Mobile app for donors
- Appointment scheduling system
- QR code for donor cards
- Integration with national blood bank database
- Multi-language support
- Advanced analytics and predictive models

## License

This is a demo project for educational purposes.

## Support

For issues or questions:
1. Check this README thoroughly
2. Verify all installation steps were followed
3. Check the troubleshooting section
4. Review console logs for errors

## Credits

**BloodSync** - Blood Donation Management System Demo
Built for Naga City, Philippines hospital network demonstration.

---

**Note**: This is a demo version with mock data. For production use, additional security measures, testing, and compliance with healthcare regulations (HIPAA, local data privacy laws) are required.
