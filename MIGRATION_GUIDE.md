# Migration Guide for New Laptop

## Database Backup
✅ **Database backup created**: `database_backup_20250819_145910.sql` (355KB)

## Setup Instructions for New Laptop

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd ecd-materials-generator
```

### 2. Install Dependencies
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Environment Setup
Create `.env` files in root and client directories:

**Root `.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecd_db
DB_USER=ecd_user
DB_PASSWORD=ecd_password
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

**Client `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### 4. Database Restoration
```bash
# Start services
npm run dev

# Wait for containers to be ready, then restore database
docker exec -i ecd-materials-generator_postgres_1 psql -U ecd_user -d ecd_db < database_backup_20250819_145910.sql
```

### 5. Verify Setup
```bash
# Check if all services are running
docker ps

# Test API
curl http://localhost:5000/api/v1/health

# Access frontend
open http://localhost:3000
```

## Database Models Status
✅ All 25 models are properly defined and match database tables:

### Core Models
- User, School, Class, Student, Teacher
- Assignment, Progress, StudentAssignment
- Material, Template, Message

### Finance Models  
- FeeStructure, StudentFee, FeePayment
- Receipt (singular table)
- FeeConfiguration, OptionalService
- StudentFeeAssignment, StudentServiceSelection
- Payment, FinancialReport

### System Models
- Subscription, SubscriptionPayment, SubscriptionPlan
- AuditLog, SystemNotification
- Signature, StudentServicePreference

## Test Users
- **Teacher**: teacher@test.com / password123
- **School Admin**: bbanda@gmail.com / brian123  
- **Finance**: finance@school.com / finance123

## New Features Added
- ✅ Template Designer with 130+ objects
- ✅ Fabric.js canvas with fillable shapes
- ✅ Collapsible categories
- ✅ Text tools with multiple styles
- ✅ Fill removal for coloring assignments
- ✅ Smooth resizing controls

## Troubleshooting
If you encounter issues:
1. Ensure Docker is installed and running
2. Check all .env files are created
3. Verify database backup file exists
4. Run `npm run stop && npm run dev` to restart services