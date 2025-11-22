# BloodSync - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│                     http://localhost:3000                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                  │  │
│  │                                                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Login     │  │ Dashboard  │  │  Donors    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Inventory  │  │ Donations  │  │  Requests  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐                     │  │
│  │  │ Hospitals  │  │  Reports   │                     │  │
│  │  └────────────┘  └────────────┘                     │  │
│  │                                                       │  │
│  │         ↓ Axios HTTP Requests (JSON)                 │  │
│  └───────────────────┬───────────────────────────────────┘  │
└────────────────────┼───────────────────────────────────────┘
                     │
                     │ REST API Calls
                     │ Authorization: Bearer <JWT>
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                          │
│                   http://localhost:5000                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Middleware Layer                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │   CORS   │→ │   JSON   │→ │   Auth   │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API Routes                          │  │
│  │                                                       │  │
│  │  /api/auth       │ Login, Token Verification         │  │
│  │  /api/donors     │ Donor CRUD + Statistics          │  │
│  │  /api/hospitals  │ Hospital Operations              │  │
│  │  /api/inventory  │ Blood Inventory Management       │  │
│  │  /api/donations  │ Donation Records                 │  │
│  │  /api/requests   │ Blood Request Workflow           │  │
│  │                                                       │  │
│  └───────────────────┬──────────────────────────────────┘  │
└────────────────────┼───────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │ mysql2 connection pool
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                     MySQL DATABASE                           │
│                      bloodsync_db                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Tables                             │  │
│  │                                                       │  │
│  │  ┌─────────────┐         ┌──────────────┐           │  │
│  │  │   Admins    │         │  Hospitals   │           │  │
│  │  └─────────────┘         └──────────────┘           │  │
│  │                                                       │  │
│  │  ┌─────────────┐    ┌────────────────────┐          │  │
│  │  │   Donors    │───→│ Donation_Records   │          │  │
│  │  └─────────────┘    └────────────────────┘          │  │
│  │                              │                        │  │
│  │  ┌──────────────────┐       │                        │  │
│  │  │ Blood_Inventory  │←──────┘                        │  │
│  │  └──────────────────┘                                │  │
│  │                                                       │  │
│  │  ┌──────────────────┐                                │  │
│  │  │ Blood_Requests   │                                │  │
│  │  └──────────────────┘                                │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (React)

```
┌─────────────────────────────────────────────────────────┐
│                        App.js                            │
│                    (Root Component)                      │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           AuthProvider (Context)                │    │
│  │  - login()                                      │    │
│  │  - logout()                                     │    │
│  │  - isAuthenticated                              │    │
│  └─────────────────┬───────────────────────────────┘    │
│                    │                                     │
│  ┌─────────────────▼───────────────────────────────┐    │
│  │              Router (React Router)              │    │
│  │                                                  │    │
│  │  /login          → Login.js                     │    │
│  │  /               → Dashboard.js (Protected)     │    │
│  │  /donors         → Donors.js (Protected)        │    │
│  │  /inventory      → Inventory.js (Protected)     │    │
│  │  /donations      → Donations.js (Protected)     │    │
│  │  /requests       → Requests.js (Protected)      │    │
│  │  /hospitals      → Hospitals.js (Protected)     │    │
│  │  /reports        → Reports.js (Protected)       │    │
│  │                                                  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │               Protected Pages                   │    │
│  │                                                  │    │
│  │  ┌──────────────────────────────────────┐      │    │
│  │  │          Layout Component             │      │    │
│  │  │  ┌───────────────────────────────┐   │      │    │
│  │  │  │  Header (Logo, User Info)     │   │      │    │
│  │  │  └───────────────────────────────┘   │      │    │
│  │  │  ┌───────────────────────────────┐   │      │    │
│  │  │  │  Navigation (7 menu items)    │   │      │    │
│  │  │  └───────────────────────────────┘   │      │    │
│  │  │  ┌───────────────────────────────┐   │      │    │
│  │  │  │  {children} - Page Content    │   │      │    │
│  │  │  └───────────────────────────────┘   │      │    │
│  │  │  ┌───────────────────────────────┐   │      │    │
│  │  │  │  Footer                       │   │      │    │
│  │  │  └───────────────────────────────┘   │      │    │
│  │  └──────────────────────────────────────┘      │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Backend (Express)

```
┌─────────────────────────────────────────────────────────┐
│                      server.js                           │
│                   (Express Server)                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Global Middleware                  │    │
│  │  - cors()                                       │    │
│  │  - bodyParser.json()                            │    │
│  │  - bodyParser.urlencoded()                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │                Route Handlers                   │    │
│  │                                                  │    │
│  │  /api/auth       → routes/auth.js               │    │
│  │  /api/donors     → routes/donors.js             │    │
│  │  /api/hospitals  → routes/hospitals.js          │    │
│  │  /api/inventory  → routes/inventory.js          │    │
│  │  /api/donations  → routes/donations.js          │    │
│  │  /api/requests   → routes/requests.js           │    │
│  │                                                  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           Protected Route Flow                  │    │
│  │                                                  │    │
│  │  Request → Auth Middleware → Route Handler      │    │
│  │             │                     │              │    │
│  │             │ Verify JWT          │ Execute      │    │
│  │             │ Extract User        │ DB Query     │    │
│  │             │ Attach to req       │ Return JSON  │    │
│  │                                                  │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User enters credentials
         │
         ↓
    Login.js (React)
         │
         ↓ POST /api/auth/login
         │ { username, password }
         ↓
    auth.js (Backend)
         │
         ├─→ Query Admins table
         ├─→ Verify password
         ├─→ Generate JWT token
         │
         ↓ Response
    { token, admin: {...} }
         │
         ↓
    AuthContext saves token
         │
         ↓
    Redirect to Dashboard
         │
         ↓
    All requests include:
    Authorization: Bearer <token>
```

### 2. Donor Registration Flow

```
User fills form
         │
         ↓
    Donors.js (React)
         │
         ↓ POST /api/donors
         │ { firstName, lastName, bloodType, ... }
         │ Authorization: Bearer <token>
         ↓
    Auth Middleware verifies token
         │
         ↓
    donors.js route handler
         │
         ├─→ Validate input
         ├─→ INSERT INTO Donors
         ├─→ Return new donor
         │
         ↓ Response
    { Donor_ID, First_Name, ... }
         │
         ↓
    Frontend updates donor list
```

### 3. Blood Request Workflow

```
Hospital submits request
         │
         ↓
    Requests.js (React)
         │
         ↓ POST /api/requests
         │ { hospitalId, bloodType, units, urgency }
         │ Authorization: Bearer <token>
         ↓
    requests.js route handler
         │
         ├─→ INSERT INTO Blood_Requests
         ├─→ Status = 'Pending'
         │
         ↓ Admin approves
         │
         ↓ PUT /api/requests/:id/status
         │ { status: 'Approved' }
         │
         ├─→ UPDATE Blood_Requests
         ├─→ SET Status = 'Approved'
         ├─→ SET Approved_By = admin_id
         │
         ↓ Admin completes
         │
         ↓ PUT /api/requests/:id/status
         │ { status: 'Completed' }
         │
         ├─→ BEGIN TRANSACTION
         ├─→ UPDATE Blood_Requests (Completed)
         ├─→ UPDATE Blood_Inventory (Reduce quantity)
         ├─→ COMMIT
         │
         ↓ Response
    Updated request with status
```

### 4. Donation Recording Flow

```
Staff records donation
         │
         ↓
    Donations.js (React)
         │
         ↓ POST /api/donations
         │ { donorId, hospitalId, bloodType, units }
         │ Authorization: Bearer <token>
         ↓
    donations.js route handler
         │
         ├─→ BEGIN TRANSACTION
         │
         ├─→ INSERT INTO Donation_Records
         │
         ├─→ UPDATE Donors
         │   (Last_Donation_Date)
         │
         ├─→ INSERT INTO Blood_Inventory
         │   (Add new units, expiry = date + 90 days)
         │
         ├─→ COMMIT TRANSACTION
         │
         ↓ Response
    New donation record
         │
         ↓
    Frontend refreshes donation list
    Inventory automatically increased
```

## Database Relationships

```
                    ┌─────────────┐
                    │   Admins    │
                    │─────────────│
                    │ Admin_ID PK │
                    │ Username    │
                    │ Password    │
                    └──────┬──────┘
                           │
                           │ Approved_By (FK)
                           │
    ┌──────────────┐       │      ┌────────────────────┐
    │  Hospitals   │       │      │  Blood_Requests    │
    │──────────────│       │      │────────────────────│
    │ Hospital_ID  │───────┼─────→│ Request_ID PK      │
    │ Name         │       │      │ Hospital_ID FK     │
    │ Address      │       │      │ Blood_Type         │
    │ Contact      │       └─────→│ Approved_By FK     │
    └──────┬───────┘              │ Status             │
           │                      │ Urgency_Level      │
           │                      └────────────────────┘
           │
           │ Hospital_ID (FK)
           │
    ┌──────▼────────────────────┐
    │   Blood_Inventory         │
    │───────────────────────────│
    │ Unit_ID PK                │
    │ Blood_Type                │
    │ Quantity                  │
    │ Hospital_ID FK            │
    │ Expiry_Date               │
    │ Status                    │
    └───────────────────────────┘
           ▲
           │
           │ Created from donations
           │
    ┌──────┴───────────────────┐
    │  Donation_Records        │
    │──────────────────────────│
    │ Donation_ID PK           │
    │ Donor_ID FK              │
    │ Hospital_ID FK           │
    │ Blood_Type               │
    │ Units_Donated            │
    └──────▲───────────────────┘
           │
           │ Donor_ID (FK)
           │
    ┌──────┴───────┐
    │   Donors     │
    │──────────────│
    │ Donor_ID PK  │
    │ Name         │
    │ Blood_Type   │
    │ Last_Donation│
    └──────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Security Layers                     │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Layer 1: Frontend Route Protection        │    │
│  │  - ProtectedRoute component                │    │
│  │  - Checks localStorage for token           │    │
│  │  - Redirects to /login if not found        │    │
│  └────────────────────────────────────────────┘    │
│                      │                              │
│                      ↓                              │
│  ┌────────────────────────────────────────────┐    │
│  │  Layer 2: API Request Headers              │    │
│  │  - Axios interceptor                       │    │
│  │  - Adds: Authorization: Bearer <token>     │    │
│  │  - All protected endpoints require this    │    │
│  └────────────────────────────────────────────┘    │
│                      │                              │
│                      ↓                              │
│  ┌────────────────────────────────────────────┐    │
│  │  Layer 3: Backend JWT Verification         │    │
│  │  - auth.js middleware                      │    │
│  │  - Verifies JWT signature                  │    │
│  │  - Decodes admin info                      │    │
│  │  - Attaches to req.admin                   │    │
│  └────────────────────────────────────────────┘    │
│                      │                              │
│                      ↓                              │
│  ┌────────────────────────────────────────────┐    │
│  │  Layer 4: Database Query Protection        │    │
│  │  - Prepared statements (mysql2)            │    │
│  │  - Prevents SQL injection                  │    │
│  │  - Input validation                        │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────┐
│              Frontend State Architecture             │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │        AuthContext (Global State)          │    │
│  │  - admin: { id, username, fullName }       │    │
│  │  - isAuthenticated: boolean                │    │
│  │  - login(username, password)               │    │
│  │  - logout()                                │    │
│  └───────────────┬────────────────────────────┘    │
│                  │                                  │
│                  │ Consumed by all components       │
│                  │ via useAuth() hook               │
│                  │                                  │
│  ┌───────────────▼────────────────────────────┐    │
│  │       Component Local State (useState)     │    │
│  │                                             │    │
│  │  Dashboard:                                 │    │
│  │  - stats (object)                           │    │
│  │  - loading (boolean)                        │    │
│  │                                             │    │
│  │  Donors:                                    │    │
│  │  - donors (array)                           │    │
│  │  - showForm (boolean)                       │    │
│  │  - formData (object)                        │    │
│  │  - searchTerm (string)                      │    │
│  │  - filterBloodType (string)                 │    │
│  │                                             │    │
│  │  Similar pattern for all pages              │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                Production Deployment                 │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         Frontend (Vercel/Netlify)          │    │
│  │  - React build artifacts                   │    │
│  │  - CDN distribution                        │    │
│  │  - HTTPS enabled                           │    │
│  │  - ENV: REACT_APP_API_URL                  │    │
│  └───────────────┬────────────────────────────┘    │
│                  │                                  │
│                  │ HTTPS API Calls                  │
│                  │                                  │
│  ┌───────────────▼────────────────────────────┐    │
│  │        Backend (Render/Railway)            │    │
│  │  - Node.js Express server                  │    │
│  │  - Auto-scaling                            │    │
│  │  - HTTPS enabled                           │    │
│  │  - ENV: DB credentials, JWT_SECRET         │    │
│  └───────────────┬────────────────────────────┘    │
│                  │                                  │
│                  │ MySQL Connection                 │
│                  │                                  │
│  ┌───────────────▼────────────────────────────┐    │
│  │      Database (PlanetScale/Supabase)       │    │
│  │  - Managed MySQL                           │    │
│  │  - Automatic backups                       │    │
│  │  - Connection pooling                      │    │
│  │  - SSL/TLS encryption                      │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────┐
│                   Technology Stack                   │
│                                                      │
│  Frontend:                                           │
│  ├─ React 18.2.0          (UI Library)              │
│  ├─ React Router 6.20.1   (Client Routing)          │
│  ├─ TailwindCSS 3.3.6     (Styling)                 │
│  ├─ Axios 1.6.2           (HTTP Client)             │
│  └─ Heroicons 2.1.1       (Icons)                   │
│                                                      │
│  Backend:                                            │
│  ├─ Node.js 16+           (Runtime)                 │
│  ├─ Express 4.18.2        (Web Framework)           │
│  ├─ MySQL2 3.6.5          (Database Driver)         │
│  ├─ JWT 9.0.2             (Authentication)          │
│  ├─ bcryptjs 2.4.3        (Password Hashing)        │
│  └─ CORS 2.8.5            (Cross-Origin)            │
│                                                      │
│  Database:                                           │
│  └─ MySQL 8.0+            (RDBMS)                   │
│                                                      │
│  Development:                                        │
│  ├─ Nodemon 3.0.2         (Auto-restart)            │
│  ├─ Concurrently 8.2.2    (Multi-process)           │
│  └─ dotenv 16.3.1         (Environment Vars)        │
└─────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✓ Scalability through stateless API design
- ✓ Security via JWT and prepared statements
- ✓ Maintainability with modular structure
- ✓ Performance through connection pooling
- ✓ User experience via SPA and real-time updates
