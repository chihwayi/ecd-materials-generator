# Project Structure & Object Relationships Documentation
## ECD Learning Materials Generator

---

## 1. PROJECT DIRECTORY STRUCTURE

```
ecd-materials-generator/
├── 📁 client/                          # Frontend React Application
│   ├── 📁 public/
│   │   ├── manifest.json               # PWA manifest
│   │   ├── sw.js                       # Service worker for offline
│   │   └── icons/                      # App icons
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable UI components
│   │   │   ├── 📁 common/              # Shared components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   ├── 📁 auth/                # Authentication components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── PasswordReset.tsx
│   │   │   ├── 📁 dashboard/           # Dashboard components
│   │   │   │   ├── TeacherDashboard.tsx
│   │   │   │   ├── SchoolDashboard.tsx
│   │   │   │   └── StatsCard.tsx
│   │   │   ├── 📁 editor/              # Material editor components
│   │   │   │   ├── MaterialEditor.tsx
│   │   │   │   ├── ToolPanel.tsx
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── PropertyPanel.tsx
│   │   │   │   └── LayerManager.tsx
│   │   │   ├── 📁 templates/           # Template browser
│   │   │   │   ├── TemplateBrowser.tsx
│   │   │   │   ├── TemplateCard.tsx
│   │   │   │   └── TemplateFilter.tsx
│   │   │   ├── 📁 assignments/         # Assignment management
│   │   │   │   ├── AssignmentManager.tsx
│   │   │   │   ├── AssignmentCard.tsx
│   │   │   │   └── StudentProgress.tsx
│   │   │   └── 📁 materials/           # Material display components
│   │   │       ├── MaterialCard.tsx
│   │   │       ├── MaterialViewer.tsx
│   │   │       └── InteractiveMaterial.tsx
│   │   ├── 📁 pages/                   # Route components
│   │   │   ├── HomePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EditorPage.tsx
│   │   │   ├── TemplatesPage.tsx
│   │   │   ├── AssignmentsPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useOfflineSync.ts
│   │   │   └── useTemplates.ts
│   │   ├── 📁 services/                # API and external services
│   │   │   ├── api.ts                  # Main API client
│   │   │   ├── auth.service.ts
│   │   │   ├── materials.service.ts
│   │   │   ├── templates.service.ts
│   │   │   └── assignments.service.ts
│   │   ├── 📁 utils/                   # Utility functions
│   │   │   ├── dateHelpers.ts
│   │   │   ├── validation.ts
│   │   │   ├── fileHelpers.ts
│   │   │   └── constants.ts
│   │   ├── 📁 types/                   # TypeScript type definitions
│   │   │   ├── user.types.ts
│   │   │   ├── material.types.ts
│   │   │   ├── template.types.ts
│   │   │   └── assignment.types.ts
│   │   ├── 📁 store/                   # State management (Redux/Zustand)
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts
│   │   │   ├── materialsSlice.ts
│   │   │   └── templatesSlice.ts
│   │   ├── 📁 styles/                  # CSS and styling
│   │   │   ├── globals.css
│   │   │   ├── components.css
│   │   │   └── themes.css
│   │   └── App.tsx                     # Main App component
│   ├── package.json
│   └── tailwind.config.js
│
├── 📁 server/                          # Backend Node.js Application
│   ├── 📁 src/
│   │   ├── 📁 controllers/             # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── users.controller.js
│   │   │   ├── materials.controller.js
│   │   │   ├── templates.controller.js
│   │   │   ├── assignments.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── 📁 models/                  # Database models
│   │   │   ├── User.js
│   │   │   ├── School.js
│   │   │   ├── Material.js
│   │   │   ├── Template.js
│   │   │   ├── Assignment.js
│   │   │   ├── Student.js
│   │   │   └── Progress.js
│   │   ├── 📁 routes/                  # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── materials.routes.js
│   │   │   ├── templates.routes.js
│   │   │   ├── assignments.routes.js
│   │   │   └── analytics.routes.js
│   │   ├── 📁 middleware/              # Express middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   ├── upload.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── 📁 services/                # Business logic services
│   │   │   ├── auth.service.js
│   │   │   ├── material.service.js
│   │   │   ├── template.service.js
│   │   │   ├── assignment.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── payment.service.js
│   │   │   └── analytics.service.js
│   │   ├── 📁 utils/                   # Server utilities
│   │   │   ├── database.js
│   │   │   ├── logger.js
│   │   │   ├── email.js
│   │   │   ├── sms.js
│   │   │   ├── fileUpload.js
│   │   │   └── pdfGenerator.js
│   │   ├── 📁 config/                  # Configuration files
│   │   │   ├── database.config.js
│   │   │   ├── auth.config.js
│   │   │   ├── email.config.js
│   │   │   └── payment.config.js
│   │   ├── 📁 migrations/              # Database migrations
│   │   ├── 📁 seeds/                   # Database seed data
│   │   └── app.js                      # Main server file
│   ├── package.json
│   └── .env.example
│
├── 📁 shared/                          # Shared utilities and types
│   ├── 📁 types/                       # Shared TypeScript types
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── validation.schemas.ts
│   └── 📁 constants/                   # Shared constants
│       ├── roles.js
│       ├── permissions.js
│       └── culturalContent.js
│
├── 📁 assets/                          # Static assets
│   ├── 📁 templates/                   # Template JSON files
│   │   ├── 📁 math/
│   │   ├── 📁 language/
│   │   ├── 📁 art/
│   │   └── 📁 cultural/
│   ├── 📁 images/                      # Default images and clipart
│   │   ├── 📁 animals/
│   │   ├── 📁 objects/
│   │   ├── 📁 patterns/
│   │   └── 📁 backgrounds/
│   └── 📁 audio/                       # Audio files for phonics
│       ├── 📁 english/
│       ├── 📁 shona/
│       └── 📁 ndebele/
│
├── 📁 docs/                            # Documentation
│   ├── API.md                          # API documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   ├── CONTRIBUTING.md                 # Development guidelines
│   └── CULTURAL_GUIDELINES.md          # Cultural content guidelines
│
├── 📁 tests/                           # Test files
│   ├── 📁 unit/                        # Unit tests
│   ├── 📁 integration/                 # Integration tests
│   └── 📁 e2e/                         # End-to-end tests
│
├── 📁 scripts/                         # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── seed-data.js
│
├── docker-compose.yml                  # Docker configuration
├── .gitignore
├── README.md
└── package.json                        # Root package.json
```

---

## 2. CORE OBJECT RELATIONSHIPS & DATA MODELS

### 2.1 Entity Relationship Diagram (ERD) Description

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      User       │◄───────►│     School      │◄───────►│    Student      │
│                 │         │                 │         │                 │
│ - id            │         │ - id            │         │ - id            │
│ - email         │         │ - name          │         │ - firstName     │
│ - password      │         │ - address       │         │ - lastName      │
│ - role          │         │ - contactInfo   │         │ - age           │
│ - firstName     │         │ - subscription  │         │ - parentContact │
│ - lastName      │         │ - createdAt     │         │ - schoolId      │
│ - schoolId      │         │ - updatedAt     │         │ - createdAt     │
│ - isActive      │         └─────────────────┘         └─────────────────┘
│ - createdAt     │                   │                           │
│ - updatedAt     │                   │                           │
└─────────────────┘                   │                           │
         │                            │                           │
         │ creates                    │                           │
         ▼                            │                           │
┌─────────────────┐         ┌─────────────────┐                   │
│    Template     │         │    Material     │◄──────────────────┤
│                 │         │                 │                   │
│ - id            │         │ - id            │                   │
│ - name          │ generates│ - title         │                   │
│ - description   │────────►│ - description   │                   │
│ - category      │         │ - templateId    │                   │
│ - difficulty    │         │ - creatorId     │                   │
│ - culturalTags  │         │ - content       │                   │
│ - content       │         │ - isPublic      │                   │
│ - isActive      │         │ - downloads     │                   │
│ - createdAt     │         │ - createdAt     │                   │
│ - updatedAt     │         │ - updatedAt     │                   │
└─────────────────┘         └─────────────────┘                   │
                                      │                           │
                                      │ assigned in               │
                                      ▼                           │
                            ┌─────────────────┐                   │
                            │   Assignment    │                   │
                            │                 │                   │
                            │ - id            │                   │
                            │ - title         │                   │
                            │ - description   │                   │
                            │ - materialId    │                   │
                            │ - teacherId     │                   │
                            │ - studentIds[]  │◄──────────────────┤
                            │ - dueDate       │                   │
                            │ - isActive      │                   │
                            │ - createdAt     │                   │
                            │ - updatedAt     │                   │
                            └─────────────────┘                   │
                                      │                           │
                                      │ tracks                    │
                                      ▼                           │
                            ┌─────────────────┐                   │
                            │    Progress     │                   │
                            │                 │                   │
                            │ - id            │                   │
                            │ - assignmentId  │                   │
                            │ - studentId     │◄──────────────────┘
                            │ - status        │
                            │ - completionRate│
                            │ - timeSpent     │
                            │ - attempts      │
                            │ - lastAccessed  │
                            │ - createdAt     │
                            │ - updatedAt     │
                            └─────────────────┘
```

### 2.2 Detailed Object Models

#### 2.2.1 User Model
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  role: UserRole; // 'teacher' | 'school_admin' | 'parent'
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phoneNumber?: string;
    language: Language; // 'en' | 'sn' | 'nd'
  };
  schoolId?: string;
  subscription: {
    plan: SubscriptionPlan; // 'free' | 'teacher' | 'school' | 'premium'
    status: SubscriptionStatus; // 'active' | 'cancelled' | 'expired'
    expiresAt?: Date;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: NotificationSettings;
    defaultLanguage: Language;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.2.2 Template Model
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory; // 'math' | 'language' | 'art' | 'science' | 'cultural'
  subcategory?: string;
  difficulty: DifficultyLevel; // 'beginner' | 'intermediate' | 'advanced'
  ageGroup: {
    min: number; // 3
    max: number; // 6
  };
  culturalTags: string[]; // ['zimbabwe', 'shona', 'traditional']
  languages: Language[];
  content: {
    layout: LayoutConfig;
    elements: TemplateElement[];
    interactiveFeatures?: InteractiveFeature[];
  };
  preview: {
    thumbnail: string;
    images: string[];
  };
  metadata: {
    creatorId?: string;
    downloads: number;
    rating: number;
    reviews: number;
    isPremium: boolean;
    isActive: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.2.3 Material Model
```typescript
interface Material {
  id: string;
  title: string;
  description?: string;
  templateId: string;
  creatorId: string;
  content: {
    elements: MaterialElement[];
    customizations: CustomizationData;
    layout: LayoutConfig;
  };
  outputs: {
    pdf?: {
      url: string;
      size: number;
      generatedAt: Date;
    };
    interactive?: {
      url: string;
      version: string;
      generatedAt: Date;
    };
  };
  sharing: {
    isPublic: boolean;
    sharedWith: string[]; // user IDs
    allowDownload: boolean;
    allowCopy: boolean;
  };
  analytics: {
    views: number;
    downloads: number;
    assignments: number;
    lastAccessed?: Date;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.2.4 Assignment Model
```typescript
interface Assignment {
  id: string;
  title: string;
  description?: string;
  instructions: string;
  materialId: string;
  teacherId: string;
  studentIds: string[];
  settings: {
    dueDate?: Date;
    allowLateSubmission: boolean;
    maxAttempts?: number;
    timeLimit?: number; // minutes
    showProgress: boolean;
  };
  notification: {
    parentNotification: boolean;
    reminderDays: number[];
    notificationMethod: NotificationMethod[]; // 'email' | 'sms' | 'whatsapp'
  };
  status: AssignmentStatus; // 'draft' | 'active' | 'completed' | 'archived'
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.2.5 Progress Model
```typescript
interface Progress {
  id: string;
  assignmentId: string;
  studentId: string;
  status: ProgressStatus; // 'not_started' | 'in_progress' | 'completed' | 'overdue'
  completion: {
    percentage: number; // 0-100
    completedAt?: Date;
    timeSpent: number; // minutes
    attempts: number;
  };
  interaction: {
    clickData: InteractionPoint[];
    drawingData?: DrawingData[];
    answers?: AnswerData[];
  };
  feedback: {
    autoFeedback?: AutoFeedback;
    teacherComments?: string;
    parentViewed: boolean;
  };
  lastAccessed: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. API ARCHITECTURE & RELATIONSHIPS

### 3.1 RESTful API Structure

```
/api/v1/
├── 🔐 /auth/                           # Authentication endpoints
│   ├── POST   /login                   # User login
│   ├── POST   /register                # User registration
│   ├── POST   /logout                  # User logout
│   ├── POST   /refresh                 # Token refresh
│   └── POST   /reset-password          # Password reset
│
├── 👤 /users/                          # User management
│   ├── GET    /profile                 # Get user profile
│   ├── PUT    /profile                 # Update user profile
│   ├── GET    /preferences             # Get user preferences
│   ├── PUT    /preferences             # Update preferences
│   └── DELETE /account                 # Delete account
│
├── 🏫 /schools/                        # School management
│   ├── GET    /:id                     # Get school details
│   ├── PUT    /:id                     # Update school
│   ├── GET    /:id/teachers            # Get school teachers
│   ├── POST   /:id/teachers            # Add teacher to school
│   └── GET    /:id/students            # Get school students
│
├── 📄 /templates/                      # Template management
│   ├── GET    /                        # List templates (with filters)
│   ├── GET    /:id                     # Get specific template
│   ├── GET    /categories              # Get template categories
│   ├── GET    /featured                # Get featured templates
│   ├── POST   /                        # Create custom template
│   └── PUT    /:id/rating              # Rate template
│
├── 📝 /materials/                      # Material management
│   ├── GET    /                        # List user materials
│   ├── POST   /                        # Create new material
│   ├── GET    /:id                     # Get specific material
│   ├── PUT    /:id                     # Update material
│   ├── DELETE /:id                     # Delete material
│   ├── POST   /:id/duplicate           # Duplicate material
│   ├── POST   /:id/generate-pdf        # Generate PDF
│   ├── POST   /:id/generate-interactive # Generate interactive version
│   └── GET    /:id/analytics           # Get material analytics
│
├── 📚 /assignments/                    # Assignment management
│   ├── GET    /                        # List assignments
│   ├── POST   /                        # Create assignment
│   ├── GET    /:id                     # Get assignment details
│   ├── PUT    /:id                     # Update assignment
│   ├── DELETE /:id                     # Delete assignment
│   ├── POST   /:id/assign              # Assign to students
│   ├── GET    /:id/progress            # Get assignment progress
│   └── POST   /:id/reminder            # Send reminder
│
├── 👨‍🎓 /students/                        # Student management
│   ├── GET    /                        # List students
│   ├── POST   /                        # Add student
│   ├── GET    /:id                     # Get student details
│   ├── PUT    /:id                     # Update student
│   ├── DELETE /:id                     # Remove student
│   ├── GET    /:id/assignments         # Get student assignments
│   ├── GET    /:id/progress            # Get student progress
│   └── POST   /:id/parent-contact      # Update parent contact
│
├── 📊 /analytics/                      # Analytics endpoints
│   ├── GET    /dashboard               # Dashboard analytics
│   ├── GET    /materials               # Material analytics
│   ├── GET    /assignments             # Assignment analytics
│   ├── GET    /students                # Student analytics
│   └── GET    /usage                   # Usage statistics
│
├── 💰 /billing/                        # Billing & subscriptions
│   ├── GET    /subscription            # Get subscription status
│   ├── POST   /subscribe               # Create subscription
│   ├── PUT    /subscription            # Update subscription
│   ├── POST   /cancel                  # Cancel subscription
│   ├── GET    /invoices                # Get billing history
│   └── POST   /payment-methods         # Add payment method
│
└── 🔔 /notifications/                  # Notification management
    ├── GET    /                        # Get notifications
    ├── PUT    /:id/read                # Mark as read
    ├── PUT    /read-all                # Mark all as read
    ├── POST   /send                    # Send notification
    └── PUT    /settings                # Update notification settings
```

### 3.2 WebSocket Events (Real-time Features)

```typescript
// Editor collaboration events
interface EditorEvents {
  'editor:join': { materialId: string; userId: string };
  'editor:leave': { materialId: string; userId: string };
  'editor:cursor': { position: Position; userId: string };
  'editor:change': { changes: EditorChange[]; userId: string };
  'editor:save': { materialId: string; content: MaterialContent };
}

// Assignment events
interface AssignmentEvents {
  'assignment:created': { assignmentId: string; studentIds: string[] };
  'assignment:updated': { assignmentId: string; changes: Partial<Assignment> };
  'assignment:completed': { assignmentId: string; studentId: string };
  'assignment:reminder': { assignmentId: string; studentIds: string[] };
}

// Progress tracking events
interface ProgressEvents {
  'progress:started': { assignmentId: string; studentId: string };
  'progress:updated': { progressId: string; completion: number };
  'progress:completed': { progressId: string; completedAt: Date };
}
```

---

## 4. COMPONENT RELATIONSHIPS & DATA FLOW

### 4.1 Frontend Component Hierarchy

```
App
├── Router
├── AuthProvider
│   ├── LoginForm
│   ├── RegisterForm
│   └── PasswordReset
├── AppProvider (Global State)
│   ├── Header
│   │   ├── Navigation
│   │   ├── UserMenu
│   │   └── NotificationBell
│   ├── MainContent
│   │   ├── Dashboard
│   │   │   ├── StatsCards
│   │   │   ├── RecentMaterials
│   │   │   ├── PendingAssignments
│   │   │   └── QuickActions
│   │   ├── TemplatesBrowser
│   │   │   ├── FilterPanel
│   │   │   ├── TemplateGrid
│   │   │   │   └── TemplateCard[]
│   │   │   └── TemplatePreview
│   │   ├── MaterialEditor
│   │   │   ├── EditorCanvas
│   │   │   ├── ToolPanel
│   │   │   │   ├── TextTool
│   │   │   │   ├── ImageTool
│   │   │   │   ├── ShapeTool
│   │   │   │   └── ColorPicker
│   │   │   ├── PropertyPanel
│   │   │   ├── LayerManager
│   │   │   └── PreviewPanel
│   │   ├── AssignmentManager
│   │   │   ├── AssignmentList
│   │   │   ├── AssignmentForm
│   │   │   ├── StudentSelector
│   │   │   └── ProgressTracker
│   │   └── Analytics
│   │       ├── Overview
│   │       ├── MaterialStats
│   │       ├── StudentProgress
│   │       └── UsageMetrics
│   └── Footer
└── NotificationSystem
    ├── ToastContainer
    └── OfflineIndicator
```

### 4.2 State Management Flow

```typescript
// Global State Structure
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  };
  
  templates: {
    items: Template[];
    categories: Category[];
    filters: FilterState;
    loading: boolean;
    error: string | null;
  };
  
  materials: {
    items: Material[];
    currentMaterial: Material | null;
    loading: boolean;
    error: string | null;
  };
  
  assignments: {
    items: Assignment[];
    currentAssignment: Assignment | null;
    progress: Progress[];
    loading: boolean;
    error: string | null;
  };
  
  ui: {
    theme: 'light' | 'dark';
    sidebar: { isOpen: boolean };
    modals: { [key: string]: boolean };
    notifications: Notification[];
  };
  
  offline: {
    isOnline: boolean;
    pendingSync: SyncItem[];
    lastSync: Date | null;
  };
}
```

### 4.3 Data Flow Patterns

#### 4.3.1 Material Creation Flow
```
User selects template → Template loaded into editor → User customizes content → 
Material saved to database → PDF/Interactive versions generated → 
Material available for assignment
```

#### 4.3.2 Assignment Flow
```
Teacher creates assignment → Students selected → Notifications sent to parents → 
Students access assignment → Progress tracked → Completion recorded → 
Analytics updated → Teacher reviews results
```

#### 4.3.3 Offline Sync Flow
```
User works offline → Changes stored locally → Connection restored → 
Pending changes synced → Conflicts resolved → UI updated with latest data
```

---

## 5. INTEGRATION POINTS & EXTERNAL SERVICES

### 5.1 Third-Party Service Integration

```typescript
// Payment Integration (Stripe/PayPal)
interface PaymentService {
  createSubscription(planId: string, customerId: string): Promise<Subscription>;
  updateSubscription(subscriptionId: string, changes: object): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  handleWebhook(payload: object, signature: string): Promise<void>;
}

// Communication Services
interface NotificationService {
  sendEmail(to: string, template: string, data: object): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
  sendWhatsApp(to: string, message: string): Promise<void>;
}

// File Storage (AWS S3/CloudFlare)
interface StorageService {
  uploadFile(file: Buffer, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  generateSignedUrl(path: string, expiry: number): Promise<string>;
}

// Analytics Integration
interface AnalyticsService {
  trackEvent(event: string, properties: object): void;
  trackUser(userId: string, properties: object): void;
  trackPageView(page: string, properties: object): void;
}
```

### 5.2 Cultural Content Integration

```typescript
// Cultural content configuration
interface CulturalContent {
  languages: {
    [key: string]: {
      name: string;
      code: string;
      rtl: boolean;
      fonts: string[];
    };
  };
  
  assets: {
    animals: CulturalAsset[];
    foods: CulturalAsset[];
    clothing: CulturalAsset[];
    patterns: CulturalAsset[];
    celebrations: CulturalAsset[];
  };
  
  audio: {
    phonics: { [language: string]: AudioAsset[] };
    words: { [language: string]: AudioAsset[] };
  };
}
```

---

## 6. SECURITY & PERMISSIONS MODEL

### 6.1 Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  TEACHER = 'teacher',
  SCHOOL_ADMIN = 'school_admin',
  PARENT = 'parent',
  SYSTEM_ADMIN = 'system_admin'
}

enum Permission {
  // Template permissions
  VIEW_TEMPLATES = 'view_templates',
  CREATE_TEMPLATES = 'create_templates',
  EDIT_TEMPLATES = 'edit_templates',
  DELETE_TEMPLATES = 'delete_templates',
  
  // Material permissions
  VIEW_MATERIALS = 'view_materials',
  CREATE_MATERIALS = 'create_materials',
  EDIT_MATERIALS = 'edit_materials',
  DELETE_MATERIALS = 'delete_materials',
  SHARE_MATERIALS = 'share_materials',
  
  // Assignment permissions
  VIEW_ASSIGNMENTS = 'view_assignments',
  CREATE_ASSIGNMENTS = 'create_assignments',
  EDIT_ASSIGNMENTS = 'edit_assignments',
  DELETE_ASSIGNMENTS = 'delete_assignments',
  GRADE_ASSIGNMENTS = 'grade_assignments',
  
  // Student permissions
  VIEW_STUDENTS = 'view_students',
  MANAGE_STUDENTS = 'manage_students',
  VIEW_STUDENT_PROGRESS = 'view_student_progress',
  
  // School permissions
  MANAGE_SCHOOL = 'manage_school',
  VIEW_SCHOOL_ANALYTICS = 'view_school_analytics',
  MANAGE_TEACHERS = 'manage_teachers',
  
  // System permissions
  MANAGE_USERS = 'manage_users',
  VIEW_SYSTEM_ANALYTICS = 'view_system_analytics',
  MANAGE_BILLING = 'manage_billing'
}

interface RolePermissions {
  [UserRole.TEACHER]: Permission[];
  [UserRole.SCHOOL_ADMIN]: Permission[];
  [UserRole.PARENT]: Permission[];
  [UserRole.SYSTEM_ADMIN]: Permission[];
}

const rolePermissions: RolePermissions = {
  [UserRole.TEACHER]: [
    Permission.VIEW_TEMPLATES,
    Permission.CREATE_MATERIALS,
    Permission.EDIT_MATERIALS,
    Permission.DELETE_MATERIALS,
    Permission.SHARE_MATERIALS,
    Permission.CREATE_ASSIGNMENTS,
    Permission.EDIT_ASSIGNMENTS,
    Permission.VIEW_STUDENTS,
    Permission.VIEW_STUDENT_PROGRESS,
    Permission.GRADE_ASSIGNMENTS
  ],
  [UserRole.SCHOOL_ADMIN]: [
    ...rolePermissions[UserRole.TEACHER],
    Permission.MANAGE_SCHOOL,
    Permission.VIEW_SCHOOL_ANALYTICS,
    Permission.MANAGE_TEACHERS,
    Permission.MANAGE_STUDENTS,
    Permission.MANAGE_BILLING
  ],
  [UserRole.PARENT]: [
    Permission.VIEW_STUDENT_PROGRESS
  ],
  [UserRole.SYSTEM_ADMIN]: [
    ...Object.values(Permission)
  ]
};
```

### 6.2 Data Access Patterns

```typescript
// Middleware for permission checking
interface AccessControl {
  requirePermission(permission: Permission): MiddlewareFunction;
  requireOwnership(resourceType: string): MiddlewareFunction;
  requireSchoolMembership(): MiddlewareFunction;
}

// Data filtering based on user context
interface DataFilter {
  filterTemplates(templates: Template[], user: User): Template[];
  filterMaterials(materials: Material[], user: User): Material[];
  filterStudents(students: Student[], user: User): Student[];
  filterAnalytics(data: AnalyticsData, user: User): AnalyticsData;
}
```

---

## 7. PERFORMANCE & OPTIMIZATION STRATEGIES

### 7.1 Caching Strategy

```typescript
// Multi-level caching approach
interface CacheStrategy {
  // Browser cache (Service Worker)
  serviceWorker: {
    staticAssets: string[]; // CSS, JS, images
    templates: Template[];
    userMaterials: Material[];
    maxAge: number;
  };
  
  // Application cache (Redis)
  redis: {
    sessions: { ttl: 86400 }; // 24 hours
    templates: { ttl: 3600 }; // 1 hour
    analytics: { ttl: 1800 }; // 30 minutes
  };
  
  // Database query cache
  database: {
    frequentQueries: string[];
    materialized_views: string[];
  };
  
  // CDN cache
  cdn: {
    staticAssets: { maxAge: 31536000 }; // 1 year
    generatedPDFs: { maxAge: 86400 }; // 1 day
    images: { maxAge: 604800 }; // 1 week
  };
}
```

### 7.2 Database Optimization

```sql
-- Key database indexes for performance
CREATE INDEX idx_materials_creator_id ON materials(creator_id);
CREATE INDEX idx_materials_template_id ON materials(template_id);
CREATE INDEX idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_progress_student_assignment ON progress(student_id, assignment_id);
CREATE INDEX idx_templates_category_difficulty ON templates(category, difficulty);
CREATE INDEX idx_users_school_role ON users(school_id, role);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW student_progress_summary AS
SELECT 
  s.id as student_id,
  COUNT(p.id) as total_assignments,
  AVG(p.completion_percentage) as avg_completion,
  SUM(p.time_spent) as total_time_spent
FROM students s
LEFT JOIN progress p ON s.id = p.student_id
GROUP BY s.id;

-- Partitioning for large tables
CREATE TABLE progress_2025 PARTITION OF progress
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### 7.3 Frontend Performance

```typescript
// Code splitting strategy
const LazyComponents = {
  Dashboard: lazy(() => import('./pages/DashboardPage')),
  Editor: lazy(() => import('./pages/EditorPage')),
  Templates: lazy(() => import('./pages/TemplatesPage')),
  Analytics: lazy(() => import('./pages/AnalyticsPage'))
};

// Virtual scrolling for large lists
interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
  threshold: number;
}

// Image optimization
interface ImageOptimization {
  lazy: boolean;
  formats: ['webp', 'jpg', 'png'];
  sizes: {
    thumbnail: { width: 150, height: 150 };
    medium: { width: 400, height: 300 };
    large: { width: 800, height: 600 };
  };
  compression: {
    quality: 85;
    progressive: true;
  };
}
```

---

## 8. DEPLOYMENT & INFRASTRUCTURE

### 8.1 Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000
    depends_on:
      - backend
    volumes:
      - ./client:/app
      - /app/node_modules

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/ecd_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./server:/app
      - /app/node_modules

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=ecd_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

### 8.2 Environment Configuration

```typescript
// Environment variables structure
interface EnvironmentConfig {
  // Application
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  API_VERSION: string;
  
  // Database
  DATABASE_URL: string;
  DATABASE_POOL_SIZE: number;
  
  // Cache
  REDIS_URL: string;
  CACHE_TTL: number;
  
  // Authentication
  JWT_SECRET: string;
  JWT_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  
  // File Storage
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
  AWS_REGION: string;
  
  // Payment
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  
  // Communications
  SENDGRID_API_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  
  // Analytics
  GOOGLE_ANALYTICS_ID: string;
  MIXPANEL_TOKEN: string;
  
  // Feature Flags
  FEATURE_COLLABORATION: boolean;
  FEATURE_OFFLINE_SYNC: boolean;
  FEATURE_ADVANCED_ANALYTICS: boolean;
}
```

---

## 9. TESTING STRATEGY

### 9.1 Test Structure

```
tests/
├── 📁 unit/                            # Unit tests
│   ├── 📁 components/                  # Component tests
│   │   ├── TemplateCard.test.tsx
│   │   ├── MaterialEditor.test.tsx
│   │   └── AssignmentForm.test.tsx
│   ├── 📁 services/                    # Service tests
│   │   ├── api.test.ts
│   │   ├── auth.service.test.ts
│   │   └── material.service.test.ts
│   ├── 📁 utils/                       # Utility tests
│   │   ├── validation.test.ts
│   │   ├── dateHelpers.test.ts
│   │   └── fileHelpers.test.ts
│   └── 📁 models/                      # Model tests
│       ├── User.test.js
│       ├── Material.test.js
│       └── Assignment.test.js
│
├── 📁 integration/                     # Integration tests
│   ├── 📁 api/                         # API endpoint tests
│   │   ├── auth.integration.test.js
│   │   ├── materials.integration.test.js
│   │   └── assignments.integration.test.js
│   ├── 📁 database/                    # Database tests
│   │   ├── migrations.test.js
│   │   └── relationships.test.js
│   └── 📁 external/                    # External service tests
│       ├── payment.integration.test.js
│       └── storage.integration.test.js
│
├── 📁 e2e/                             # End-to-end tests
│   ├── 📁 user-flows/                  # Complete user journeys
│   │   ├── teacher-creates-material.e2e.js
│   │   ├── assignment-workflow.e2e.js
│   │   └── student-completes-assignment.e2e.js
│   ├── 📁 cross-browser/               # Browser compatibility
│   └── 📁 mobile/                      # Mobile-specific tests
│
├── 📁 performance/                     # Performance tests
│   ├── load-testing.js
│   ├── stress-testing.js
│   └── database-performance.js
│
└── 📁 fixtures/                        # Test data
    ├── users.json
    ├── templates.json
    ├── materials.json
    └── assignments.json
```

### 9.2 Test Configuration

```typescript
// Test utilities and helpers
interface TestHelpers {
  // Database helpers
  createTestUser(role: UserRole): Promise<User>;
  createTestMaterial(creatorId: string): Promise<Material>;
  createTestAssignment(teacherId: string, studentIds: string[]): Promise<Assignment>;
  cleanupTestData(): Promise<void>;
  
  // Mock helpers
  mockAuthMiddleware(): MiddlewareFunction;
  mockPaymentService(): PaymentService;
  mockNotificationService(): NotificationService;
  
  // API helpers
  authenticatedRequest(user: User): SuperTest<Test>;
  expectSuccessResponse(response: Response): void;
  expectErrorResponse(response: Response, statusCode: number): void;
}

// E2E test configuration
interface E2EConfig {
  baseUrl: string;
  browsers: ['chrome', 'firefox', 'safari'];
  viewports: [
    { width: 1920, height: 1080 }, // Desktop
    { width: 768, height: 1024 },  // Tablet
    { width: 375, height: 667 }    // Mobile
  ];
  testData: {
    teachers: TestUser[];
    students: TestStudent[];
    materials: TestMaterial[];
  };
}
```

---

## 10. MONITORING & OBSERVABILITY

### 10.1 Logging Strategy

```typescript
// Structured logging configuration
interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'text';
  destinations: ['console', 'file', 'external'];
  
  // Log categories
  categories: {
    auth: { level: 'info', includeDetails: false };
    api: { level: 'info', includeHeaders: false };
    database: { level: 'warn', slowQueryThreshold: 1000 };
    payment: { level: 'info', sensitiveDataMask: true };
    user_activity: { level: 'info', retention: 90 };
  };
  
  // Error tracking
  errorTracking: {
    captureExceptions: true;
    captureUnhandledRejections: true;
    beforeSend: (event: ErrorEvent) => ErrorEvent;
  };
}

// Application metrics
interface Metrics {
  // Performance metrics
  response_time: Histogram;
  request_count: Counter;
  active_connections: Gauge;
  database_query_time: Histogram;
  
  // Business metrics
  user_registrations: Counter;
  materials_created: Counter;
  assignments_completed: Counter;
  subscription_conversions: Counter;
  
  // System metrics
  memory_usage: Gauge;
  cpu_usage: Gauge;
  disk_usage: Gauge;
  cache_hit_rate: Gauge;
}
```

### 10.2 Health Checks

```typescript
// Health check endpoints
interface HealthChecks {
  '/health': () => Promise<HealthStatus>;
  '/health/database': () => Promise<DatabaseHealth>;
  '/health/redis': () => Promise<RedisHealth>;
  '/health/external': () => Promise<ExternalServicesHealth>;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  version: string;
  uptime: number;
  checks: {
    [service: string]: {
      status: 'pass' | 'fail';
      responseTime?: number;
      details?: any;
    };
  };
}
```

---

## 11. DEVELOPMENT WORKFLOW

### 11.1 Git Workflow

```
Main Branches:
├── main                    # Production-ready code
├── develop                 # Integration branch
├── staging                 # Staging environment

Feature Branches:
├── feature/user-auth       # New feature development
├── feature/material-editor # Feature branches
├── bugfix/login-issue      # Bug fixes
├── hotfix/security-patch   # Critical fixes

Release Branches:
└── release/v1.0.0         # Release preparation
```

### 11.2 Development Commands

```bash
# Setup commands
npm run setup                # Initial project setup
npm run install:all          # Install all dependencies
npm run db:setup            # Setup database
npm run seed:dev            # Seed development data

# Development commands
npm run dev                 # Start development servers
npm run dev:client          # Start frontend only
npm run dev:server          # Start backend only
npm run storybook           # Start component library

# Testing commands
npm run test                # Run all tests
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests
npm run test:e2e           # End-to-end tests
npm run test:coverage       # Generate coverage report

# Build commands
npm run build               # Build for production
npm run build:client       # Build frontend
npm run build:server       # Build backend
npm run docker:build       # Build Docker images

# Deployment commands
npm run deploy:staging      # Deploy to staging
npm run deploy:production   # Deploy to production
npm run rollback           # Rollback deployment

# Quality commands
npm run lint               # Run linters
npm run format             # Format code
npm run type-check         # TypeScript checking
npm run audit              # Security audit
```

---

## 12. SCALABILITY CONSIDERATIONS

### 12.1 Horizontal Scaling Strategy

```typescript
// Microservices breakdown (future scaling)
interface MicroservicesArchitecture {
  services: {
    auth_service: {
      responsibilities: ['authentication', 'authorization', 'user_management'];
      database: 'postgres';
      cache: 'redis';
    };
    
    content_service: {
      responsibilities: ['templates', 'materials', 'file_storage'];
      database: 'postgres + mongodb';
      cache: 'redis';
    };
    
    assignment_service: {
      responsibilities: ['assignments', 'progress_tracking', 'analytics'];
      database: 'postgres';
      cache: 'redis';
    };
    
    notification_service: {
      responsibilities: ['email', 'sms', 'push_notifications'];
      database: 'mongodb';
      queue: 'redis';
    };
    
    payment_service: {
      responsibilities: ['billing', 'subscriptions', 'payments'];
      database: 'postgres';
      external: ['stripe', 'paypal'];
    };
  };
  
  communication: {
    synchronous: 'HTTP/REST';
    asynchronous: 'Redis Pub/Sub';
    events: 'Event Sourcing';
  };
}
```

### 12.2 Database Scaling

```sql
-- Database sharding strategy
-- Shard by school_id for multi-tenancy
CREATE TABLE materials_shard_1 (
  LIKE materials INCLUDING ALL
) PARTITION OF materials FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE materials_shard_2 (
  LIKE materials INCLUDING ALL  
) PARTITION OF materials FOR VALUES WITH (MODULUS 4, REMAINDER 1);

-- Read replicas for analytics
CREATE PUBLICATION analytics_pub FOR TABLE 
  assignments, progress, materials, templates;

-- Archive old data
CREATE TABLE progress_archive (
  LIKE progress INCLUDING ALL
);

-- Move data older than 2 years to archive
INSERT INTO progress_archive 
SELECT * FROM progress 
WHERE created_at < NOW() - INTERVAL '2 years';
```

---

## 13. SECURITY IMPLEMENTATION DETAILS

### 13.1 Data Encryption

```typescript
// Encryption configuration
interface EncryptionConfig {
  // Data at rest
  database: {
    encryption: 'AES-256';
    keyRotation: '30d';
    transparentDataEncryption: true;
  };
  
  // Data in transit
  transport: {
    tls: '1.3';
    certificateAuthority: 'LetsEncrypt';
    hsts: true;
    perfectForwardSecrecy: true;
  };
  
  // Application level
  application: {
    sensitiveFields: ['password', 'phone_number', 'parent_contact'];
    encryptionAlgorithm: 'AES-256-GCM';
    keyDerivation: 'PBKDF2';
  };
}

// Input validation and sanitization
interface SecurityValidation {
  inputSanitization: {
    html: 'DOMPurify';
    sql: 'Parameterized queries';
    nosql: 'MongoDB sanitization';
    fileUploads: 'Virus scanning + type validation';
  };
  
  rateLimiting: {
    api: '100 requests/minute';
    auth: '5 attempts/15 minutes';
    fileUpload: '10 files/hour';
  };
  
  cors: {
    allowedOrigins: string[];
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'];
    allowCredentials: true;
  };
}
```

---

## 14. CONCLUSION & NEXT STEPS

This comprehensive project structure and object relationships documentation provides a complete foundation for developing the ECD Learning Materials Generator. The architecture is designed to:

### ✅ **SRS Requirements Satisfaction**
- **All functional requirements** (FR-001 to FR-050) are addressed in the component structure
- **Non-functional requirements** (NFR-001 to NFR-023) are incorporated in the technical architecture
- **Performance, security, and scalability** requirements are built into the foundation

### 🎯 **Key Strengths of This Architecture**
1. **Modular Design**: Easy to maintain, test, and scale individual components
2. **Cultural Integration**: Built-in support for Zimbabwean cultural content and languages
3. **Offline-First**: Designed for low-connectivity environments
4. **Mobile-Optimized**: Progressive Web App with responsive design
5. **Scalable**: Ready for horizontal scaling and microservices migration
6. **Secure**: Multi-layer security with proper data protection

### 🚀 **Immediate Next Steps**
1. **Environment Setup**: Set up development environment with Docker
2. **Database Schema**: Create initial database migrations
3. **Authentication System**: Implement JWT-based auth with role management
4. **Template System**: Build the core template engine and editor
5. **MVP Features**: Focus on essential features for initial release

### 📋 **Development Priority Order**
1. **Phase 1** (Weeks 1-4): Authentication, basic templates, material editor
2. **Phase 2** (Weeks 5-8): Assignment system, PDF generation, basic analytics
3. **Phase 3** (Weeks 9-12): Interactive materials, notifications, payment integration
4. **Phase 4** (Weeks 13-16): Advanced features, optimization, deployment

The architecture is production-ready and provides a solid foundation for building a successful ECD learning platform tailored specifically for the Zimbabwean market while maintaining the flexibility to expand to other regions.

Ready to start development! 🎨📚