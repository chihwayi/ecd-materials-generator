-- Development database setup with sample data
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create custom types (same as production)
CREATE TYPE user_role AS ENUM ('teacher', 'school_admin', 'parent', 'system_admin');
CREATE TYPE subscription_plan AS ENUM ('free', 'teacher', 'school', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
CREATE TYPE assignment_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE template_category AS ENUM ('math', 'language', 'art', 'science', 'cultural');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE language_code AS ENUM ('en', 'sn', 'nd');

-- Insert sample data will be handled by seed scripts

---
