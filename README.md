# ECD Learning Materials Generator

A comprehensive platform for creating culturally-appropriate early childhood development learning materials for Zimbabwean children, with integrated school management features.

## 🚀 Quick Start

### One-Command Startup
```bash
npm run dev
```

This will automatically start:
- PostgreSQL & Redis (Docker)
- Backend API server (port 5000)
- Frontend React app (port 3000)

### Manual Setup (First Time)
```bash
npm run setup  # Install all dependencies
npm run dev    # Start all services
```

### Stop All Services
```bash
npm run stop
```

## 🔗 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Database**: postgresql://ecd_user:ecd_password@localhost:5432/ecd_db

## 🔐 Test Users

### Teacher Account
- **Email**: teacher@test.com
- **Password**: password123

### School Admin Account
- **Email**: bbanda@gmail.com
- **Password**: brian123

### Finance Manager Account
- **Email**: finance@school.com
- **Password**: finance123

## 📁 Project Structure

```
ecd-materials-generator/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   └── types/       # TypeScript types
├── server/          # Node.js backend
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── migrations/  # Database migrations
│   │   └── seeds/       # Database seeds
├── shared/          # Shared utilities
├── assets/          # Static assets
└── scripts/         # Setup scripts
```

## 🎯 Core Features

### Learning Materials System
- ✅ **Template-based Material Creation**: Create culturally-appropriate learning materials
- ✅ **Multi-language Support**: English, Shona, and Ndebele
- ✅ **Cultural Content Integration**: Zimbabwean cultural elements
- ✅ **Interactive Materials**: Drawing, coloring, and interactive tasks
- ✅ **Material Library**: Organized collection of learning resources

### School Management System
- ✅ **Role-Based Access Control**: Teacher, School Admin, Finance Manager, System Admin
- ✅ **Student Management**: Complete student lifecycle management
- ✅ **Class Management**: Organize students into classes
- ✅ **Teacher Management**: Assign teachers to classes
- ✅ **Assignment System**: Create and track student assignments

### Finance Management System
- ✅ **Flexible Fee Structure**: Monthly vs Term tuition options
- ✅ **Optional Services**: Transport, Food, Activities, Auxiliary services
- ✅ **Payment Recording**: Track individual student payments
- ✅ **Service Preferences**: Toggle services per student based on parent choice
- ✅ **Financial Analytics**: Comprehensive reporting and statistics

### User Management
- ✅ **Authentication & Authorization**: Secure login with JWT
- ✅ **Password Reset**: Email-based password recovery
- ✅ **User Roles**: Different permissions for different user types
- ✅ **Profile Management**: User profile and settings

## 🗄️ Database Schema

### Core Tables
- **Users**: User accounts and authentication
- **Schools**: School information and settings
- **Students**: Student records and information
- **Classes**: Class organization
- **Teachers**: Teacher assignments and information
- **Parents**: Parent contact information

### Finance Tables
- **FeeStructures**: Fee definitions and pricing
- **StudentFees**: Individual student fee assignments
- **FeePayments**: Payment records and history

### Learning Tables
- **Materials**: Learning material definitions
- **Templates**: Reusable material templates
- **Assignments**: Student assignment tracking
- **Progress**: Student progress tracking

## 🔧 Development

### Database Setup
```bash
# Run migrations
cd server && npm run migrate

# Seed initial data
npm run seed
```

### API Endpoints
- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Students**: `/api/v1/students/*`
- **Finance**: `/api/v1/fees/*`, `/api/v1/finance/*`
- **Materials**: `/api/v1/materials/*`
- **Assignments**: `/api/v1/assignments/*`

### Key Features by Role

#### Teacher
- Create and manage learning materials
- Assign and track student assignments
- View student progress
- Send messages to parents

#### School Admin
- Manage teachers and students
- Configure fee structures
- View school analytics
- Manage school settings

#### Finance Manager
- Record student payments
- Configure student service preferences
- Track financial analytics
- Manage fee structures

#### System Admin
- Manage all schools
- System-wide analytics
- User management
- System configuration

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecd_db
DB_USER=ecd_user
DB_PASSWORD=ecd_password

# JWT Secret
JWT_SECRET=your-secret-key

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.
