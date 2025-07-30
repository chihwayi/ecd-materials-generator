-- Initial database setup for production
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create custom types
CREATE TYPE user_role AS ENUM ('teacher', 'school_admin', 'parent', 'system_admin');
CREATE TYPE subscription_plan AS ENUM ('free', 'teacher', 'school', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');
CREATE TYPE assignment_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE template_category AS ENUM ('math', 'language', 'art', 'science', 'cultural');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE language_code AS ENUM ('en', 'sn', 'nd');

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users USING btree (email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_school_id ON users USING btree (school_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_materials_creator_id ON materials USING btree (creator_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assignments_teacher_id ON assignments USING btree (teacher_id);
