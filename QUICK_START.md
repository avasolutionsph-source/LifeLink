# BloodSync - Quick Start Card

## 🚀 Get Running in 5 Minutes

### Step 1: Database (1 min)
```bash
mysql -u root -p
CREATE DATABASE bloodsync_db;
exit

mysql -u root -p bloodsync_db < database/schema.sql
mysql -u root -p bloodsync_db < database/mock_data.sql
```

### Step 2: Backend (1 min)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env - add your MySQL password
npm start
```
✅ Should see: `🩸 BloodSync API server running on port 5000`

### Step 3: Frontend (1 min)
```bash
# Open NEW terminal
cd client
npm install
npm start
```
✅ Browser opens to `http://localhost:3000`

### Step 4: Login
```
Username: admin
Password: admin123
```

---

## 📋 Project Checklist

- [ ] Node.js installed (v16+)
- [ ] MySQL installed (v8.0+)
- [ ] Database created & data loaded
- [ ] Backend .env configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Successfully logged in

---

## 🗂️ File Locations

| What | Where |
|------|-------|
| Documentation | README.md, SETUP_GUIDE.md |
| Database | database/schema.sql, database/mock_data.sql |
| Backend | backend/ (9 files) |
| Frontend | client/src/ (15 files) |
| Demo Info | DEMO_CREDENTIALS.txt |

---

## 🎯 Quick Demo Flow

1. **Dashboard** - View statistics
2. **Donors** - Click "+ Register New Donor"
3. **Requests** - Submit blood request
4. **Requests** - Approve pending request
5. **Donations** - Record new donation
6. **Inventory** - See updated inventory
7. **Reports** - View analytics

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to DB | Check MySQL running, verify .env password |
| Port 5000 in use | Change PORT in backend/.env to 5001 |
| npm install fails | Delete node_modules, package-lock.json, retry |
| Login doesn't work | Verify mock_data.sql was loaded |
| CORS errors | Use localhost:3000, not 127.0.0.1 |

---

## 📞 What's Included

- ✅ 15 Donors (all blood types)
- ✅ 5 Naga City Hospitals
- ✅ 25+ Blood Units
- ✅ 20 Donation Records
- ✅ 13 Blood Requests
- ✅ Complete Dashboard
- ✅ Full CRUD Operations
- ✅ Request Workflow
- ✅ Reports & Analytics

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## 📚 More Info

- **Full Setup**: See SETUP_GUIDE.md
- **API Docs**: See README.md
- **Architecture**: See ARCHITECTURE.md
- **Files**: See FILE_STRUCTURE.txt

---

## 🎓 Demo Scenarios

### Scenario 1: Emergency Request
1. Requests → New Request
2. Select: Bicol Medical Center, O+, 5 units, Critical
3. Submit → Appears as Pending
4. Approve → Status changes
5. Complete → Inventory reduces

### Scenario 2: New Donation
1. Donations → Record New Donation
2. Select donor (eligible only shown)
3. Select hospital
4. Submit → Inventory increases

### Scenario 3: Monitor Inventory
1. Inventory → Filter by Blood Type
2. Check expiring units (orange highlight)
3. View by hospital

---

## ⚙️ Environment Files

### backend/.env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bloodsync_db
DB_PORT=3306
JWT_SECRET=bloodsync_demo_secret
PORT=5000
```

### client/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🔐 Security Note

This is a DEMO with simplified authentication.

For production:
- Change all passwords
- Update JWT_SECRET
- Enable HTTPS
- Add rate limiting
- Implement proper security

---

## ✨ Features by Page

| Page | Features |
|------|----------|
| Dashboard | Stats, Blood type grid, Quick actions |
| Donors | Register, Search, Filter, View history |
| Inventory | Filter by type/hospital/status, Expiry alerts |
| Donations | Record donation, Auto inventory update |
| Requests | Submit, Approve, Complete, Status tracking |
| Hospitals | View network, Hospital stats, Inventory |
| Reports | Date filters, Analytics, Charts |

---

**Ready to Go!** 🩸

All files are created and ready to run.
Just follow Steps 1-4 above and you're live!
