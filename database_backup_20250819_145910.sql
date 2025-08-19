--
-- PostgreSQL database dump
--

\restrict 2fa39CFVDS8bPAebeo1sdEXsaQfPwkWZ9b1FuhWctkZ8G7iCMHslrSGC6vPq35K

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS ecd_db;
--
-- Name: ecd_db; Type: DATABASE; Schema: -; Owner: ecd_user
--

CREATE DATABASE ecd_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE ecd_db OWNER TO ecd_user;

\unrestrict 2fa39CFVDS8bPAebeo1sdEXsaQfPwkWZ9b1FuhWctkZ8G7iCMHslrSGC6vPq35K
\connect ecd_db
\restrict 2fa39CFVDS8bPAebeo1sdEXsaQfPwkWZ9b1FuhWctkZ8G7iCMHslrSGC6vPq35K

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: assignment_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.assignment_status AS ENUM (
    'draft',
    'active',
    'completed',
    'archived'
);


ALTER TYPE public.assignment_status OWNER TO ecd_user;

--
-- Name: difficulty_level; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.difficulty_level AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public.difficulty_level OWNER TO ecd_user;

--
-- Name: enum_Assignment_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Assignment_status" AS ENUM (
    'draft',
    'active',
    'completed',
    'archived'
);


ALTER TYPE public."enum_Assignment_status" OWNER TO ecd_user;

--
-- Name: enum_Assignment_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Assignment_type" AS ENUM (
    'material',
    'custom'
);


ALTER TYPE public."enum_Assignment_type" OWNER TO ecd_user;

--
-- Name: enum_Assignments_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Assignments_status" AS ENUM (
    'draft',
    'active',
    'completed',
    'archived'
);


ALTER TYPE public."enum_Assignments_status" OWNER TO ecd_user;

--
-- Name: enum_FeeConfiguration_fee_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeConfiguration_fee_type" AS ENUM (
    'monthly',
    'term',
    'flexible'
);


ALTER TYPE public."enum_FeeConfiguration_fee_type" OWNER TO ecd_user;

--
-- Name: enum_FeeConfiguration_term; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeConfiguration_term" AS ENUM (
    'term1',
    'term2',
    'term3'
);


ALTER TYPE public."enum_FeeConfiguration_term" OWNER TO ecd_user;

--
-- Name: enum_FeeConfigurations_feeType; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeConfigurations_feeType" AS ENUM (
    'monthly',
    'term',
    'flexible'
);


ALTER TYPE public."enum_FeeConfigurations_feeType" OWNER TO ecd_user;

--
-- Name: enum_FeeConfigurations_term; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeConfigurations_term" AS ENUM (
    'term1',
    'term2',
    'term3'
);


ALTER TYPE public."enum_FeeConfigurations_term" OWNER TO ecd_user;

--
-- Name: enum_FeePayment_payment_method; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeePayment_payment_method" AS ENUM (
    'cash',
    'bank_transfer',
    'mobile_money',
    'check',
    'other'
);


ALTER TYPE public."enum_FeePayment_payment_method" OWNER TO ecd_user;

--
-- Name: enum_FeeStructure_category; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeStructure_category" AS ENUM (
    'tuition',
    'transport',
    'food',
    'activities',
    'auxiliary'
);


ALTER TYPE public."enum_FeeStructure_category" OWNER TO ecd_user;

--
-- Name: enum_FeeStructure_frequency; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeStructure_frequency" AS ENUM (
    'monthly',
    'term',
    'one-time'
);


ALTER TYPE public."enum_FeeStructure_frequency" OWNER TO ecd_user;

--
-- Name: enum_FeeStructure_month; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeStructure_month" AS ENUM (
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
    'all'
);


ALTER TYPE public."enum_FeeStructure_month" OWNER TO ecd_user;

--
-- Name: enum_FeeStructure_term; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeStructure_term" AS ENUM (
    'term1',
    'term2',
    'term3',
    'all'
);


ALTER TYPE public."enum_FeeStructure_term" OWNER TO ecd_user;

--
-- Name: enum_FeeStructure_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_FeeStructure_type" AS ENUM (
    'monthly',
    'term',
    'transport',
    'food',
    'activities',
    'auxiliary'
);


ALTER TYPE public."enum_FeeStructure_type" OWNER TO ecd_user;

--
-- Name: enum_Material_language; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Material_language" AS ENUM (
    'en',
    'sn',
    'nd'
);


ALTER TYPE public."enum_Material_language" OWNER TO ecd_user;

--
-- Name: enum_Material_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Material_status" AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public."enum_Material_status" OWNER TO ecd_user;

--
-- Name: enum_Material_subject; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Material_subject" AS ENUM (
    'math',
    'language',
    'science',
    'art',
    'cultural'
);


ALTER TYPE public."enum_Material_subject" OWNER TO ecd_user;

--
-- Name: enum_Material_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Material_type" AS ENUM (
    'worksheet',
    'activity',
    'assessment',
    'story'
);


ALTER TYPE public."enum_Material_type" OWNER TO ecd_user;

--
-- Name: enum_Materials_language; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Materials_language" AS ENUM (
    'en',
    'sn',
    'nd'
);


ALTER TYPE public."enum_Materials_language" OWNER TO ecd_user;

--
-- Name: enum_Materials_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Materials_status" AS ENUM (
    'draft',
    'published'
);


ALTER TYPE public."enum_Materials_status" OWNER TO ecd_user;

--
-- Name: enum_Materials_subject; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Materials_subject" AS ENUM (
    'math',
    'language',
    'science',
    'art',
    'cultural'
);


ALTER TYPE public."enum_Materials_subject" OWNER TO ecd_user;

--
-- Name: enum_Materials_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Materials_type" AS ENUM (
    'worksheet',
    'activity',
    'assessment',
    'story'
);


ALTER TYPE public."enum_Materials_type" OWNER TO ecd_user;

--
-- Name: enum_Message_message_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Message_message_type" AS ENUM (
    'general',
    'progress_update',
    'behavior_note',
    'achievement',
    'concern'
);


ALTER TYPE public."enum_Message_message_type" OWNER TO ecd_user;

--
-- Name: enum_Message_priority; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Message_priority" AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);


ALTER TYPE public."enum_Message_priority" OWNER TO ecd_user;

--
-- Name: enum_OptionalService_category; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_OptionalService_category" AS ENUM (
    'food',
    'transport',
    'uniform',
    'amenity'
);


ALTER TYPE public."enum_OptionalService_category" OWNER TO ecd_user;

--
-- Name: enum_OptionalService_term; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_OptionalService_term" AS ENUM (
    'term1',
    'term2',
    'term3'
);


ALTER TYPE public."enum_OptionalService_term" OWNER TO ecd_user;

--
-- Name: enum_OptionalServices_category; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_OptionalServices_category" AS ENUM (
    'food',
    'transport',
    'uniform',
    'amenity'
);


ALTER TYPE public."enum_OptionalServices_category" OWNER TO ecd_user;

--
-- Name: enum_OptionalServices_term; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_OptionalServices_term" AS ENUM (
    'term1',
    'term2',
    'term3'
);


ALTER TYPE public."enum_OptionalServices_term" OWNER TO ecd_user;

--
-- Name: enum_Payment_payment_method; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Payment_payment_method" AS ENUM (
    'cash',
    'bank_transfer',
    'mobile_money'
);


ALTER TYPE public."enum_Payment_payment_method" OWNER TO ecd_user;

--
-- Name: enum_Payment_payment_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Payment_payment_type" AS ENUM (
    'tuition',
    'service'
);


ALTER TYPE public."enum_Payment_payment_type" OWNER TO ecd_user;

--
-- Name: enum_Payments_paymentMethod; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Payments_paymentMethod" AS ENUM (
    'cash',
    'bank_transfer',
    'mobile_money',
    'check'
);


ALTER TYPE public."enum_Payments_paymentMethod" OWNER TO ecd_user;

--
-- Name: enum_Progress_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Progress_status" AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'overdue'
);


ALTER TYPE public."enum_Progress_status" OWNER TO ecd_user;

--
-- Name: enum_School_subscription_plan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_School_subscription_plan" AS ENUM (
    'free',
    'basic',
    'premium',
    'inactive',
    'starter',
    'professional',
    'enterprise'
);


ALTER TYPE public."enum_School_subscription_plan" OWNER TO ecd_user;

--
-- Name: enum_School_subscription_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_School_subscription_status" AS ENUM (
    'active',
    'cancelled',
    'expired',
    'grace_period',
    'payment_failed'
);


ALTER TYPE public."enum_School_subscription_status" OWNER TO ecd_user;

--
-- Name: enum_Schools_subscriptionPlan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Schools_subscriptionPlan" AS ENUM (
    'free',
    'basic',
    'premium'
);


ALTER TYPE public."enum_Schools_subscriptionPlan" OWNER TO ecd_user;

--
-- Name: enum_Schools_subscriptionStatus; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Schools_subscriptionStatus" AS ENUM (
    'active',
    'cancelled',
    'expired'
);


ALTER TYPE public."enum_Schools_subscriptionStatus" OWNER TO ecd_user;

--
-- Name: enum_StudentAssignment_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentAssignment_status" AS ENUM (
    'assigned',
    'in_progress',
    'submitted',
    'completed',
    'graded'
);


ALTER TYPE public."enum_StudentAssignment_status" OWNER TO ecd_user;

--
-- Name: enum_StudentFeeAssignment_payment_plan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFeeAssignment_payment_plan" AS ENUM (
    'monthly',
    'term'
);


ALTER TYPE public."enum_StudentFeeAssignment_payment_plan" OWNER TO ecd_user;

--
-- Name: enum_StudentFeeAssignment_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFeeAssignment_status" AS ENUM (
    'pending',
    'partial',
    'paid'
);


ALTER TYPE public."enum_StudentFeeAssignment_status" OWNER TO ecd_user;

--
-- Name: enum_StudentFeeAssignments_paymentPlan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFeeAssignments_paymentPlan" AS ENUM (
    'monthly',
    'term'
);


ALTER TYPE public."enum_StudentFeeAssignments_paymentPlan" OWNER TO ecd_user;

--
-- Name: enum_StudentFeeAssignments_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFeeAssignments_status" AS ENUM (
    'pending',
    'partial',
    'paid'
);


ALTER TYPE public."enum_StudentFeeAssignments_status" OWNER TO ecd_user;

--
-- Name: enum_StudentFee_month; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFee_month" AS ENUM (
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
);


ALTER TYPE public."enum_StudentFee_month" OWNER TO ecd_user;

--
-- Name: enum_StudentFee_payment_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFee_payment_type" AS ENUM (
    'monthly',
    'term'
);


ALTER TYPE public."enum_StudentFee_payment_type" OWNER TO ecd_user;

--
-- Name: enum_StudentFee_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFee_status" AS ENUM (
    'not_paid',
    'partially_paid',
    'fully_paid'
);


ALTER TYPE public."enum_StudentFee_status" OWNER TO ecd_user;

--
-- Name: enum_StudentFee_term; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentFee_term" AS ENUM (
    'term1',
    'term2',
    'term3'
);


ALTER TYPE public."enum_StudentFee_term" OWNER TO ecd_user;

--
-- Name: enum_StudentServiceSelection_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_StudentServiceSelection_status" AS ENUM (
    'pending',
    'paid',
    'opted_out'
);


ALTER TYPE public."enum_StudentServiceSelection_status" OWNER TO ecd_user;

--
-- Name: enum_Student_language; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Student_language" AS ENUM (
    'en',
    'sn',
    'nd'
);


ALTER TYPE public."enum_Student_language" OWNER TO ecd_user;

--
-- Name: enum_SubscriptionPayment_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_SubscriptionPayment_status" AS ENUM (
    'pending',
    'succeeded',
    'failed',
    'cancelled'
);


ALTER TYPE public."enum_SubscriptionPayment_status" OWNER TO ecd_user;

--
-- Name: enum_SubscriptionPlan_interval; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_SubscriptionPlan_interval" AS ENUM (
    'month',
    'year'
);


ALTER TYPE public."enum_SubscriptionPlan_interval" OWNER TO ecd_user;

--
-- Name: enum_SubscriptionPlans_interval; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_SubscriptionPlans_interval" AS ENUM (
    'month',
    'year'
);


ALTER TYPE public."enum_SubscriptionPlans_interval" OWNER TO ecd_user;

--
-- Name: enum_Subscription_plan_name; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Subscription_plan_name" AS ENUM (
    'free',
    'basic',
    'premium',
    'enterprise'
);


ALTER TYPE public."enum_Subscription_plan_name" OWNER TO ecd_user;

--
-- Name: enum_Subscription_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Subscription_status" AS ENUM (
    'active',
    'cancelled',
    'expired',
    'past_due',
    'unpaid'
);


ALTER TYPE public."enum_Subscription_status" OWNER TO ecd_user;

--
-- Name: enum_SystemNotification_target_role; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_SystemNotification_target_role" AS ENUM (
    'system_admin',
    'delegated_admin',
    'all'
);


ALTER TYPE public."enum_SystemNotification_target_role" OWNER TO ecd_user;

--
-- Name: enum_SystemNotification_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_SystemNotification_type" AS ENUM (
    'info',
    'warning',
    'error',
    'success'
);


ALTER TYPE public."enum_SystemNotification_type" OWNER TO ecd_user;

--
-- Name: enum_Template_category; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Template_category" AS ENUM (
    'math',
    'language',
    'art',
    'science',
    'cultural',
    'puzzle'
);


ALTER TYPE public."enum_Template_category" OWNER TO ecd_user;

--
-- Name: enum_Template_difficulty; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Template_difficulty" AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public."enum_Template_difficulty" OWNER TO ecd_user;

--
-- Name: enum_Templates_category; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Templates_category" AS ENUM (
    'math',
    'language',
    'art',
    'science',
    'cultural'
);


ALTER TYPE public."enum_Templates_category" OWNER TO ecd_user;

--
-- Name: enum_Templates_difficulty; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Templates_difficulty" AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE public."enum_Templates_difficulty" OWNER TO ecd_user;

--
-- Name: enum_User_language; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_User_language" AS ENUM (
    'en',
    'sn',
    'nd'
);


ALTER TYPE public."enum_User_language" OWNER TO ecd_user;

--
-- Name: enum_User_role; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_User_role" AS ENUM (
    'teacher',
    'school_admin',
    'parent',
    'system_admin',
    'finance'
);


ALTER TYPE public."enum_User_role" OWNER TO ecd_user;

--
-- Name: enum_User_subscription_plan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_User_subscription_plan" AS ENUM (
    'free',
    'teacher',
    'school',
    'premium'
);


ALTER TYPE public."enum_User_subscription_plan" OWNER TO ecd_user;

--
-- Name: enum_User_subscription_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_User_subscription_status" AS ENUM (
    'active',
    'cancelled',
    'expired'
);


ALTER TYPE public."enum_User_subscription_status" OWNER TO ecd_user;

--
-- Name: enum_Users_language; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Users_language" AS ENUM (
    'en',
    'sn',
    'nd'
);


ALTER TYPE public."enum_Users_language" OWNER TO ecd_user;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'teacher',
    'school_admin',
    'parent',
    'system_admin'
);


ALTER TYPE public."enum_Users_role" OWNER TO ecd_user;

--
-- Name: enum_Users_subscriptionPlan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Users_subscriptionPlan" AS ENUM (
    'free',
    'teacher',
    'school',
    'premium'
);


ALTER TYPE public."enum_Users_subscriptionPlan" OWNER TO ecd_user;

--
-- Name: enum_Users_subscriptionStatus; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public."enum_Users_subscriptionStatus" AS ENUM (
    'active',
    'cancelled',
    'expired'
);


ALTER TYPE public."enum_Users_subscriptionStatus" OWNER TO ecd_user;

--
-- Name: enum_financial_reports_report_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.enum_financial_reports_report_type AS ENUM (
    'revenue',
    'expenses',
    'payment_trends',
    'fee_collection',
    'outstanding_fees',
    'monthly_summary',
    'quarterly_summary',
    'yearly_summary'
);


ALTER TYPE public.enum_financial_reports_report_type OWNER TO ecd_user;

--
-- Name: enum_receipt_payment_method; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.enum_receipt_payment_method AS ENUM (
    'cash',
    'bank_transfer',
    'mobile_money',
    'check',
    'other'
);


ALTER TYPE public.enum_receipt_payment_method OWNER TO ecd_user;

--
-- Name: enum_receipts_payment_method; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.enum_receipts_payment_method AS ENUM (
    'cash',
    'bank_transfer',
    'mobile_money',
    'check',
    'other'
);


ALTER TYPE public.enum_receipts_payment_method OWNER TO ecd_user;

--
-- Name: enum_signatures_signature_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.enum_signatures_signature_type AS ENUM (
    'teacher',
    'principal',
    'admin'
);


ALTER TYPE public.enum_signatures_signature_type OWNER TO ecd_user;

--
-- Name: enum_student_service_preferences_tuition_type; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.enum_student_service_preferences_tuition_type AS ENUM (
    'monthly',
    'term'
);


ALTER TYPE public.enum_student_service_preferences_tuition_type OWNER TO ecd_user;

--
-- Name: language_code; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.language_code AS ENUM (
    'en',
    'sn',
    'nd'
);


ALTER TYPE public.language_code OWNER TO ecd_user;

--
-- Name: progress_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.progress_status AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'overdue'
);


ALTER TYPE public.progress_status OWNER TO ecd_user;

--
-- Name: subscription_plan; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.subscription_plan AS ENUM (
    'free',
    'teacher',
    'school',
    'premium'
);


ALTER TYPE public.subscription_plan OWNER TO ecd_user;

--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.subscription_status AS ENUM (
    'active',
    'cancelled',
    'expired',
    'trial'
);


ALTER TYPE public.subscription_status OWNER TO ecd_user;

--
-- Name: template_category; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.template_category AS ENUM (
    'math',
    'language',
    'art',
    'science',
    'cultural'
);


ALTER TYPE public.template_category OWNER TO ecd_user;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: ecd_user
--

CREATE TYPE public.user_role AS ENUM (
    'teacher',
    'school_admin',
    'parent',
    'system_admin'
);


ALTER TYPE public.user_role OWNER TO ecd_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Assignment" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    instructions text,
    due_date timestamp with time zone NOT NULL,
    teacher_id uuid NOT NULL,
    class_id uuid NOT NULL,
    school_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    type public."enum_Assignment_type" DEFAULT 'material'::public."enum_Assignment_type",
    materials json DEFAULT '[]'::json,
    custom_tasks json DEFAULT '[]'::json
);


ALTER TABLE public."Assignment" OWNER TO ecd_user;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."AuditLog" (
    id uuid NOT NULL,
    user_id uuid,
    action character varying(255) NOT NULL,
    resource character varying(255) NOT NULL,
    resource_id character varying(255),
    details jsonb,
    ip_address character varying(255),
    user_agent text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO ecd_user;

--
-- Name: Class; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Class" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    grade character varying(255),
    description text,
    school_id uuid NOT NULL,
    teacher_id uuid,
    max_students integer DEFAULT 30,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Class" OWNER TO ecd_user;

--
-- Name: FeeConfiguration; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."FeeConfiguration" (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    fee_type public."enum_FeeConfiguration_fee_type" DEFAULT 'flexible'::public."enum_FeeConfiguration_fee_type" NOT NULL,
    monthly_amount numeric(10,2),
    term_amount numeric(10,2),
    term public."enum_FeeConfiguration_term" NOT NULL,
    year integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."FeeConfiguration" OWNER TO ecd_user;

--
-- Name: FeePayment; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."FeePayment" (
    id uuid NOT NULL,
    student_fee_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method public."enum_FeePayment_payment_method" NOT NULL,
    receipt_number character varying(255),
    payment_date timestamp with time zone NOT NULL,
    recorded_by uuid NOT NULL,
    notes text,
    is_verified boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    academic_year character varying(255) NOT NULL,
    school_id uuid NOT NULL
);


ALTER TABLE public."FeePayment" OWNER TO ecd_user;

--
-- Name: FeeStructure; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."FeeStructure" (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    type public."enum_FeeStructure_type" NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    academic_year character varying(255) NOT NULL,
    term public."enum_FeeStructure_term",
    month public."enum_FeeStructure_month",
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    category public."enum_FeeStructure_category" DEFAULT 'tuition'::public."enum_FeeStructure_category" NOT NULL,
    frequency public."enum_FeeStructure_frequency" DEFAULT 'monthly'::public."enum_FeeStructure_frequency" NOT NULL,
    due_date timestamp with time zone
);


ALTER TABLE public."FeeStructure" OWNER TO ecd_user;

--
-- Name: Material; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Material" (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    type public."enum_Material_type" DEFAULT 'worksheet'::public."enum_Material_type" NOT NULL,
    subject public."enum_Material_subject" DEFAULT 'math'::public."enum_Material_subject" NOT NULL,
    language public."enum_Material_language" DEFAULT 'en'::public."enum_Material_language" NOT NULL,
    age_group character varying(255) DEFAULT '3-5'::character varying NOT NULL,
    status public."enum_Material_status" DEFAULT 'draft'::public."enum_Material_status" NOT NULL,
    elements jsonb DEFAULT '[]'::jsonb NOT NULL,
    creator_id uuid NOT NULL,
    published_at timestamp with time zone,
    views integer DEFAULT 0,
    downloads integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Material" OWNER TO ecd_user;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Message" (
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    student_id uuid,
    subject character varying(255) NOT NULL,
    content text NOT NULL,
    message_type public."enum_Message_message_type" DEFAULT 'general'::public."enum_Message_message_type",
    priority public."enum_Message_priority" DEFAULT 'normal'::public."enum_Message_priority",
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    is_archived boolean DEFAULT false,
    attachments json DEFAULT '[]'::json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Message" OWNER TO ecd_user;

--
-- Name: OptionalService; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."OptionalService" (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    category public."enum_OptionalService_category" NOT NULL,
    amount numeric(10,2) NOT NULL,
    description text,
    term public."enum_OptionalService_term" NOT NULL,
    year integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."OptionalService" OWNER TO ecd_user;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Payment" (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    school_id uuid NOT NULL,
    payment_type public."enum_Payment_payment_type" NOT NULL,
    reference_id uuid,
    amount numeric(10,2) NOT NULL,
    payment_method public."enum_Payment_payment_method" NOT NULL,
    description character varying(255),
    receipt_number character varying(255),
    recorded_by uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    fee_assignment_id uuid
);


ALTER TABLE public."Payment" OWNER TO ecd_user;

--
-- Name: Progress; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Progress" (
    id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status public."enum_Progress_status" DEFAULT 'not_started'::public."enum_Progress_status",
    completion_percentage integer DEFAULT 0,
    completed_at timestamp with time zone,
    time_spent integer DEFAULT 0,
    attempts integer DEFAULT 0,
    interaction_data jsonb DEFAULT '{}'::jsonb,
    answers jsonb DEFAULT '{}'::jsonb,
    auto_feedback jsonb,
    teacher_comments text,
    parent_viewed boolean DEFAULT false,
    last_accessed timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Progress" OWNER TO ecd_user;

--
-- Name: School; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."School" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    contact_email character varying(255),
    contact_phone character varying(255),
    subscription_plan public."enum_School_subscription_plan" DEFAULT 'free'::public."enum_School_subscription_plan",
    subscription_status public."enum_School_subscription_status" DEFAULT 'active'::public."enum_School_subscription_status",
    max_teachers integer DEFAULT 0,
    max_students integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    default_parent_password character varying(255) DEFAULT 'parent123'::character varying,
    logo_url character varying(255),
    primary_color character varying(255) DEFAULT '#2563eb'::character varying,
    secondary_color character varying(255) DEFAULT '#1d4ed8'::character varying,
    accent_color character varying(255) DEFAULT '#fbbf24'::character varying,
    custom_font character varying(255) DEFAULT 'Inter'::character varying,
    custom_domain character varying(255),
    branding_enabled boolean DEFAULT true,
    custom_css text,
    favicon_url character varying(255),
    school_motto character varying(255),
    custom_header_text character varying(255),
    subscription_expires_at timestamp with time zone,
    last_payment_attempt timestamp with time zone,
    payment_failure_count integer DEFAULT 0,
    trial_used boolean DEFAULT false
);


ALTER TABLE public."School" OWNER TO ecd_user;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO ecd_user;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Student" (
    id uuid NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    age integer,
    grade character varying(255),
    parent_name character varying(255),
    parent_email character varying(255),
    parent_phone character varying(255),
    parent_id uuid,
    school_id uuid NOT NULL,
    class_id uuid,
    teacher_id uuid,
    language public."enum_Student_language" DEFAULT 'en'::public."enum_Student_language",
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Student" OWNER TO ecd_user;

--
-- Name: StudentAssignment; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."StudentAssignment" (
    id uuid NOT NULL,
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    status public."enum_StudentAssignment_status" DEFAULT 'assigned'::public."enum_StudentAssignment_status",
    submission_text text,
    submitted_at timestamp with time zone,
    grade integer,
    feedback text,
    graded_at timestamp with time zone,
    graded_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    submissions json DEFAULT '{}'::json,
    completed_at timestamp with time zone,
    parent_viewed boolean DEFAULT false
);


ALTER TABLE public."StudentAssignment" OWNER TO ecd_user;

--
-- Name: StudentFee; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."StudentFee" (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    fee_structure_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    paid_amount numeric(10,2) DEFAULT 0,
    due_date timestamp with time zone,
    status public."enum_StudentFee_status" DEFAULT 'not_paid'::public."enum_StudentFee_status",
    payment_type public."enum_StudentFee_payment_type",
    academic_year character varying(255) NOT NULL,
    term public."enum_StudentFee_term",
    month public."enum_StudentFee_month",
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    school_id uuid NOT NULL
);


ALTER TABLE public."StudentFee" OWNER TO ecd_user;

--
-- Name: StudentFeeAssignment; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."StudentFeeAssignment" (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    fee_configuration_id uuid NOT NULL,
    payment_plan public."enum_StudentFeeAssignment_payment_plan" NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    paid_amount numeric(10,2) DEFAULT 0,
    balance_amount numeric(10,2) NOT NULL,
    status public."enum_StudentFeeAssignment_status" DEFAULT 'pending'::public."enum_StudentFeeAssignment_status",
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."StudentFeeAssignment" OWNER TO ecd_user;

--
-- Name: StudentServiceSelection; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."StudentServiceSelection" (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    optional_service_id uuid NOT NULL,
    is_selected boolean DEFAULT false,
    paid_amount numeric(10,2) DEFAULT 0,
    status public."enum_StudentServiceSelection_status" DEFAULT 'pending'::public."enum_StudentServiceSelection_status",
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."StudentServiceSelection" OWNER TO ecd_user;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Subscription" (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    plan_id character varying(255) NOT NULL,
    plan_name public."enum_Subscription_plan_name" DEFAULT 'free'::public."enum_Subscription_plan_name" NOT NULL,
    status public."enum_Subscription_status" DEFAULT 'active'::public."enum_Subscription_status" NOT NULL,
    stripe_customer_id character varying(255),
    stripe_subscription_id character varying(255),
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone,
    cancel_at_period_end boolean DEFAULT false,
    cancelled_at timestamp with time zone,
    metadata json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO ecd_user;

--
-- Name: SubscriptionPayment; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."SubscriptionPayment" (
    id uuid NOT NULL,
    subscription_id uuid NOT NULL,
    school_id uuid NOT NULL,
    stripe_payment_intent_id character varying(255),
    stripe_invoice_id character varying(255),
    amount numeric(10,2) NOT NULL,
    currency character varying(255) DEFAULT 'usd'::character varying,
    status public."enum_SubscriptionPayment_status" DEFAULT 'pending'::public."enum_SubscriptionPayment_status" NOT NULL,
    payment_method character varying(255),
    description character varying(255),
    period_start timestamp with time zone,
    period_end timestamp with time zone,
    metadata json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."SubscriptionPayment" OWNER TO ecd_user;

--
-- Name: SubscriptionPlan; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."SubscriptionPlan" (
    id integer NOT NULL,
    plan_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    currency character varying(255) DEFAULT 'usd'::character varying NOT NULL,
    "interval" public."enum_SubscriptionPlan_interval" DEFAULT 'month'::public."enum_SubscriptionPlan_interval" NOT NULL,
    trial_days integer DEFAULT 0 NOT NULL,
    max_students integer DEFAULT '-1'::integer NOT NULL,
    max_teachers integer DEFAULT '-1'::integer NOT NULL,
    max_classes integer DEFAULT '-1'::integer NOT NULL,
    materials boolean DEFAULT true NOT NULL,
    templates boolean DEFAULT true NOT NULL,
    assignments boolean DEFAULT true NOT NULL,
    basic_analytics boolean DEFAULT true NOT NULL,
    finance_module boolean DEFAULT false NOT NULL,
    advanced_analytics boolean DEFAULT false NOT NULL,
    priority_support boolean DEFAULT false NOT NULL,
    custom_branding boolean DEFAULT false NOT NULL,
    api_access boolean DEFAULT false NOT NULL,
    white_labeling boolean DEFAULT false NOT NULL,
    storage_g_b integer DEFAULT 1 NOT NULL,
    monthly_exports integer DEFAULT 5 NOT NULL,
    custom_templates integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."SubscriptionPlan" OWNER TO ecd_user;

--
-- Name: SubscriptionPlan_id_seq; Type: SEQUENCE; Schema: public; Owner: ecd_user
--

CREATE SEQUENCE public."SubscriptionPlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SubscriptionPlan_id_seq" OWNER TO ecd_user;

--
-- Name: SubscriptionPlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecd_user
--

ALTER SEQUENCE public."SubscriptionPlan_id_seq" OWNED BY public."SubscriptionPlan".id;


--
-- Name: SubscriptionPlans; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."SubscriptionPlans" (
    id integer NOT NULL,
    "planId" character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    currency character varying(255) DEFAULT 'usd'::character varying NOT NULL,
    "interval" character varying(255) DEFAULT 'month'::character varying NOT NULL,
    "trialDays" integer DEFAULT 0 NOT NULL,
    "maxStudents" integer DEFAULT '-1'::integer NOT NULL,
    "maxTeachers" integer DEFAULT '-1'::integer NOT NULL,
    "maxClasses" integer DEFAULT '-1'::integer NOT NULL,
    materials boolean DEFAULT true NOT NULL,
    templates boolean DEFAULT true NOT NULL,
    assignments boolean DEFAULT true NOT NULL,
    "basicAnalytics" boolean DEFAULT true NOT NULL,
    "financeModule" boolean DEFAULT false NOT NULL,
    "advancedAnalytics" boolean DEFAULT false NOT NULL,
    "prioritySupport" boolean DEFAULT false NOT NULL,
    "customBranding" boolean DEFAULT false NOT NULL,
    "apiAccess" boolean DEFAULT false NOT NULL,
    "whiteLabeling" boolean DEFAULT false NOT NULL,
    "storageGB" integer DEFAULT 1 NOT NULL,
    "monthlyExports" integer DEFAULT 5 NOT NULL,
    "customTemplates" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."SubscriptionPlans" OWNER TO ecd_user;

--
-- Name: SubscriptionPlans_id_seq; Type: SEQUENCE; Schema: public; Owner: ecd_user
--

CREATE SEQUENCE public."SubscriptionPlans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SubscriptionPlans_id_seq" OWNER TO ecd_user;

--
-- Name: SubscriptionPlans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecd_user
--

ALTER SEQUENCE public."SubscriptionPlans_id_seq" OWNED BY public."SubscriptionPlans".id;


--
-- Name: SystemNotification; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."SystemNotification" (
    id uuid NOT NULL,
    type public."enum_SystemNotification_type" NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false,
    target_role public."enum_SystemNotification_target_role" DEFAULT 'system_admin'::public."enum_SystemNotification_target_role",
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id uuid
);


ALTER TABLE public."SystemNotification" OWNER TO ecd_user;

--
-- Name: Template; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."Template" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category public."enum_Template_category" NOT NULL,
    subcategory character varying(255),
    difficulty public."enum_Template_difficulty" DEFAULT 'beginner'::public."enum_Template_difficulty",
    age_group_min integer DEFAULT 3,
    age_group_max integer DEFAULT 6,
    cultural_tags character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    languages character varying(255)[] DEFAULT ARRAY['en'::character varying(255)],
    content jsonb NOT NULL,
    thumbnail character varying(255),
    preview_images character varying(255)[] DEFAULT (ARRAY[]::character varying[])::character varying(255)[],
    creator_id uuid,
    downloads integer DEFAULT 0,
    rating numeric(2,1) DEFAULT 0,
    review_count integer DEFAULT 0,
    is_premium boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Template" OWNER TO ecd_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public."User" (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_User_role" DEFAULT 'teacher'::public."enum_User_role" NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    phone_number character varying(255),
    language public."enum_User_language" DEFAULT 'en'::public."enum_User_language",
    school_id uuid,
    subscription_plan public."enum_User_subscription_plan" DEFAULT 'free'::public."enum_User_subscription_plan",
    subscription_status public."enum_User_subscription_status" DEFAULT 'active'::public."enum_User_subscription_status",
    subscription_expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO ecd_user;

--
-- Name: financial_reports; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public.financial_reports (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    report_type public.enum_financial_reports_report_type NOT NULL,
    report_name character varying(255) NOT NULL,
    date_range jsonb NOT NULL,
    report_data jsonb NOT NULL,
    export_data jsonb,
    generated_by uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.financial_reports OWNER TO ecd_user;

--
-- Name: COLUMN financial_reports.date_range; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.financial_reports.date_range IS 'Start and end dates for the report period';


--
-- Name: COLUMN financial_reports.report_data; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.financial_reports.report_data IS 'Generated report data including charts and analytics';


--
-- Name: COLUMN financial_reports.export_data; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.financial_reports.export_data IS 'Data formatted for PDF/Excel export';


--
-- Name: receipt; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public.receipt (
    id uuid NOT NULL,
    receipt_number character varying(255) NOT NULL,
    payment_id uuid NOT NULL,
    school_id uuid NOT NULL,
    student_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_method public.enum_receipt_payment_method NOT NULL,
    payment_date timestamp with time zone NOT NULL,
    academic_year character varying(255) NOT NULL,
    term character varying(255),
    month character varying(255),
    fee_structure_name character varying(255) NOT NULL,
    student_name character varying(255) NOT NULL,
    parent_name character varying(255),
    class_name character varying(255),
    recorded_by uuid NOT NULL,
    recorded_by_name character varying(255) NOT NULL,
    notes text,
    is_printed boolean DEFAULT false,
    printed_at timestamp with time zone,
    printed_by uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.receipt OWNER TO ecd_user;

--
-- Name: signatures; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public.signatures (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    school_id uuid NOT NULL,
    signature_data text NOT NULL,
    signature_type public.enum_signatures_signature_type DEFAULT 'teacher'::public.enum_signatures_signature_type NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.signatures OWNER TO ecd_user;

--
-- Name: COLUMN signatures.signature_data; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.signatures.signature_data IS 'Base64 encoded signature image data';


--
-- Name: student_service_preferences; Type: TABLE; Schema: public; Owner: ecd_user
--

CREATE TABLE public.student_service_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    school_id uuid NOT NULL,
    tuition_type character varying(10),
    transport boolean DEFAULT false,
    food boolean DEFAULT false,
    activities boolean DEFAULT false,
    auxiliary boolean DEFAULT false,
    academic_year character varying(255) NOT NULL,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT student_service_preferences_tuition_type_check CHECK (((tuition_type)::text = ANY (ARRAY[('monthly'::character varying)::text, ('term'::character varying)::text])))
);


ALTER TABLE public.student_service_preferences OWNER TO ecd_user;

--
-- Name: COLUMN student_service_preferences.tuition_type; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.student_service_preferences.tuition_type IS 'Student''s choice of tuition type';


--
-- Name: COLUMN student_service_preferences.transport; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.student_service_preferences.transport IS 'Whether student opted for transport service';


--
-- Name: COLUMN student_service_preferences.food; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.student_service_preferences.food IS 'Whether student opted for food service';


--
-- Name: COLUMN student_service_preferences.activities; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.student_service_preferences.activities IS 'Whether student opted for activities service';


--
-- Name: COLUMN student_service_preferences.auxiliary; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.student_service_preferences.auxiliary IS 'Whether student opted for auxiliary service';


--
-- Name: COLUMN student_service_preferences.notes; Type: COMMENT; Schema: public; Owner: ecd_user
--

COMMENT ON COLUMN public.student_service_preferences.notes IS 'Additional notes about service preferences';


--
-- Name: SubscriptionPlan id; Type: DEFAULT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlan" ALTER COLUMN id SET DEFAULT nextval('public."SubscriptionPlan_id_seq"'::regclass);


--
-- Name: SubscriptionPlans id; Type: DEFAULT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans" ALTER COLUMN id SET DEFAULT nextval('public."SubscriptionPlans_id_seq"'::regclass);


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Assignment" (id, title, description, instructions, due_date, teacher_id, class_id, school_id, is_active, created_at, updated_at, type, materials, custom_tasks) FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."AuditLog" (id, user_id, action, resource, resource_id, details, ip_address, user_agent, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Class; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Class" (id, name, grade, description, school_id, teacher_id, max_students, is_active, created_at, updated_at) FROM stdin;
d78491c0-182b-4ded-9b69-ea0d68837e7d	ECD A Tulip	ECD	Class 1 of ECD Tulip	2f921318-8f76-4c43-92e9-b3e7099a31b9	78b8df89-8523-4cdd-9899-d5bb760f9896	30	t	2025-08-01 08:37:05.67+00	2025-08-01 08:37:05.67+00
\.


--
-- Data for Name: FeeConfiguration; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."FeeConfiguration" (id, school_id, fee_type, monthly_amount, term_amount, term, year, is_active, created_at, updated_at) FROM stdin;
d08ecae5-4e6a-4365-b4f5-66138f11cf82	2f921318-8f76-4c43-92e9-b3e7099a31b9	monthly	90.00	\N	term1	2025	f	2025-08-14 12:59:21.783+00	2025-08-14 14:27:59.275+00
63fe6785-280c-4430-b908-28e853f4a595	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term1	2025	f	2025-08-14 12:59:36.487+00	2025-08-14 14:27:59.275+00
c0f6452c-a788-45b3-a499-575775c78284	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term2	2025	f	2025-08-14 13:11:14.037+00	2025-08-14 14:27:59.275+00
4fb2759e-ea35-47b6-9c16-6eb39389c987	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term3	2025	f	2025-08-14 13:11:18.15+00	2025-08-14 14:27:59.275+00
88b6a060-c42f-4744-9c51-c0f727ef96de	2f921318-8f76-4c43-92e9-b3e7099a31b9	monthly	90.00	\N	term3	2025	f	2025-08-14 13:11:28.337+00	2025-08-14 14:27:59.275+00
e2a29f1f-3f11-4062-ad04-27e3abe1c447	2f921318-8f76-4c43-92e9-b3e7099a31b9	monthly	90.00	\N	term2	2025	f	2025-08-14 13:11:32.95+00	2025-08-14 14:27:59.275+00
8c1de872-7271-43bc-8dc4-f046e25d3636	2f921318-8f76-4c43-92e9-b3e7099a31b9	monthly	90.00	\N	term1	2025	f	2025-08-14 13:11:37.72+00	2025-08-14 14:27:59.275+00
89fe1bff-e9d9-42e7-804a-c90b80176212	2f921318-8f76-4c43-92e9-b3e7099a31b9	monthly	90.00	\N	term2	2025	f	2025-08-14 13:30:33.07+00	2025-08-14 14:27:59.275+00
4bf179ed-7d9a-4636-b7dd-4a4a0f64860d	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term2	2025	f	2025-08-14 13:30:56.543+00	2025-08-14 14:27:59.275+00
a1d92600-84e4-4aeb-ac3f-768b26d6d35d	2f921318-8f76-4c43-92e9-b3e7099a31b9	flexible	90.00	255.00	term2	2025	t	2025-08-14 14:27:59.307+00	2025-08-14 14:27:59.307+00
8537b8d2-886f-48d9-80ac-5e155f535072	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term1	2025	f	2025-08-14 13:47:25.974+00	2025-08-14 14:27:59.275+00
e4bc63bf-40ef-4df5-854d-67894e312cb0	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term2	2025	f	2025-08-14 13:47:30.049+00	2025-08-14 14:27:59.275+00
baf6dd0b-a799-43bb-955a-adf1bfed1c84	2f921318-8f76-4c43-92e9-b3e7099a31b9	term	\N	255.00	term3	2025	f	2025-08-14 13:47:34.66+00	2025-08-14 14:27:59.275+00
\.


--
-- Data for Name: FeePayment; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."FeePayment" (id, student_fee_id, amount, payment_method, receipt_number, payment_date, recorded_by, notes, is_verified, created_at, updated_at, academic_year, school_id) FROM stdin;
\.


--
-- Data for Name: FeeStructure; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."FeeStructure" (id, school_id, name, type, amount, description, is_active, academic_year, term, month, created_at, updated_at, category, frequency, due_date) FROM stdin;
\.


--
-- Data for Name: Material; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Material" (id, title, description, type, subject, language, age_group, status, elements, creator_id, published_at, views, downloads, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Message" (id, sender_id, recipient_id, student_id, subject, content, message_type, priority, is_read, read_at, is_archived, attachments, created_at, updated_at) FROM stdin;
b0d312f4-7aba-4af0-9426-9ee0eca00610	78b8df89-8523-4cdd-9899-d5bb760f9896	48a9ddcc-b2af-4362-bad5-b27226d3a5ba	c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	Kaylee's Perfomance	Keep it up you child is working very hard	achievement	normal	t	2025-08-02 23:00:48.375+00	f	[]	2025-08-02 19:17:23.942+00	2025-08-02 23:00:48.376+00
665cb1b1-57e3-4a3f-a3a3-c5bd8be79f4f	78b8df89-8523-4cdd-9899-d5bb760f9896	48a9ddcc-b2af-4362-bad5-b27226d3a5ba	c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	Re: Re: Kaylee's Perfomance	let me know if she needs anything	general	normal	t	2025-08-04 17:20:32.362+00	f	[]	2025-08-04 16:41:22.17+00	2025-08-04 17:20:32.363+00
60ca8762-7c41-404f-8247-575c48f2e4f9	48a9ddcc-b2af-4362-bad5-b27226d3a5ba	78b8df89-8523-4cdd-9899-d5bb760f9896	c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	Re: Re: Re: Re: Kaylee's Perfomance	very encouraging to hear	general	normal	t	2025-08-04 17:38:50.344+00	f	[]	2025-08-04 17:19:37.44+00	2025-08-04 17:38:50.347+00
0a8607cf-94e6-41c3-a0ac-75a69f1d9364	48a9ddcc-b2af-4362-bad5-b27226d3a5ba	78b8df89-8523-4cdd-9899-d5bb760f9896	c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	Re: Re: Re: Kaylee's Perfomance	thank you so much	general	normal	t	2025-08-04 17:38:52.564+00	f	[]	2025-08-04 17:19:19.484+00	2025-08-04 17:38:52.565+00
e1848f47-8a06-4f26-9040-1a405458b7a9	78b8df89-8523-4cdd-9899-d5bb760f9896	48a9ddcc-b2af-4362-bad5-b27226d3a5ba	c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	Re: Kaylee's Perfomance	keep encouraging her	general	normal	t	2025-08-04 17:39:01.648+00	f	[]	2025-08-04 16:40:07.927+00	2025-08-04 17:39:01.649+00
\.


--
-- Data for Name: OptionalService; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."OptionalService" (id, school_id, name, category, amount, description, term, year, is_active, created_at, updated_at) FROM stdin;
845af4a6-2de6-410a-9306-0d2f3b7bf213	2f921318-8f76-4c43-92e9-b3e7099a31b9	School Transport	transport	40.00	\N	term1	2025	t	2025-08-14 13:00:11.167+00	2025-08-14 13:00:11.167+00
e31a75d3-1066-4612-a85c-550610a9f02a	2f921318-8f76-4c43-92e9-b3e7099a31b9	School Transport	transport	40.00	\N	term2	2025	t	2025-08-14 13:00:41.593+00	2025-08-14 13:00:41.593+00
0ccca5ea-ac3e-4e4e-91da-1f954cf675e7	2f921318-8f76-4c43-92e9-b3e7099a31b9	School Transport	transport	40.00	\N	term3	2025	t	2025-08-14 13:01:06.316+00	2025-08-14 13:01:06.316+00
3156eea8-61f5-46e1-a09b-1fd70f4a934a	2f921318-8f76-4c43-92e9-b3e7099a31b9	Groceries ECD A	food	30.00	\N	term1	2025	t	2025-08-14 13:01:33.682+00	2025-08-14 13:01:33.682+00
4a9e2a7a-b4f9-4745-9064-81e8558a0e3c	2f921318-8f76-4c43-92e9-b3e7099a31b9	Groceries Baby Class	food	40.00	\N	term1	2025	t	2025-08-14 13:01:56.347+00	2025-08-14 13:01:56.347+00
98bd279a-6078-45f1-af54-d977221abfed	2f921318-8f76-4c43-92e9-b3e7099a31b9	Groceries ECD B	food	30.00	\N	term1	2025	t	2025-08-14 13:02:10.273+00	2025-08-14 13:02:10.273+00
11ab56c4-d954-4075-98f1-23afef56c328	2f921318-8f76-4c43-92e9-b3e7099a31b9	Dress	uniform	30.00	\N	term1	2025	t	2025-08-14 13:06:08.05+00	2025-08-14 13:06:08.05+00
d7ddde84-b196-42f9-95c9-1c1338cc0c1a	2f921318-8f76-4c43-92e9-b3e7099a31b9	Sock	uniform	5.00	\N	term1	2025	t	2025-08-14 13:06:21.923+00	2025-08-14 13:06:21.923+00
8d94a6c6-6424-4a35-88c3-a9d44d1da34c	2f921318-8f76-4c43-92e9-b3e7099a31b9	Hat	uniform	10.00	\N	term1	2025	t	2025-08-14 13:06:35.742+00	2025-08-14 13:06:35.742+00
583f61f2-f39b-40f7-9cf0-1b312e92c875	2f921318-8f76-4c43-92e9-b3e7099a31b9	Jursey	uniform	25.00	\N	term1	2025	t	2025-08-14 13:06:48.99+00	2025-08-14 13:06:48.99+00
284df71f-6024-496f-9a26-23a55e8d944f	2f921318-8f76-4c43-92e9-b3e7099a31b9	School Trip	amenity	35.00	\N	term1	2025	t	2025-08-14 13:07:34.366+00	2025-08-14 13:07:34.366+00
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Payment" (id, student_id, school_id, payment_type, reference_id, amount, payment_method, description, receipt_number, recorded_by, created_at, updated_at, fee_assignment_id) FROM stdin;
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Progress" (id, assignment_id, student_id, status, completion_percentage, completed_at, time_spent, attempts, interaction_data, answers, auto_feedback, teacher_comments, parent_viewed, last_accessed, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: School; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."School" (id, name, address, contact_email, contact_phone, subscription_plan, subscription_status, max_teachers, max_students, is_active, created_at, updated_at, default_parent_password, logo_url, primary_color, secondary_color, accent_color, custom_font, custom_domain, branding_enabled, custom_css, favicon_url, school_motto, custom_header_text, subscription_expires_at, last_payment_attempt, payment_failure_count, trial_used) FROM stdin;
f04bfa37-cf95-4d9b-9eed-2c1c19f45df0	Pepermint Elementary School	123 West Road	admin@peppermint.com	12345678	starter	active	3	30	t	2025-08-11 11:39:45.341+00	2025-08-14 06:55:17.779+00	parent123	/uploads/branding/school-f04bfa37-cf95-4d9b-9eed-2c1c19f45df0-1754928335294_processed.webp	#2563eb	#1d4ed8	#fbbf24	Montserrat	\N	t	\N	\N	Educate 	Pepermint Elementary School	2025-09-14 06:55:17.772+00	\N	0	f
2f921318-8f76-4c43-92e9-b3e7099a31b9	Kiddy Kamp Junior School	Kiddy Kamp Junior School	kiddykamp@gmail.com	078654321	free	active	5	100	t	2025-07-31 21:37:18.214+00	2025-08-11 09:30:18.3+00	parent123	/uploads/branding/school-2f921318-8f76-4c43-92e9-b3e7099a31b9-1754396646229_processed.webp	#2563eb	#1d4ed8	#fbbf24	Inter	\N	t	\N	\N	Excellence in Education	Kiddy Kamp Junior School	2025-09-10 09:30:18.295+00	\N	0	f
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250731000001-update-materials-table.js
20250131000001-create-subscription-tables.js
20250101000000-create-finance-tables.js
20250102000001-fix-fee-configuration-nulls.js
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Student" (id, first_name, last_name, age, grade, parent_name, parent_email, parent_phone, parent_id, school_id, class_id, teacher_id, language, is_active, created_at, updated_at) FROM stdin;
c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	Kaylee	Chihwayi	5	\N	Tapiwa Tsvarai	tapiwatsvarai@gmail.com	12345678	48a9ddcc-b2af-4362-bad5-b27226d3a5ba	2f921318-8f76-4c43-92e9-b3e7099a31b9	d78491c0-182b-4ded-9b69-ea0d68837e7d	78b8df89-8523-4cdd-9899-d5bb760f9896	en	t	2025-08-01 08:52:19.366+00	2025-08-01 08:52:19.366+00
603dcc92-049c-4c6e-99c0-7e24803e96c5	Kayla	Mutemachani	6	\N	Priscilla Tsvarai	priscillatsvarai@gmail.com	987654321	f00289b6-50f3-48f1-973f-ff1470f562b7	2f921318-8f76-4c43-92e9-b3e7099a31b9	d78491c0-182b-4ded-9b69-ea0d68837e7d	78b8df89-8523-4cdd-9899-d5bb760f9896	en	t	2025-08-01 08:53:32.512+00	2025-08-01 08:53:32.512+00
\.


--
-- Data for Name: StudentAssignment; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."StudentAssignment" (id, assignment_id, student_id, status, submission_text, submitted_at, grade, feedback, graded_at, graded_by, created_at, updated_at, submissions, completed_at, parent_viewed) FROM stdin;
\.


--
-- Data for Name: StudentFee; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."StudentFee" (id, student_id, fee_structure_id, amount, paid_amount, due_date, status, payment_type, academic_year, term, month, notes, created_at, updated_at, school_id) FROM stdin;
\.


--
-- Data for Name: StudentFeeAssignment; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."StudentFeeAssignment" (id, student_id, fee_configuration_id, payment_plan, total_amount, paid_amount, balance_amount, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: StudentServiceSelection; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."StudentServiceSelection" (id, student_id, optional_service_id, is_selected, paid_amount, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Subscription" (id, school_id, plan_id, plan_name, status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, trial_start, trial_end, cancel_at_period_end, cancelled_at, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SubscriptionPayment; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."SubscriptionPayment" (id, subscription_id, school_id, stripe_payment_intent_id, stripe_invoice_id, amount, currency, status, payment_method, description, period_start, period_end, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SubscriptionPlan; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."SubscriptionPlan" (id, plan_id, name, price, currency, "interval", trial_days, max_students, max_teachers, max_classes, materials, templates, assignments, basic_analytics, finance_module, advanced_analytics, priority_support, custom_branding, api_access, white_labeling, storage_g_b, monthly_exports, custom_templates, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SubscriptionPlans; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."SubscriptionPlans" (id, "planId", name, price, currency, "interval", "trialDays", "maxStudents", "maxTeachers", "maxClasses", materials, templates, assignments, "basicAnalytics", "financeModule", "advancedAnalytics", "prioritySupport", "customBranding", "apiAccess", "whiteLabeling", "storageGB", "monthlyExports", "customTemplates", "isActive") FROM stdin;
\.


--
-- Data for Name: SystemNotification; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."SystemNotification" (id, type, title, message, data, is_read, target_role, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: Template; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."Template" (id, name, description, category, subcategory, difficulty, age_group_min, age_group_max, cultural_tags, languages, content, thumbnail, preview_images, creator_id, downloads, rating, review_count, is_premium, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public."User" (id, email, password, role, first_name, last_name, phone_number, language, school_id, subscription_plan, subscription_status, subscription_expires_at, is_active, last_login_at, created_at, updated_at) FROM stdin;
a539c47d-8da6-425b-a531-bfd0805e227e	mchikoka@gmail.com	$2a$12$JqyZH0xhBOkgYfAxXQFBZuOK9UuGy.tDWHNPKAJUHYfaqUUT4RL5O	school_admin	Mary	Chikoka	123456789	en	2f921318-8f76-4c43-92e9-b3e7099a31b9	free	active	\N	t	\N	2025-07-31 21:53:59.794+00	2025-07-31 21:53:59.794+00
db116247-6ed7-4ecd-8f45-d52ebe9661db	finance@school.com	$2b$10$SsTG0KISlQAG//v7SwG8o.P7q0puTwggNZirOXCg0h/XbHGJYLjQK	finance	Finance	Manager	+1234567890	en	2f921318-8f76-4c43-92e9-b3e7099a31b9	free	active	\N	t	2025-08-15 10:50:52.829+00	2025-08-04 19:18:29.126+00	2025-08-15 10:50:52.834+00
f00289b6-50f3-48f1-973f-ff1470f562b7	priscillatsvarai@gmail.com	$2b$12$6YTTCOSvpaq3sMsKUsY46uNfQxCc/nkA0.Bj/44IXN0P6.ORsJIye	parent	Priscilla Tsvarai	Mutemachani	\N	en	2f921318-8f76-4c43-92e9-b3e7099a31b9	free	active	\N	t	\N	2025-08-01 08:53:31.714+00	2025-08-01 17:14:04.479+00
57d8548a-2388-4372-98ea-07839abce851	admin@ecd.com	$2b$12$BQdILD9EeF.Y3GXYI7slc.d9PW54wuNw3RQG2FIQJTTS.pielAd..	system_admin	System	Administrator	\N	en	\N	free	active	\N	t	2025-08-16 15:28:13.035+00	2025-07-31 21:20:56.869971+00	2025-08-16 15:28:13.038+00
48a9ddcc-b2af-4362-bad5-b27226d3a5ba	tapiwatsvarai@gmail.com	$2b$12$3TZtvYh6X.8yUhfU2nKmNuaHUGhrXhUCp0xKUvSSqQvkIx.uijxw6	parent	Tapiwa Tsvarai	Chihwayi	\N	en	2f921318-8f76-4c43-92e9-b3e7099a31b9	free	active	\N	t	2025-08-16 15:43:10.276+00	2025-08-01 08:52:17.869+00	2025-08-16 15:43:10.276+00
80c66730-e2a3-4c1a-b990-fae9a2f2ea51	ichihwayi@gmail.com	$2a$12$zUy.0U.TvG0fJX8FnQUWouSGg3UVcOnrNRmnntL1uJb1Hezcgen8i	school_admin	Ignatious	Chihwayi	+263778886413	en	f04bfa37-cf95-4d9b-9eed-2c1c19f45df0	free	active	\N	t	2025-08-13 13:49:50.597+00	2025-08-11 11:50:33.135+00	2025-08-13 13:49:50.601+00
b8b2ff04-5690-466d-9992-7a136d681dca	bbanda@gmail.com	$2b$12$tYtpZSdjx9Pim30Y1ko4iuwgJjTk1.WSRf4yuNJhCKeME34l6694C	school_admin	Brian	Banda	098765432	en	2f921318-8f76-4c43-92e9-b3e7099a31b9	free	active	\N	t	2025-08-19 11:20:40.785+00	2025-07-31 21:39:16.835+00	2025-08-19 11:20:40.788+00
78b8df89-8523-4cdd-9899-d5bb760f9896	ptsva@gmail.com	$2a$12$MP//qGLlFKtzUjZqQh9BseAcboB761.tKw15wjs7VUjsDBw61ug66	teacher	Prisca	Tsvarai	\N	en	2f921318-8f76-4c43-92e9-b3e7099a31b9	free	active	\N	t	2025-08-19 11:37:48.033+00	2025-08-01 08:32:55.123+00	2025-08-19 11:37:48.033+00
\.


--
-- Data for Name: financial_reports; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public.financial_reports (id, school_id, report_type, report_name, date_range, report_data, export_data, generated_by, is_active, created_at, updated_at) FROM stdin;
ebceceb5-3782-47c4-919a-e6ba984f0bcb	2f921318-8f76-4c43-92e9-b3e7099a31b9	revenue	revenue Report	{"endDate": "2025-08-05", "startDate": "2025-07-31"}	{"trends": {"recentRevenue": 0, "recentPayments": 0, "averageDailyRevenue": 0}, "totalRevenue": 0, "paymentMethods": {}, "monthlyBreakdown": {}, "feeStructureBreakdown": {}}	{"data": [], "headers": ["Month", "Revenue", "Payment Count"]}	b8b2ff04-5690-466d-9992-7a136d681dca	t	2025-08-05 14:34:52.955+00	2025-08-05 14:34:52.959+00
\.


--
-- Data for Name: receipt; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public.receipt (id, receipt_number, payment_id, school_id, student_id, amount, payment_method, payment_date, academic_year, term, month, fee_structure_name, student_name, parent_name, class_name, recorded_by, recorded_by_name, notes, is_printed, printed_at, printed_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: signatures; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public.signatures (id, user_id, school_id, signature_data, signature_type, is_active, created_at, updated_at) FROM stdin;
5a620ac6-5500-4ec2-a2a2-b7d18adab211	b8b2ff04-5690-466d-9992-7a136d681dca	2f921318-8f76-4c43-92e9-b3e7099a31b9	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAADICAYAAAAeGRPoAAAAAXNSR0IArs4c6QAAHd9JREFUeF7tnUuLXcUWx6uj3rw6McGRColjB/oBnDjwI+jIgRJQEQRFEBF0opMgCDoQgiIBBw5EP4I48QMIDhwnA3EgwaS78+pO96VOerfVu/c5ux6rqlbt/WsQ7/XUY63fWlX/qtp19lnb29vbM/xBAAIQgAAEINA0gTUEven4YTwE8hKwy/21vF3QOgQgIEMAQZfhSCsQgAAEIACBqgQQ9FX42Z1UTU46hwAEIAABfwIIuj8rSkIAAhCAAATUEkDQ1YYGw1okwKFOi1HDZghMgwCCPo04VvBCQLoEmqjgOF1CAAIQUEkAQTfGtKwrLduuckRgFAQgAIFGCSDojQYOsyEAAQhAAAIuAQSdfIAABCAAAQhMgEAZQedcuEyqwLkMZ3qZIQEG11yC3nKkswp6y2Dmkrz4CYF4AozweHbUhIA8gayCLm8uLUIAAhCQIMBiRIIibegiMA1BZ2zqyiqsgQAEIACB4gSmIejFsdEhBPISYI2aly+tz5fAlMdWc4I+5WDMd4jhOQRqEWBGqUWefuUJNCfo8ghoEQJtEUCC2ooX1kKgFAEEvRRp+oEABCAAAQhkJICgZ4RL0xCAAAQgAIFSBBD0UqTpBwIQgAAEdBKYyHMsBF1nemEVBCAAAQhA4IDAwZpjxeIDQSdhIDATAhPZhMwkWrgJgXACzQo6k1N4sKkBAQhAAALTJdCsoE83JHgGAR0EWDTriANWQMCXQE/QGcK+4FouR5S1Re9wRIiPtvhgDwTaIMAOvY04YSUEIAABCEBgJQEEnQSBAAQgAAEINEBg7PQOQW8giDImjqWCTC+0AgEIQEAFgRlOeQi6iszDCAhAAAIQgEAaAQQ9jR+1EwjMcAGdQIuqEIAABFYTQNDJEAhAAAIQmBeBie4mEPR5pbGQtxMdDUJ0aAYCEIBADQIIeg3q9AkBCEAAAhAQJtCkoLM/FM4CmoMABCAAgeYJNCnozVPHAQhAAAIQgIAwAQRdGCjNQQACEIAABGoQmKGgBx7YBxavEUT6hAAEIAABCMxQ0Al6swQqLK4qdNlseKZgOPGeQhTn6wOCPt/Y4zkEIAABMQIshsRQRjc0cUEnxaIzg4oQgAAEVBJgXn8YlqMcJi7oKrMRoyAAAQhAAALiBBB0caRtNDilNe7a2toR6Ht71kP+IAABCOgnIDUfI+j6Y42FIwQQdFIEAhBomoCQoh8IulB7TTPF+DYJdIJu/727u5vuBIMhnSEtQAACxQmwQy+OnA6lCbg79EkctbOgkE4R2oPALAgg6LMIc3tOhmjasWPHTCfkkxD09sKFxa0RCBlgrfk2N3udWKoVdPJtblkZ7++jjz5qHjx4sGgAQY/nSE0IQKBtAmoFvW2sWF+aQHfs/sgjj5idnZ3S3dMfBCAAgeoERgSdfXL1CGGAFwHxi3FevVIIAvEEmF3j2VFzmAA7dDJjEgQmdzFuElHBCQhAoCQBBL0kbfrKRoCLcdnQ0jAEINAIAQS9kUANmXn69Glz586doItgYt/VVsbN+2Ic55zKIoc5EICAFAEEXYpkwXZihLxv3hRvg3fH7lP0rWB60VUuAiwmc5Gl3X0CCHpDqeDuQl2zrZCdPHnSbG1tLfXGPZK2haa4U0fQG0pmTIUABMQJIOjiSGUb/Pvvv81TTz01eKzuI+R9a1xhf+yxx8z9+/dlDa7YGoJeET5dRxFg0x6FjUpLCExA0NsYEjFW2u9UD72bPHV37d4IrynqMUxWjeQxQZfuj1kFAi0RIP9bilacrRMQ9DjHNdc6derU4rJb/0/qpSn/+9//zPb29kHzUu3WZjom6LXto38IQAACOQkg6AN0a65kSz3r7ot66q4/Z5L6to2g+5KiHAQgMEUCCLqCqC677GYvut2+fTurhf0FRMs3xPUIes0lYdZ0oXEIQEAxgWqCzpRnTF9Muzyx/737sZESueMuKEr3LemfHkGX9Iq2IAABCPgRqCbofuZNs1Suy24ptJp+09r+6hBBT8mAaddlAzHt+OLdQwIIesFMyH3ZLcWVEydOmHv37i2aOH78uLl7925Kcw/rFp5FEfT0kGlqgXhqiga2tEAAQU+N0r5ojWlXqctuKe60/otlCEBK9PXV5Qd39MUEi3QTQNAzx2foeL3EZbcYt1xbW7wch6DHRF1vHQRdb2ywTCcBBD1TXIaO11u4cNZNoi3Y2g8dgp4pmSs16wp6Z0KLC81K+Oi2eQJj575HHUTQMwS9heP1ZW63uitaX18/eJd97kk/fJhlSLICTY75OfZ5qolDgj6F9yWkcqF+BgK5kzmDyUNNIuiCoO1rVHd2dg61qPV4fZnbrR67e/98qmC8aSovAffExc3LFk+P8pKidQg8JICgC2VCf1fe8qTT4rF7qwsRofSbZDP9Ryitnh5NMjgJTiVvhpMbSDBeeVUEXSBAfTE/f/68uXHjhkDLdZpoceJs+nv0dcKsvtehOxEt5qZ60Bg4GQIIekIoz5w5YzY3Nw9amMrzvRZ3uwh6QiIrrLrsEYr7WGsq400hfkxqlACCHhm4Kf64iYuitWP31r9DH5mGEdXaOK9ctUBzP7PC7/5yYAQQqkBgMgQQ9IhQ9sX8yKTSxpy50vPWBLI1eyPSblZVxuLJ0fus0gFnPQlMQNDLqmdfzO0R4P379z1xt1PM/wi7LP9lBFs7UWgnE+pY2sXTPv7pf3OkswhRrxObyfeqY0qLwpxZ0BsmM4BzmZhPy8uHjrsvxmnhq3c+AhA1QqhUhYDPS4Lc8cjz9CpholNlBDILujJvE8yZy87cRbT82FPfEqaz1b5gZmNjIyHSVNVAwEfQrZ18P71utPTNBHV51O4dQfeIwBzF3GLxP3b3gJixCC+VyQi3UtO+gt7PUztWu18NrGT6QbfuvJH77YW1fXX7R+TrRQNBH2E/VzHv7340T0itLDzqDfP2eg4RdOud+zxdy70WnvG3l3etW4ygr4jgnMW8w9LCZTMmztanoaP2hwr6QtSPrRljt4fGGA2i7ualtUnzonh6GdSSR3JnGgj6krgj5g/BtCCWY19xamloY+vhvAsRQW1jti/oh46l9/ZXHgQcAoIEEPQBmDETg9waSzC6Ak218NY4brgLBFpZEzE7dOtCzNjN4bo7bobaD1mo5LCPNhsj4CkwCHovrlomBE3pJnPs7pmRgY5zIS4QWAPFUxeRGsbwspOt2IVKA2GrYmKeWaWKKyKdIugORg0TgUhUQxsZGRWaj925EBcabP3lJfKtP5ZL74iXLYIR9Hz5Jyfuci3l83a4ZQTd4aLxpmzphBjqL3XHlNMHick/p320HU5A5kTo6PF7KVFfNV7SBb1dsQnPBGqEEkDQ94kh5qtTR2qSDU3QsfJciBsj1Nbn0ovHGm+TW7XITBf0tuKJtWUJIOi8bcor47TuhGMuxLHH8Qp5lUI58qz02+RWLX4R9CppNZtOEXTnq1l2sO3u7s4m+CGOSu+cQvpeVtb9bexSx6kSdtPGcgK5ToLcuxa53ya3SrQRdLI/J4HZCzqXqvzTK2Y37N96eEliF87MrXH69Glz584d7xee5F405X5Vqrv7t7nz4MGDNIBLaiPoWbCubJRTt4d4pi/onje457I7T0l8bc+rcxzPlp+KyvUYKuB9y3ILeolTIDdnrH85fkkQQS+X0/R0mEDjgp4iT4d/qUl2sgq3K7yGMfY72PYRgazt/yWInZjsTqb7PWptAqptgaFhcnFPLXztsRytsG1tbQ1WKcW51IlLn5HkYn7MB22nXItd3drakbjnmlN8c5JycQQaF/Q4p7ta2gRqlTe5xTuUpIYBn+t5ayiL0uVjRNu1cUzA+/6MiZSU/yXH46lTpxaPG9w/ife/jy1+xj6XYunbzpCYu3U1jHNfXyg3hyP3FVHWLAj2+NEOJt8B1d9NxyZ36MLB2tnt4GP7jKl39uzZg989P3PmjLl161ZMM6rrpByRS+463V1ciWfP0ravCnL/Fa0pou6z8Cm5aPFJ7r49fYH3nX98+qJMfgLs0BX9CpLvBC4l3r7p5SPyOSbhVY8hSjxv9eUjUa7/ZjOfNnMwX9ZvCSGqtcCWekOkz+7bR/R9Yi9VZuh5f4lYS9lPO4cJIOi1BN1Rq1XHXvYz+0/6jdyYp/RHh8vYEV1XI/eiQ9vEGDqxhAh46BF5qC0+5UssoLrcStkl+/gyVKYfj5iTpyFx7Pel7bcH+ja748qegt28eTMWKfUqEEDQawn6frCHJnYNE7jvTs2doMbyt5s87GS5vb09Vnzl57V3Eb6nKaFO1hAzXxt9dqC+bfXLlVgwjNnWH4uhJyA+gm5t6MrZsZM6DsZ8Gvvctdk+utrc3FxUCfV9rB8+L0MAQa8s6LWFKTTNVu2MfY7mh/qLEfqc4tK3MfUS2irGmgV8FQfpZ6sl4zmW80PxHhO4kBMjTb52tqyvrx+IueUjHd8x5nwuQ6CQoMsc98q4/F8rvivqqH49Xa55zBjjV+iRoRWs7nGB7yThc0KRe5fjuwP3sTWGs9Y67uJL6jLkiRMnzL179xYu2//dv31eg8Wyk6dlC7AQkV6Utd8U26svnEOP0Ky4b2xs1MBOn4kEEgXdU7USjcxVPcfkFGqr7KKiTDzcVX3swPcR+mViGbqoGItJiHjP/dXAIcI1xr37PGR369umVLmh3fqQqIeMY03+9gUdMZfKnDrtJAp6HaOles0xOYXa1tmQ8+tAoTaNlT+2tmY3Fybm4tCqtlcJq+Vk/7G7/dgJ0Ve4XRu7RcXm1tZiUzX3v1j2q7i1MAZ8LzH6nEJJL0hTctIV9JbmoBSfp1x31oKeY3IKTZbWnqFb/3JPwKHC64p9n7/vRNz5teqNaaGxnWJ5aTHScBnON04+ueQj6O4Y8i3va6Nbbuy8zn2Xw9gdgZj+qVOewKwFfeXkNDYahGI1OKEV6jvWhZInG6Ev2PHxaW7PvX2YhJSRXNCVzKUQH3OXDTmiz2GLXTTfvn37oOmcC4sc9tPmMIFZC7q7Uq65QpWcIEskes1J2D7j6945HjIptnSbvEQMU/qQOlXSeBkuhUtI3ZDcDWnXp2xfzG0dBN2HnP4ysxf0KsfuvR241ARZKt2qMNt3rmbfpfhq70fqmHzOsawp6EM32xF07aPOz77ZC7qGXbrUBOkX8vRSNSfi1hY/6bTzthD7dEfiVEmijbx08rVeUtDdGLtj1/5ATXfsjqDni3XJlhF0Yw7dmn733XfNl19+6RWD2MlwqPFugEvfHPdyJLCQBkGv+YgkENcki6curFpbxEoHsaSgd7bbC593795d/N9u/HR2XL582Xz44YfSbtJeYQII+j7wms+FNZwShOSd9E3nkL5bWviE+NVa2VRBrj3eavOuIehDi7Duvz355JPmr7/+qo2F/hMJIOj7AGvuOl1Bt/9b+/GX+87nkrbm7VfyvCVxVDZSPfbIfM6X4brQlhZ0d36zO/XuqL2zQ8N75RtJe9VmIuhOeFKPEb0ivUQ3ai8ovGwfYFVS0GueDKziM9elQOx4aS3XQ8eGT/mSgj501N5fWPAIyydq+ssg6E6M7FebuvdTl05wrWK1LIVLTkidDQiBrgkl5tjdfTnLnN9MVmr8uGI+dPrHmNI1plKtQdB7BN0EL30M1dJzxVITkhseJp/U4S5fPyQP+m9aK3m6I+95SItHz3A6bjnfj9AX86EfvnE3MfOJR0js2iqLoA/Eyz1KzDng+l23JFghE7nUkGiJj5TP2tsJyYNa40ojwxKLd5f3sl+xe/rppw8uwyHouTMl/8M5BH1JDGtNPiUGukTahkzkEv3ZNlphI+VvC+34XoxzF2MlF8laGebOZR8xt2y++uor89577y0wIehas8XfrgRBX7bayL8K8XcvvmT/eLDUJNTKLhRBj88ttTUjhq7vxbjcAqaW6RLDco5zt237mtfNzc2VeLrYfPfdd+bSpUutocReh0CCoE+fYy1R950ka0agpqDP+TJVzZgP9e1zMS6neGnj4WtPLiZuPHzHSTeWL1y4YK5duzbiQsSqzxcK5ZIJIOgjCGtc5Kl52943o2oK+uJtets7hh8o941W3nJju++xz/Nap7P1HJfRzp07Z27evLlwOORbOl187Fx37949ncCwyosAgu6BySb6zva2WaxN19bM7u6uR620IjVv2/tYXlPQ7Qtmbt265WMmZQoQWPV8PNdOtIBb2buQHEPHjx839+/fP7A55Hk4C67soS7WAYLuibqGwBY9eg88SZOcjHxC4HO069MOZfIQcHPV9mB3oNvb2wedlVoI5/EuT6tSYyhFzK1nLLryxLdGqwh6APWiArtvl9bVs9Rk5Iu/Bntf2yhnTP/RVJ9JyI5xLjwlxlBfzGOOzd02iFPb2TdJQd/bs0fj8oGp8WzbXT2//vrr5urVq/KORbQoMRmFdKt1YRPig2/ZwMMS32aLlBvaqbtHwUWMaKST1DHkvl3Suhwj5rbeM888c3AZDkFvJHmWmNmmoFec8Wp8n1ajmKVORiHDxt39ffrpp+aTTz4JqU5ZjQSOjOGKg7oSn5Qx5M5DKWJu6165csW8/fbbCwq5BX1+US6bXG0KellGR3pzdyElvp+u8RlXymQUGj6N/of6QHkI9Al0Y2jxrY2dHW9AfTGXEOHOlh9//NG88sor3rZQUNcSBUGPyMjS309/9tlnzZ9//rmwVMvlopKCrvGEYjxtdA30cXspUZpAaF6/9NJL5pdffjkwU3Iu6Gx5/vnnze+//14aBf0JEUDQI0GWFvUaR/2r0JQS9IsXL5rr168vTClxGhKZDg1WY8FRO2ihJ0/uyaCkmHcbBfvv9fV1s7GxURsN/UcSGBd0xv1StKVFvfRRvwZBD530IscB1SBQnEDITya7Yz/Hr0B27fu+Xa44rKl3KKSz44J+AFKox4kFpuSb5A76sjf49+ruWEvt0HN8Xa1MJpfpZWLDaXbu+IyjmNe5hoLsFs7SO/9QOyifRiBA0NM6mnLtLKK+RA+y9BURHJ+JyK/Z1cLHzsGPIqXaJDA2jtxdfE6x5cVNbeZP32oEXSiOrtDmHHjWXA2iPjYRSWBlkpGgSBtZCAgdwKwaRzlusy9jYZ+db21tLT6WuDWfhTmNjhJA0EcR+RcocTTWWVNyATFEoISg5zhu948mJSGQn8DQOHrzzTfNt99+e6jzN954w3zzzTfZDHruuefMH3/8gaBnI1ymYQRdmHPJ2+glFxBHjnb2X8WXazVvJxc7ydg/LuoIJynNqSHQF/T+6Zv8ad/w0cIPP/xgXn31VQQ9S2YIHed42Iage0AKLVLyNrq7gIh99WOof7Z87h06x+0xUaFOawTccdQX89AXzqT63tmS+zQg1U7qLyeAoGfKjpKiXrKvDlduQee4PVNi0qwqAl2e93+drsY7FzpbHn/8cfPvv/+q4tS8MYU26Qh6pkyZ+nfUcwr6Tz/9dPD6SY7bhRO00MQibPVkm3MXrp2TNcTcPXVjzClMN89xW1bQPY06jNOpFFW/XnBKinrJvnIfuXPcXi9n6bksgb6gD4t5mYmPlziVjX2O3soKeg4PlLdZUmhL9pVzh85xu/KkxjwxAmvH1hYvibJ/tXbmnTPnzp0zN2/eXPzfXJddxcDR0CABBL1AYpQU2lJ95RL0d955x3z99deLqHD0VyA56aIqAfcZeu3fjX/ttdfM999/j6C7GVHmcEQsBxF0MZSrGyoltNaKEn3lEnR254USkm5UEMg1jmKd6+z5+OOPzWeffRbbDPUqEUDQC4IvIbSdO/2+7H+X+k5ryI9KhOB9+eWXzc8//7yoImVrSP+UhcDcCXSCfuHCBXPt2rW542jOfwS9cMhqi7p1N/VZXa7LM+7u/K233jJXrlwpHB26y06gsSPM7DyUddCNwZLvtFCGoGlzEPQK4Ssp6ta9/juhU0W9G/SSu+hLly6Zq1evsjuvkI90CYGOwOwfeTW+4ETQK43lvqjn+I3jvmtSC4lu0Eu+ycqdSD7//HPzwQcfVIoM3UJgvgSOHz9uust53HRvLw8Q9Ioxy//e5qPODfV58uTJg19aGsOR6/l5jl3/mC98XoPA8i1Q45ujGjDF+7x48aK5fv36ol0EXRxv9gYR9OyIV3dw5swZs7m5eVBI8hh7Wc9DF+Z8d9s5np+7L5J5//33zRdffFE5KnQPgXkS+Oijj8zly5f1CXoLqz0vG70KRSffEkHP22m0tROu2H/O/eKLL5pff/01m8enT582d+7cObQK91lM5NhJz/65XbYo0zAEwglo+ypduAfzrcEOXVHs+6JuB9apU6cO7eBzmDvU77Jj+JzPz3mRTI7o0iYEwggg6GG8jpautyFG0FNjJ1z/4Bn1mn2I9bDxEsLuPhvvXLL99oU9erAvyXH3uP23334zL7zwgjBRmpszgXpT62rqWu3q5hv7b56htzdyEHSFMVtfXze3b98+MqByC/vQMfwyPFKDneN2hQmISbMmEL1onzU1Hc4j6DriMGjFMmHP/RU3H2GXEHT3ch7H7YoTEdOOENC8w04NF4KeSrBefQS9HnvvnoeE3ecCm3cHFQr2b9pLLBAquEGXEJgcAQS93ZAi6A3F7uzZs2ZjY+PA4lZFXeoFNw2FDlMh0AwBBF0oVBWOcSYq6BVICuWATzP9W+nnz583N27c8KlavQxiXj0EGACBlQQQ9HYTZKKC3m5AfC2v9RU3X/uGylUX82mv81JCQ91mCORPYgS9mWQ4YiiC3m7szLKvmpX47nootupiHmpwY+XzT/ONAcHcaAIIejS66hUR9OohSDMg9StuJYQgh5jvmT2zZuyX9fmDAAQkCfCb6JI0y7aFoJflna23ZcLedWgHqT2m39nZyWZDv+Ghr7+l/hZ7MeMDOiqxKAowh6IQSCJgx6idJ5544gnzzz//JLWlurLqgRtnHIKuOuPCjRsT9q5F3x9jCbfAmGXfY5+imMfwoQ4EIACBHAQQ9BxUlbRpn7Hv7u6ufIWj1Fff7ALBfpd86PvkQ6+QVYIIMyAAAQhMhgCCPplQ+jnSvx3fr+X++Mr29vZgoz4LBVsRIfeLCaUgAAEISBBA0CUoNtjG0A15CTesiNt/Hjx4INEcbUAAAhBomkDc0/A4lxH0OG6TqmWfbXcCHPoK1hqX7SYFH2cgAAEICBFA0IVATreZkuvL6VLEMwiIEGA4imCcaiMI+lBkGTRTzXf8ggAEGiTAlOwXNATdj5OOUmS1jjhgBQQgAAGFBBB0hUHBJAhAAAKHCbCaJyPGCSDo44woAQEIQAACEEgiUGJJhqAnhYjKLRIoMbBa5ILN7RKYWk5PzZ9SmYWglyJNPxCAAAQgAIGMBBD0jHBpGgJxBFrfn7Ruf1zUqKWTQEg2hpTV6C2CrjEqymzSneS6rVMWSsyBQI8A42dKKYGgTyma+AIBCEAAArMlgKDPNvTWcVbnsw4/zqsnwAhVHyJVBiLoqsKBMRCAAASUEmB1oTQw/5mFoKsPEQZCAAIQqEQAEa8EPq5bBD2OG7WaJMDs1GTYMBoCEPAiECjoTIheVCkEAQhAAAIQKEwgUNALW0d3EIAABCAAAQh4EUDQvTDpLsS5ie74YF0+AuR+PrZNtEwCHAoTgt5E1mIkBCAAAQhAYDUBBJ0MgUAlAmwuKoGnWwhMlACCPtHA4hYEIAABCMyLAII+r3jjbesE2Na3HkHsh0A2Agh6NrQ0DAEIQAACEChHAEEvx5qeIAABCPALCjYHOGnKMhIQ9CxYaRQCEIAABOZBQM/qBEGfR8bh5RgBPWPyoaXa7BnjN4XPYU7iNZ7HCHrjAcR8CKgkgDiqDEsVo8iFYtgR9GKo6agEAeaOEpTpAwLyBBi76UwR9BSGZGAKPepCAAIQaJeAwvkfQW83nbAcAnUJKJzQ6gKhdwjUJTBbQWcuKpN4cC7DmV4gAAEIzFbQCX0mAih4JrA0C4EEAozLBHiHq2pGiaCLhZmGIAABCEAAAvUIIOj12NNz8wQ0r9Wbh4sDEIBAIAEEPRAYxSEAAQhAAAIaCSDoGqOCTRBg808OQAAC+wR8pwMEnZSBAAQKEPCdkgqYQhcQmCgBBH2igcUtCEAAAhCYFwEEXXW82dWoDg/GTZIAo26SYZ2FUwj6LMKMkxCAAAQgMHUCCPrUI4x/EIAABCAwCwII+izCjJMQgAAEICBOQNnzGQRdPMI0CAFhAsomDWHvaA4CEBAi8H8Kj4yZ+bwJ8gAAAABJRU5ErkJggg==	principal	t	2025-08-05 13:37:31.827+00	2025-08-05 13:37:31.829+00
\.


--
-- Data for Name: student_service_preferences; Type: TABLE DATA; Schema: public; Owner: ecd_user
--

COPY public.student_service_preferences (id, student_id, school_id, tuition_type, transport, food, activities, auxiliary, academic_year, notes, created_at, updated_at) FROM stdin;
a0b8e220-28bd-4dcb-8be9-255c9c678723	603dcc92-049c-4c6e-99c0-7e24803e96c5	2f921318-8f76-4c43-92e9-b3e7099a31b9	\N	t	t	f	f	2025	\N	2025-08-05 18:30:06.971+00	2025-08-05 18:30:06.971+00
7d14d8bd-303c-44ee-aefc-1cdd2a375f26	c0ed4ddc-fc27-495a-aa8e-11b98bb683c4	2f921318-8f76-4c43-92e9-b3e7099a31b9	\N	t	t	t	f	2025	\N	2025-08-15 11:51:03.859+00	2025-08-15 11:51:03.859+00
\.


--
-- Name: SubscriptionPlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecd_user
--

SELECT pg_catalog.setval('public."SubscriptionPlan_id_seq"', 1, true);


--
-- Name: SubscriptionPlans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecd_user
--

SELECT pg_catalog.setval('public."SubscriptionPlans_id_seq"', 1, false);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Class Class_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);


--
-- Name: FeeConfiguration FeeConfiguration_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeeConfiguration"
    ADD CONSTRAINT "FeeConfiguration_pkey" PRIMARY KEY (id);


--
-- Name: FeePayment FeePayment_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_pkey" PRIMARY KEY (id);


--
-- Name: FeeStructure FeeStructure_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_pkey" PRIMARY KEY (id);


--
-- Name: Material Material_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Material"
    ADD CONSTRAINT "Material_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: OptionalService OptionalService_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."OptionalService"
    ADD CONSTRAINT "OptionalService_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: School School_custom_domain_key; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key1; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key1" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key10; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key10" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key100; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key100" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key101; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key101" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key102; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key102" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key103; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key103" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key104; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key104" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key105; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key105" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key106; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key106" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key107; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key107" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key108; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key108" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key109; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key109" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key11; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key11" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key110; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key110" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key111; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key111" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key112; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key112" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key113; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key113" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key114; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key114" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key115; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key115" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key116; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key116" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key117; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key117" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key118; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key118" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key119; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key119" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key12; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key12" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key120; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key120" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key121; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key121" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key122; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key122" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key123; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key123" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key124; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key124" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key125; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key125" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key126; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key126" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key127; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key127" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key128; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key128" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key129; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key129" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key13; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key13" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key130; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key130" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key131; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key131" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key132; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key132" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key133; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key133" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key134; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key134" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key135; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key135" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key136; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key136" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key137; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key137" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key138; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key138" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key139; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key139" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key14; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key14" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key140; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key140" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key141; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key141" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key142; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key142" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key143; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key143" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key144; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key144" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key145; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key145" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key146; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key146" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key147; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key147" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key148; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key148" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key149; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key149" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key15; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key15" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key150; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key150" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key151; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key151" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key152; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key152" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key153; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key153" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key154; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key154" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key155; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key155" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key156; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key156" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key157; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key157" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key158; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key158" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key159; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key159" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key16; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key16" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key160; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key160" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key161; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key161" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key162; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key162" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key163; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key163" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key164; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key164" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key165; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key165" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key166; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key166" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key167; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key167" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key168; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key168" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key169; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key169" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key17; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key17" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key170; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key170" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key171; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key171" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key172; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key172" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key173; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key173" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key174; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key174" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key175; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key175" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key176; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key176" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key177; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key177" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key178; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key178" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key179; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key179" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key18; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key18" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key180; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key180" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key181; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key181" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key182; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key182" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key183; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key183" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key184; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key184" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key185; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key185" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key186; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key186" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key187; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key187" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key188; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key188" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key189; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key189" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key19; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key19" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key190; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key190" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key191; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key191" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key192; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key192" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key193; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key193" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key194; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key194" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key195; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key195" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key196; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key196" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key197; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key197" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key198; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key198" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key199; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key199" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key2; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key2" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key20; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key20" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key200; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key200" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key201; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key201" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key202; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key202" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key203; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key203" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key204; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key204" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key205; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key205" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key206; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key206" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key207; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key207" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key208; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key208" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key209; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key209" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key21; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key21" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key210; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key210" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key211; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key211" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key212; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key212" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key213; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key213" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key214; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key214" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key215; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key215" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key216; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key216" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key217; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key217" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key218; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key218" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key219; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key219" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key22; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key22" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key220; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key220" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key221; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key221" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key222; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key222" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key223; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key223" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key224; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key224" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key225; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key225" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key226; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key226" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key227; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key227" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key228; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key228" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key229; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key229" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key23; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key23" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key230; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key230" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key231; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key231" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key232; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key232" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key233; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key233" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key234; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key234" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key235; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key235" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key236; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key236" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key237; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key237" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key238; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key238" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key239; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key239" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key24; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key24" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key240; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key240" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key241; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key241" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key242; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key242" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key243; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key243" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key244; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key244" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key245; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key245" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key246; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key246" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key247; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key247" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key248; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key248" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key249; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key249" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key25; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key25" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key250; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key250" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key251; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key251" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key252; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key252" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key253; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key253" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key254; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key254" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key255; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key255" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key256; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key256" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key257; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key257" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key258; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key258" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key259; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key259" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key26; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key26" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key260; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key260" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key261; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key261" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key262; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key262" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key263; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key263" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key264; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key264" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key265; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key265" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key266; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key266" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key267; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key267" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key268; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key268" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key269; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key269" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key27; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key27" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key270; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key270" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key271; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key271" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key272; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key272" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key273; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key273" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key274; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key274" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key275; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key275" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key276; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key276" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key277; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key277" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key278; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key278" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key279; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key279" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key28; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key28" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key280; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key280" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key281; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key281" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key282; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key282" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key283; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key283" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key284; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key284" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key285; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key285" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key286; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key286" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key287; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key287" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key288; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key288" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key289; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key289" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key29; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key29" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key290; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key290" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key291; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key291" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key292; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key292" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key293; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key293" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key294; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key294" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key295; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key295" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key296; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key296" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key297; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key297" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key298; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key298" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key299; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key299" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key3; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key3" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key30; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key30" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key300; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key300" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key301; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key301" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key302; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key302" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key303; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key303" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key304; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key304" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key305; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key305" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key306; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key306" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key307; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key307" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key308; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key308" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key309; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key309" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key31; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key31" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key310; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key310" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key311; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key311" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key312; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key312" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key313; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key313" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key314; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key314" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key315; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key315" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key316; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key316" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key317; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key317" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key318; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key318" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key319; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key319" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key32; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key32" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key320; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key320" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key321; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key321" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key322; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key322" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key323; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key323" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key324; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key324" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key325; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key325" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key326; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key326" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key327; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key327" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key328; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key328" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key329; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key329" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key33; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key33" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key330; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key330" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key331; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key331" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key332; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key332" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key333; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key333" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key334; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key334" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key335; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key335" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key336; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key336" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key337; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key337" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key338; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key338" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key339; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key339" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key34; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key34" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key340; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key340" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key341; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key341" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key342; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key342" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key343; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key343" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key344; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key344" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key345; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key345" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key346; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key346" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key347; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key347" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key348; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key348" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key349; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key349" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key35; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key35" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key350; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key350" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key351; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key351" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key352; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key352" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key353; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key353" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key354; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key354" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key355; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key355" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key356; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key356" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key357; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key357" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key358; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key358" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key359; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key359" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key36; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key36" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key360; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key360" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key361; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key361" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key362; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key362" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key363; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key363" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key364; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key364" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key365; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key365" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key366; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key366" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key367; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key367" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key368; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key368" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key369; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key369" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key37; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key37" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key370; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key370" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key371; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key371" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key372; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key372" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key373; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key373" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key374; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key374" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key375; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key375" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key376; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key376" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key377; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key377" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key378; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key378" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key379; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key379" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key38; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key38" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key380; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key380" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key381; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key381" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key382; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key382" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key383; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key383" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key384; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key384" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key385; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key385" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key386; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key386" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key387; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key387" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key388; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key388" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key389; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key389" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key39; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key39" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key390; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key390" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key391; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key391" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key392; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key392" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key393; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key393" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key394; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key394" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key395; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key395" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key396; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key396" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key397; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key397" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key398; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key398" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key399; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key399" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key4; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key4" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key40; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key40" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key400; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key400" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key401; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key401" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key402; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key402" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key403; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key403" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key404; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key404" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key405; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key405" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key406; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key406" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key407; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key407" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key408; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key408" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key409; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key409" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key41; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key41" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key410; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key410" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key411; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key411" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key412; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key412" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key413; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key413" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key414; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key414" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key415; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key415" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key416; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key416" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key417; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key417" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key418; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key418" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key419; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key419" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key42; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key42" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key420; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key420" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key421; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key421" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key422; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key422" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key423; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key423" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key424; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key424" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key425; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key425" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key426; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key426" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key427; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key427" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key428; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key428" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key429; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key429" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key43; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key43" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key430; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key430" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key431; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key431" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key432; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key432" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key433; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key433" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key434; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key434" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key435; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key435" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key436; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key436" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key437; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key437" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key438; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key438" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key439; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key439" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key44; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key44" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key440; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key440" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key441; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key441" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key442; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key442" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key443; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key443" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key444; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key444" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key445; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key445" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key446; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key446" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key447; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key447" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key448; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key448" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key449; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key449" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key45; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key45" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key450; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key450" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key451; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key451" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key452; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key452" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key453; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key453" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key454; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key454" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key455; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key455" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key456; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key456" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key457; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key457" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key458; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key458" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key459; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key459" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key46; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key46" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key460; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key460" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key461; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key461" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key462; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key462" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key463; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key463" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key464; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key464" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key465; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key465" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key466; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key466" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key467; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key467" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key468; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key468" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key469; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key469" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key47; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key47" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key470; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key470" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key471; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key471" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key472; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key472" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key473; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key473" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key474; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key474" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key475; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key475" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key476; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key476" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key477; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key477" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key478; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key478" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key479; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key479" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key48; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key48" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key480; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key480" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key481; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key481" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key482; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key482" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key483; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key483" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key484; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key484" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key485; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key485" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key486; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key486" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key49; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key49" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key5; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key5" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key50; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key50" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key51; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key51" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key52; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key52" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key53; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key53" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key54; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key54" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key55; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key55" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key56; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key56" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key57; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key57" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key58; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key58" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key59; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key59" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key6; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key6" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key60; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key60" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key61; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key61" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key62; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key62" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key63; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key63" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key64; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key64" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key65; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key65" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key66; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key66" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key67; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key67" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key68; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key68" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key69; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key69" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key7; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key7" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key70; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key70" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key71; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key71" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key72; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key72" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key73; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key73" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key74; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key74" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key75; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key75" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key76; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key76" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key77; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key77" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key78; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key78" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key79; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key79" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key8; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key8" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key80; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key80" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key81; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key81" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key82; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key82" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key83; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key83" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key84; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key84" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key85; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key85" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key86; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key86" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key87; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key87" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key88; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key88" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key89; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key89" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key9; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key9" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key90; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key90" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key91; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key91" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key92; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key92" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key93; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key93" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key94; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key94" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key95; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key95" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key96; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key96" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key97; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key97" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key98; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key98" UNIQUE (custom_domain);


--
-- Name: School School_custom_domain_key99; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_custom_domain_key99" UNIQUE (custom_domain);


--
-- Name: School School_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: StudentAssignment StudentAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentAssignment"
    ADD CONSTRAINT "StudentAssignment_pkey" PRIMARY KEY (id);


--
-- Name: StudentFeeAssignment StudentFeeAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFeeAssignment"
    ADD CONSTRAINT "StudentFeeAssignment_pkey" PRIMARY KEY (id);


--
-- Name: StudentFee StudentFee_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFee"
    ADD CONSTRAINT "StudentFee_pkey" PRIMARY KEY (id);


--
-- Name: StudentServiceSelection StudentServiceSelection_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentServiceSelection"
    ADD CONSTRAINT "StudentServiceSelection_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionPayment SubscriptionPayment_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPayment"
    ADD CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionPlan SubscriptionPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlan"
    ADD CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionPlan SubscriptionPlan_plan_id_key; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlan"
    ADD CONSTRAINT "SubscriptionPlan_plan_id_key" UNIQUE (plan_id);


--
-- Name: SubscriptionPlan SubscriptionPlan_plan_id_key1; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlan"
    ADD CONSTRAINT "SubscriptionPlan_plan_id_key1" UNIQUE (plan_id);


--
-- Name: SubscriptionPlans SubscriptionPlans_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key1; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key1" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key10; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key10" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key11; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key11" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key12; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key12" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key13; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key13" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key2; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key2" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key3; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key3" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key4; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key4" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key5; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key5" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key6; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key6" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key7; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key7" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key8; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key8" UNIQUE ("planId");


--
-- Name: SubscriptionPlans SubscriptionPlans_planId_key9; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPlans"
    ADD CONSTRAINT "SubscriptionPlans_planId_key9" UNIQUE ("planId");


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: SystemNotification SystemNotification_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SystemNotification"
    ADD CONSTRAINT "SystemNotification_pkey" PRIMARY KEY (id);


--
-- Name: Template Template_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Template"
    ADD CONSTRAINT "Template_pkey" PRIMARY KEY (id);


--
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- Name: User User_email_key1; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key1" UNIQUE (email);


--
-- Name: User User_email_key10; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key10" UNIQUE (email);


--
-- Name: User User_email_key100; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key100" UNIQUE (email);


--
-- Name: User User_email_key101; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key101" UNIQUE (email);


--
-- Name: User User_email_key102; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key102" UNIQUE (email);


--
-- Name: User User_email_key103; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key103" UNIQUE (email);


--
-- Name: User User_email_key104; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key104" UNIQUE (email);


--
-- Name: User User_email_key105; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key105" UNIQUE (email);


--
-- Name: User User_email_key106; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key106" UNIQUE (email);


--
-- Name: User User_email_key107; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key107" UNIQUE (email);


--
-- Name: User User_email_key108; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key108" UNIQUE (email);


--
-- Name: User User_email_key109; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key109" UNIQUE (email);


--
-- Name: User User_email_key11; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key11" UNIQUE (email);


--
-- Name: User User_email_key110; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key110" UNIQUE (email);


--
-- Name: User User_email_key111; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key111" UNIQUE (email);


--
-- Name: User User_email_key112; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key112" UNIQUE (email);


--
-- Name: User User_email_key113; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key113" UNIQUE (email);


--
-- Name: User User_email_key114; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key114" UNIQUE (email);


--
-- Name: User User_email_key115; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key115" UNIQUE (email);


--
-- Name: User User_email_key116; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key116" UNIQUE (email);


--
-- Name: User User_email_key117; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key117" UNIQUE (email);


--
-- Name: User User_email_key118; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key118" UNIQUE (email);


--
-- Name: User User_email_key119; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key119" UNIQUE (email);


--
-- Name: User User_email_key12; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key12" UNIQUE (email);


--
-- Name: User User_email_key120; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key120" UNIQUE (email);


--
-- Name: User User_email_key121; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key121" UNIQUE (email);


--
-- Name: User User_email_key122; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key122" UNIQUE (email);


--
-- Name: User User_email_key123; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key123" UNIQUE (email);


--
-- Name: User User_email_key124; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key124" UNIQUE (email);


--
-- Name: User User_email_key125; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key125" UNIQUE (email);


--
-- Name: User User_email_key126; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key126" UNIQUE (email);


--
-- Name: User User_email_key127; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key127" UNIQUE (email);


--
-- Name: User User_email_key128; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key128" UNIQUE (email);


--
-- Name: User User_email_key129; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key129" UNIQUE (email);


--
-- Name: User User_email_key13; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key13" UNIQUE (email);


--
-- Name: User User_email_key130; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key130" UNIQUE (email);


--
-- Name: User User_email_key131; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key131" UNIQUE (email);


--
-- Name: User User_email_key132; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key132" UNIQUE (email);


--
-- Name: User User_email_key133; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key133" UNIQUE (email);


--
-- Name: User User_email_key134; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key134" UNIQUE (email);


--
-- Name: User User_email_key135; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key135" UNIQUE (email);


--
-- Name: User User_email_key136; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key136" UNIQUE (email);


--
-- Name: User User_email_key137; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key137" UNIQUE (email);


--
-- Name: User User_email_key138; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key138" UNIQUE (email);


--
-- Name: User User_email_key139; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key139" UNIQUE (email);


--
-- Name: User User_email_key14; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key14" UNIQUE (email);


--
-- Name: User User_email_key140; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key140" UNIQUE (email);


--
-- Name: User User_email_key141; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key141" UNIQUE (email);


--
-- Name: User User_email_key142; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key142" UNIQUE (email);


--
-- Name: User User_email_key143; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key143" UNIQUE (email);


--
-- Name: User User_email_key144; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key144" UNIQUE (email);


--
-- Name: User User_email_key145; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key145" UNIQUE (email);


--
-- Name: User User_email_key146; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key146" UNIQUE (email);


--
-- Name: User User_email_key147; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key147" UNIQUE (email);


--
-- Name: User User_email_key148; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key148" UNIQUE (email);


--
-- Name: User User_email_key149; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key149" UNIQUE (email);


--
-- Name: User User_email_key15; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key15" UNIQUE (email);


--
-- Name: User User_email_key150; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key150" UNIQUE (email);


--
-- Name: User User_email_key151; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key151" UNIQUE (email);


--
-- Name: User User_email_key152; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key152" UNIQUE (email);


--
-- Name: User User_email_key153; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key153" UNIQUE (email);


--
-- Name: User User_email_key154; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key154" UNIQUE (email);


--
-- Name: User User_email_key155; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key155" UNIQUE (email);


--
-- Name: User User_email_key156; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key156" UNIQUE (email);


--
-- Name: User User_email_key157; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key157" UNIQUE (email);


--
-- Name: User User_email_key158; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key158" UNIQUE (email);


--
-- Name: User User_email_key159; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key159" UNIQUE (email);


--
-- Name: User User_email_key16; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key16" UNIQUE (email);


--
-- Name: User User_email_key160; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key160" UNIQUE (email);


--
-- Name: User User_email_key161; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key161" UNIQUE (email);


--
-- Name: User User_email_key162; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key162" UNIQUE (email);


--
-- Name: User User_email_key163; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key163" UNIQUE (email);


--
-- Name: User User_email_key164; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key164" UNIQUE (email);


--
-- Name: User User_email_key165; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key165" UNIQUE (email);


--
-- Name: User User_email_key166; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key166" UNIQUE (email);


--
-- Name: User User_email_key167; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key167" UNIQUE (email);


--
-- Name: User User_email_key168; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key168" UNIQUE (email);


--
-- Name: User User_email_key169; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key169" UNIQUE (email);


--
-- Name: User User_email_key17; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key17" UNIQUE (email);


--
-- Name: User User_email_key170; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key170" UNIQUE (email);


--
-- Name: User User_email_key171; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key171" UNIQUE (email);


--
-- Name: User User_email_key172; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key172" UNIQUE (email);


--
-- Name: User User_email_key173; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key173" UNIQUE (email);


--
-- Name: User User_email_key174; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key174" UNIQUE (email);


--
-- Name: User User_email_key175; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key175" UNIQUE (email);


--
-- Name: User User_email_key176; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key176" UNIQUE (email);


--
-- Name: User User_email_key177; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key177" UNIQUE (email);


--
-- Name: User User_email_key178; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key178" UNIQUE (email);


--
-- Name: User User_email_key179; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key179" UNIQUE (email);


--
-- Name: User User_email_key18; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key18" UNIQUE (email);


--
-- Name: User User_email_key180; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key180" UNIQUE (email);


--
-- Name: User User_email_key181; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key181" UNIQUE (email);


--
-- Name: User User_email_key182; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key182" UNIQUE (email);


--
-- Name: User User_email_key183; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key183" UNIQUE (email);


--
-- Name: User User_email_key184; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key184" UNIQUE (email);


--
-- Name: User User_email_key185; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key185" UNIQUE (email);


--
-- Name: User User_email_key186; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key186" UNIQUE (email);


--
-- Name: User User_email_key187; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key187" UNIQUE (email);


--
-- Name: User User_email_key188; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key188" UNIQUE (email);


--
-- Name: User User_email_key189; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key189" UNIQUE (email);


--
-- Name: User User_email_key19; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key19" UNIQUE (email);


--
-- Name: User User_email_key190; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key190" UNIQUE (email);


--
-- Name: User User_email_key191; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key191" UNIQUE (email);


--
-- Name: User User_email_key192; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key192" UNIQUE (email);


--
-- Name: User User_email_key193; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key193" UNIQUE (email);


--
-- Name: User User_email_key194; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key194" UNIQUE (email);


--
-- Name: User User_email_key195; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key195" UNIQUE (email);


--
-- Name: User User_email_key196; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key196" UNIQUE (email);


--
-- Name: User User_email_key197; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key197" UNIQUE (email);


--
-- Name: User User_email_key198; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key198" UNIQUE (email);


--
-- Name: User User_email_key199; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key199" UNIQUE (email);


--
-- Name: User User_email_key2; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key2" UNIQUE (email);


--
-- Name: User User_email_key20; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key20" UNIQUE (email);


--
-- Name: User User_email_key200; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key200" UNIQUE (email);


--
-- Name: User User_email_key201; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key201" UNIQUE (email);


--
-- Name: User User_email_key202; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key202" UNIQUE (email);


--
-- Name: User User_email_key203; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key203" UNIQUE (email);


--
-- Name: User User_email_key204; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key204" UNIQUE (email);


--
-- Name: User User_email_key205; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key205" UNIQUE (email);


--
-- Name: User User_email_key206; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key206" UNIQUE (email);


--
-- Name: User User_email_key207; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key207" UNIQUE (email);


--
-- Name: User User_email_key208; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key208" UNIQUE (email);


--
-- Name: User User_email_key209; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key209" UNIQUE (email);


--
-- Name: User User_email_key21; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key21" UNIQUE (email);


--
-- Name: User User_email_key210; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key210" UNIQUE (email);


--
-- Name: User User_email_key211; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key211" UNIQUE (email);


--
-- Name: User User_email_key212; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key212" UNIQUE (email);


--
-- Name: User User_email_key213; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key213" UNIQUE (email);


--
-- Name: User User_email_key214; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key214" UNIQUE (email);


--
-- Name: User User_email_key215; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key215" UNIQUE (email);


--
-- Name: User User_email_key216; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key216" UNIQUE (email);


--
-- Name: User User_email_key217; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key217" UNIQUE (email);


--
-- Name: User User_email_key218; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key218" UNIQUE (email);


--
-- Name: User User_email_key219; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key219" UNIQUE (email);


--
-- Name: User User_email_key22; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key22" UNIQUE (email);


--
-- Name: User User_email_key220; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key220" UNIQUE (email);


--
-- Name: User User_email_key221; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key221" UNIQUE (email);


--
-- Name: User User_email_key222; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key222" UNIQUE (email);


--
-- Name: User User_email_key223; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key223" UNIQUE (email);


--
-- Name: User User_email_key224; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key224" UNIQUE (email);


--
-- Name: User User_email_key225; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key225" UNIQUE (email);


--
-- Name: User User_email_key226; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key226" UNIQUE (email);


--
-- Name: User User_email_key227; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key227" UNIQUE (email);


--
-- Name: User User_email_key228; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key228" UNIQUE (email);


--
-- Name: User User_email_key229; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key229" UNIQUE (email);


--
-- Name: User User_email_key23; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key23" UNIQUE (email);


--
-- Name: User User_email_key230; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key230" UNIQUE (email);


--
-- Name: User User_email_key231; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key231" UNIQUE (email);


--
-- Name: User User_email_key232; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key232" UNIQUE (email);


--
-- Name: User User_email_key233; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key233" UNIQUE (email);


--
-- Name: User User_email_key234; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key234" UNIQUE (email);


--
-- Name: User User_email_key235; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key235" UNIQUE (email);


--
-- Name: User User_email_key236; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key236" UNIQUE (email);


--
-- Name: User User_email_key237; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key237" UNIQUE (email);


--
-- Name: User User_email_key238; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key238" UNIQUE (email);


--
-- Name: User User_email_key239; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key239" UNIQUE (email);


--
-- Name: User User_email_key24; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key24" UNIQUE (email);


--
-- Name: User User_email_key240; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key240" UNIQUE (email);


--
-- Name: User User_email_key241; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key241" UNIQUE (email);


--
-- Name: User User_email_key242; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key242" UNIQUE (email);


--
-- Name: User User_email_key243; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key243" UNIQUE (email);


--
-- Name: User User_email_key244; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key244" UNIQUE (email);


--
-- Name: User User_email_key245; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key245" UNIQUE (email);


--
-- Name: User User_email_key246; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key246" UNIQUE (email);


--
-- Name: User User_email_key247; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key247" UNIQUE (email);


--
-- Name: User User_email_key248; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key248" UNIQUE (email);


--
-- Name: User User_email_key249; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key249" UNIQUE (email);


--
-- Name: User User_email_key25; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key25" UNIQUE (email);


--
-- Name: User User_email_key250; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key250" UNIQUE (email);


--
-- Name: User User_email_key251; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key251" UNIQUE (email);


--
-- Name: User User_email_key252; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key252" UNIQUE (email);


--
-- Name: User User_email_key253; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key253" UNIQUE (email);


--
-- Name: User User_email_key254; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key254" UNIQUE (email);


--
-- Name: User User_email_key255; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key255" UNIQUE (email);


--
-- Name: User User_email_key256; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key256" UNIQUE (email);


--
-- Name: User User_email_key257; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key257" UNIQUE (email);


--
-- Name: User User_email_key258; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key258" UNIQUE (email);


--
-- Name: User User_email_key259; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key259" UNIQUE (email);


--
-- Name: User User_email_key26; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key26" UNIQUE (email);


--
-- Name: User User_email_key260; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key260" UNIQUE (email);


--
-- Name: User User_email_key261; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key261" UNIQUE (email);


--
-- Name: User User_email_key262; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key262" UNIQUE (email);


--
-- Name: User User_email_key263; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key263" UNIQUE (email);


--
-- Name: User User_email_key264; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key264" UNIQUE (email);


--
-- Name: User User_email_key265; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key265" UNIQUE (email);


--
-- Name: User User_email_key266; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key266" UNIQUE (email);


--
-- Name: User User_email_key267; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key267" UNIQUE (email);


--
-- Name: User User_email_key268; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key268" UNIQUE (email);


--
-- Name: User User_email_key269; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key269" UNIQUE (email);


--
-- Name: User User_email_key27; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key27" UNIQUE (email);


--
-- Name: User User_email_key270; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key270" UNIQUE (email);


--
-- Name: User User_email_key271; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key271" UNIQUE (email);


--
-- Name: User User_email_key272; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key272" UNIQUE (email);


--
-- Name: User User_email_key273; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key273" UNIQUE (email);


--
-- Name: User User_email_key274; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key274" UNIQUE (email);


--
-- Name: User User_email_key275; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key275" UNIQUE (email);


--
-- Name: User User_email_key276; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key276" UNIQUE (email);


--
-- Name: User User_email_key277; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key277" UNIQUE (email);


--
-- Name: User User_email_key278; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key278" UNIQUE (email);


--
-- Name: User User_email_key279; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key279" UNIQUE (email);


--
-- Name: User User_email_key28; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key28" UNIQUE (email);


--
-- Name: User User_email_key280; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key280" UNIQUE (email);


--
-- Name: User User_email_key281; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key281" UNIQUE (email);


--
-- Name: User User_email_key282; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key282" UNIQUE (email);


--
-- Name: User User_email_key283; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key283" UNIQUE (email);


--
-- Name: User User_email_key284; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key284" UNIQUE (email);


--
-- Name: User User_email_key285; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key285" UNIQUE (email);


--
-- Name: User User_email_key286; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key286" UNIQUE (email);


--
-- Name: User User_email_key287; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key287" UNIQUE (email);


--
-- Name: User User_email_key288; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key288" UNIQUE (email);


--
-- Name: User User_email_key289; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key289" UNIQUE (email);


--
-- Name: User User_email_key29; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key29" UNIQUE (email);


--
-- Name: User User_email_key290; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key290" UNIQUE (email);


--
-- Name: User User_email_key291; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key291" UNIQUE (email);


--
-- Name: User User_email_key292; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key292" UNIQUE (email);


--
-- Name: User User_email_key293; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key293" UNIQUE (email);


--
-- Name: User User_email_key294; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key294" UNIQUE (email);


--
-- Name: User User_email_key295; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key295" UNIQUE (email);


--
-- Name: User User_email_key296; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key296" UNIQUE (email);


--
-- Name: User User_email_key297; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key297" UNIQUE (email);


--
-- Name: User User_email_key298; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key298" UNIQUE (email);


--
-- Name: User User_email_key299; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key299" UNIQUE (email);


--
-- Name: User User_email_key3; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key3" UNIQUE (email);


--
-- Name: User User_email_key30; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key30" UNIQUE (email);


--
-- Name: User User_email_key300; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key300" UNIQUE (email);


--
-- Name: User User_email_key301; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key301" UNIQUE (email);


--
-- Name: User User_email_key302; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key302" UNIQUE (email);


--
-- Name: User User_email_key303; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key303" UNIQUE (email);


--
-- Name: User User_email_key304; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key304" UNIQUE (email);


--
-- Name: User User_email_key305; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key305" UNIQUE (email);


--
-- Name: User User_email_key306; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key306" UNIQUE (email);


--
-- Name: User User_email_key307; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key307" UNIQUE (email);


--
-- Name: User User_email_key308; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key308" UNIQUE (email);


--
-- Name: User User_email_key309; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key309" UNIQUE (email);


--
-- Name: User User_email_key31; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key31" UNIQUE (email);


--
-- Name: User User_email_key310; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key310" UNIQUE (email);


--
-- Name: User User_email_key311; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key311" UNIQUE (email);


--
-- Name: User User_email_key312; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key312" UNIQUE (email);


--
-- Name: User User_email_key313; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key313" UNIQUE (email);


--
-- Name: User User_email_key314; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key314" UNIQUE (email);


--
-- Name: User User_email_key315; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key315" UNIQUE (email);


--
-- Name: User User_email_key316; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key316" UNIQUE (email);


--
-- Name: User User_email_key317; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key317" UNIQUE (email);


--
-- Name: User User_email_key318; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key318" UNIQUE (email);


--
-- Name: User User_email_key319; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key319" UNIQUE (email);


--
-- Name: User User_email_key32; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key32" UNIQUE (email);


--
-- Name: User User_email_key320; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key320" UNIQUE (email);


--
-- Name: User User_email_key321; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key321" UNIQUE (email);


--
-- Name: User User_email_key322; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key322" UNIQUE (email);


--
-- Name: User User_email_key323; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key323" UNIQUE (email);


--
-- Name: User User_email_key324; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key324" UNIQUE (email);


--
-- Name: User User_email_key325; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key325" UNIQUE (email);


--
-- Name: User User_email_key326; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key326" UNIQUE (email);


--
-- Name: User User_email_key327; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key327" UNIQUE (email);


--
-- Name: User User_email_key328; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key328" UNIQUE (email);


--
-- Name: User User_email_key329; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key329" UNIQUE (email);


--
-- Name: User User_email_key33; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key33" UNIQUE (email);


--
-- Name: User User_email_key330; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key330" UNIQUE (email);


--
-- Name: User User_email_key331; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key331" UNIQUE (email);


--
-- Name: User User_email_key332; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key332" UNIQUE (email);


--
-- Name: User User_email_key333; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key333" UNIQUE (email);


--
-- Name: User User_email_key334; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key334" UNIQUE (email);


--
-- Name: User User_email_key335; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key335" UNIQUE (email);


--
-- Name: User User_email_key336; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key336" UNIQUE (email);


--
-- Name: User User_email_key337; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key337" UNIQUE (email);


--
-- Name: User User_email_key338; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key338" UNIQUE (email);


--
-- Name: User User_email_key339; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key339" UNIQUE (email);


--
-- Name: User User_email_key34; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key34" UNIQUE (email);


--
-- Name: User User_email_key340; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key340" UNIQUE (email);


--
-- Name: User User_email_key341; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key341" UNIQUE (email);


--
-- Name: User User_email_key342; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key342" UNIQUE (email);


--
-- Name: User User_email_key343; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key343" UNIQUE (email);


--
-- Name: User User_email_key344; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key344" UNIQUE (email);


--
-- Name: User User_email_key345; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key345" UNIQUE (email);


--
-- Name: User User_email_key346; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key346" UNIQUE (email);


--
-- Name: User User_email_key347; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key347" UNIQUE (email);


--
-- Name: User User_email_key348; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key348" UNIQUE (email);


--
-- Name: User User_email_key349; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key349" UNIQUE (email);


--
-- Name: User User_email_key35; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key35" UNIQUE (email);


--
-- Name: User User_email_key350; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key350" UNIQUE (email);


--
-- Name: User User_email_key351; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key351" UNIQUE (email);


--
-- Name: User User_email_key352; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key352" UNIQUE (email);


--
-- Name: User User_email_key353; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key353" UNIQUE (email);


--
-- Name: User User_email_key354; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key354" UNIQUE (email);


--
-- Name: User User_email_key355; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key355" UNIQUE (email);


--
-- Name: User User_email_key356; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key356" UNIQUE (email);


--
-- Name: User User_email_key357; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key357" UNIQUE (email);


--
-- Name: User User_email_key358; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key358" UNIQUE (email);


--
-- Name: User User_email_key359; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key359" UNIQUE (email);


--
-- Name: User User_email_key36; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key36" UNIQUE (email);


--
-- Name: User User_email_key360; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key360" UNIQUE (email);


--
-- Name: User User_email_key361; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key361" UNIQUE (email);


--
-- Name: User User_email_key362; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key362" UNIQUE (email);


--
-- Name: User User_email_key363; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key363" UNIQUE (email);


--
-- Name: User User_email_key364; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key364" UNIQUE (email);


--
-- Name: User User_email_key365; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key365" UNIQUE (email);


--
-- Name: User User_email_key366; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key366" UNIQUE (email);


--
-- Name: User User_email_key367; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key367" UNIQUE (email);


--
-- Name: User User_email_key368; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key368" UNIQUE (email);


--
-- Name: User User_email_key369; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key369" UNIQUE (email);


--
-- Name: User User_email_key37; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key37" UNIQUE (email);


--
-- Name: User User_email_key370; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key370" UNIQUE (email);


--
-- Name: User User_email_key371; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key371" UNIQUE (email);


--
-- Name: User User_email_key372; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key372" UNIQUE (email);


--
-- Name: User User_email_key373; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key373" UNIQUE (email);


--
-- Name: User User_email_key374; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key374" UNIQUE (email);


--
-- Name: User User_email_key375; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key375" UNIQUE (email);


--
-- Name: User User_email_key376; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key376" UNIQUE (email);


--
-- Name: User User_email_key377; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key377" UNIQUE (email);


--
-- Name: User User_email_key378; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key378" UNIQUE (email);


--
-- Name: User User_email_key379; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key379" UNIQUE (email);


--
-- Name: User User_email_key38; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key38" UNIQUE (email);


--
-- Name: User User_email_key380; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key380" UNIQUE (email);


--
-- Name: User User_email_key381; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key381" UNIQUE (email);


--
-- Name: User User_email_key382; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key382" UNIQUE (email);


--
-- Name: User User_email_key383; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key383" UNIQUE (email);


--
-- Name: User User_email_key384; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key384" UNIQUE (email);


--
-- Name: User User_email_key385; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key385" UNIQUE (email);


--
-- Name: User User_email_key386; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key386" UNIQUE (email);


--
-- Name: User User_email_key387; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key387" UNIQUE (email);


--
-- Name: User User_email_key388; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key388" UNIQUE (email);


--
-- Name: User User_email_key389; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key389" UNIQUE (email);


--
-- Name: User User_email_key39; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key39" UNIQUE (email);


--
-- Name: User User_email_key390; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key390" UNIQUE (email);


--
-- Name: User User_email_key391; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key391" UNIQUE (email);


--
-- Name: User User_email_key392; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key392" UNIQUE (email);


--
-- Name: User User_email_key393; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key393" UNIQUE (email);


--
-- Name: User User_email_key394; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key394" UNIQUE (email);


--
-- Name: User User_email_key395; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key395" UNIQUE (email);


--
-- Name: User User_email_key396; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key396" UNIQUE (email);


--
-- Name: User User_email_key397; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key397" UNIQUE (email);


--
-- Name: User User_email_key398; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key398" UNIQUE (email);


--
-- Name: User User_email_key399; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key399" UNIQUE (email);


--
-- Name: User User_email_key4; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key4" UNIQUE (email);


--
-- Name: User User_email_key40; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key40" UNIQUE (email);


--
-- Name: User User_email_key400; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key400" UNIQUE (email);


--
-- Name: User User_email_key401; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key401" UNIQUE (email);


--
-- Name: User User_email_key402; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key402" UNIQUE (email);


--
-- Name: User User_email_key403; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key403" UNIQUE (email);


--
-- Name: User User_email_key404; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key404" UNIQUE (email);


--
-- Name: User User_email_key405; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key405" UNIQUE (email);


--
-- Name: User User_email_key406; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key406" UNIQUE (email);


--
-- Name: User User_email_key407; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key407" UNIQUE (email);


--
-- Name: User User_email_key408; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key408" UNIQUE (email);


--
-- Name: User User_email_key409; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key409" UNIQUE (email);


--
-- Name: User User_email_key41; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key41" UNIQUE (email);


--
-- Name: User User_email_key410; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key410" UNIQUE (email);


--
-- Name: User User_email_key411; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key411" UNIQUE (email);


--
-- Name: User User_email_key412; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key412" UNIQUE (email);


--
-- Name: User User_email_key413; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key413" UNIQUE (email);


--
-- Name: User User_email_key414; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key414" UNIQUE (email);


--
-- Name: User User_email_key415; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key415" UNIQUE (email);


--
-- Name: User User_email_key416; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key416" UNIQUE (email);


--
-- Name: User User_email_key417; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key417" UNIQUE (email);


--
-- Name: User User_email_key418; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key418" UNIQUE (email);


--
-- Name: User User_email_key419; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key419" UNIQUE (email);


--
-- Name: User User_email_key42; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key42" UNIQUE (email);


--
-- Name: User User_email_key420; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key420" UNIQUE (email);


--
-- Name: User User_email_key421; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key421" UNIQUE (email);


--
-- Name: User User_email_key422; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key422" UNIQUE (email);


--
-- Name: User User_email_key423; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key423" UNIQUE (email);


--
-- Name: User User_email_key424; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key424" UNIQUE (email);


--
-- Name: User User_email_key425; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key425" UNIQUE (email);


--
-- Name: User User_email_key426; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key426" UNIQUE (email);


--
-- Name: User User_email_key427; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key427" UNIQUE (email);


--
-- Name: User User_email_key428; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key428" UNIQUE (email);


--
-- Name: User User_email_key429; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key429" UNIQUE (email);


--
-- Name: User User_email_key43; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key43" UNIQUE (email);


--
-- Name: User User_email_key430; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key430" UNIQUE (email);


--
-- Name: User User_email_key431; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key431" UNIQUE (email);


--
-- Name: User User_email_key432; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key432" UNIQUE (email);


--
-- Name: User User_email_key433; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key433" UNIQUE (email);


--
-- Name: User User_email_key434; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key434" UNIQUE (email);


--
-- Name: User User_email_key435; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key435" UNIQUE (email);


--
-- Name: User User_email_key436; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key436" UNIQUE (email);


--
-- Name: User User_email_key437; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key437" UNIQUE (email);


--
-- Name: User User_email_key438; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key438" UNIQUE (email);


--
-- Name: User User_email_key439; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key439" UNIQUE (email);


--
-- Name: User User_email_key44; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key44" UNIQUE (email);


--
-- Name: User User_email_key440; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key440" UNIQUE (email);


--
-- Name: User User_email_key441; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key441" UNIQUE (email);


--
-- Name: User User_email_key442; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key442" UNIQUE (email);


--
-- Name: User User_email_key443; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key443" UNIQUE (email);


--
-- Name: User User_email_key444; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key444" UNIQUE (email);


--
-- Name: User User_email_key445; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key445" UNIQUE (email);


--
-- Name: User User_email_key446; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key446" UNIQUE (email);


--
-- Name: User User_email_key447; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key447" UNIQUE (email);


--
-- Name: User User_email_key448; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key448" UNIQUE (email);


--
-- Name: User User_email_key449; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key449" UNIQUE (email);


--
-- Name: User User_email_key45; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key45" UNIQUE (email);


--
-- Name: User User_email_key450; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key450" UNIQUE (email);


--
-- Name: User User_email_key451; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key451" UNIQUE (email);


--
-- Name: User User_email_key452; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key452" UNIQUE (email);


--
-- Name: User User_email_key453; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key453" UNIQUE (email);


--
-- Name: User User_email_key454; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key454" UNIQUE (email);


--
-- Name: User User_email_key455; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key455" UNIQUE (email);


--
-- Name: User User_email_key456; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key456" UNIQUE (email);


--
-- Name: User User_email_key457; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key457" UNIQUE (email);


--
-- Name: User User_email_key458; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key458" UNIQUE (email);


--
-- Name: User User_email_key459; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key459" UNIQUE (email);


--
-- Name: User User_email_key46; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key46" UNIQUE (email);


--
-- Name: User User_email_key460; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key460" UNIQUE (email);


--
-- Name: User User_email_key461; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key461" UNIQUE (email);


--
-- Name: User User_email_key462; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key462" UNIQUE (email);


--
-- Name: User User_email_key463; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key463" UNIQUE (email);


--
-- Name: User User_email_key464; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key464" UNIQUE (email);


--
-- Name: User User_email_key465; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key465" UNIQUE (email);


--
-- Name: User User_email_key466; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key466" UNIQUE (email);


--
-- Name: User User_email_key467; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key467" UNIQUE (email);


--
-- Name: User User_email_key468; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key468" UNIQUE (email);


--
-- Name: User User_email_key469; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key469" UNIQUE (email);


--
-- Name: User User_email_key47; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key47" UNIQUE (email);


--
-- Name: User User_email_key470; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key470" UNIQUE (email);


--
-- Name: User User_email_key471; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key471" UNIQUE (email);


--
-- Name: User User_email_key472; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key472" UNIQUE (email);


--
-- Name: User User_email_key473; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key473" UNIQUE (email);


--
-- Name: User User_email_key474; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key474" UNIQUE (email);


--
-- Name: User User_email_key475; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key475" UNIQUE (email);


--
-- Name: User User_email_key476; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key476" UNIQUE (email);


--
-- Name: User User_email_key477; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key477" UNIQUE (email);


--
-- Name: User User_email_key478; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key478" UNIQUE (email);


--
-- Name: User User_email_key479; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key479" UNIQUE (email);


--
-- Name: User User_email_key48; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key48" UNIQUE (email);


--
-- Name: User User_email_key480; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key480" UNIQUE (email);


--
-- Name: User User_email_key481; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key481" UNIQUE (email);


--
-- Name: User User_email_key482; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key482" UNIQUE (email);


--
-- Name: User User_email_key483; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key483" UNIQUE (email);


--
-- Name: User User_email_key484; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key484" UNIQUE (email);


--
-- Name: User User_email_key485; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key485" UNIQUE (email);


--
-- Name: User User_email_key486; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key486" UNIQUE (email);


--
-- Name: User User_email_key487; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key487" UNIQUE (email);


--
-- Name: User User_email_key488; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key488" UNIQUE (email);


--
-- Name: User User_email_key489; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key489" UNIQUE (email);


--
-- Name: User User_email_key49; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key49" UNIQUE (email);


--
-- Name: User User_email_key490; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key490" UNIQUE (email);


--
-- Name: User User_email_key491; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key491" UNIQUE (email);


--
-- Name: User User_email_key492; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key492" UNIQUE (email);


--
-- Name: User User_email_key493; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key493" UNIQUE (email);


--
-- Name: User User_email_key494; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key494" UNIQUE (email);


--
-- Name: User User_email_key495; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key495" UNIQUE (email);


--
-- Name: User User_email_key496; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key496" UNIQUE (email);


--
-- Name: User User_email_key497; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key497" UNIQUE (email);


--
-- Name: User User_email_key498; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key498" UNIQUE (email);


--
-- Name: User User_email_key499; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key499" UNIQUE (email);


--
-- Name: User User_email_key5; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key5" UNIQUE (email);


--
-- Name: User User_email_key50; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key50" UNIQUE (email);


--
-- Name: User User_email_key500; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key500" UNIQUE (email);


--
-- Name: User User_email_key501; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key501" UNIQUE (email);


--
-- Name: User User_email_key502; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key502" UNIQUE (email);


--
-- Name: User User_email_key503; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key503" UNIQUE (email);


--
-- Name: User User_email_key504; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key504" UNIQUE (email);


--
-- Name: User User_email_key505; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key505" UNIQUE (email);


--
-- Name: User User_email_key506; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key506" UNIQUE (email);


--
-- Name: User User_email_key507; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key507" UNIQUE (email);


--
-- Name: User User_email_key508; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key508" UNIQUE (email);


--
-- Name: User User_email_key509; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key509" UNIQUE (email);


--
-- Name: User User_email_key51; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key51" UNIQUE (email);


--
-- Name: User User_email_key510; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key510" UNIQUE (email);


--
-- Name: User User_email_key511; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key511" UNIQUE (email);


--
-- Name: User User_email_key512; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key512" UNIQUE (email);


--
-- Name: User User_email_key513; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key513" UNIQUE (email);


--
-- Name: User User_email_key514; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key514" UNIQUE (email);


--
-- Name: User User_email_key515; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key515" UNIQUE (email);


--
-- Name: User User_email_key516; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key516" UNIQUE (email);


--
-- Name: User User_email_key517; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key517" UNIQUE (email);


--
-- Name: User User_email_key518; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key518" UNIQUE (email);


--
-- Name: User User_email_key519; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key519" UNIQUE (email);


--
-- Name: User User_email_key52; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key52" UNIQUE (email);


--
-- Name: User User_email_key520; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key520" UNIQUE (email);


--
-- Name: User User_email_key521; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key521" UNIQUE (email);


--
-- Name: User User_email_key522; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key522" UNIQUE (email);


--
-- Name: User User_email_key523; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key523" UNIQUE (email);


--
-- Name: User User_email_key524; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key524" UNIQUE (email);


--
-- Name: User User_email_key525; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key525" UNIQUE (email);


--
-- Name: User User_email_key526; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key526" UNIQUE (email);


--
-- Name: User User_email_key527; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key527" UNIQUE (email);


--
-- Name: User User_email_key528; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key528" UNIQUE (email);


--
-- Name: User User_email_key529; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key529" UNIQUE (email);


--
-- Name: User User_email_key53; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key53" UNIQUE (email);


--
-- Name: User User_email_key530; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key530" UNIQUE (email);


--
-- Name: User User_email_key531; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key531" UNIQUE (email);


--
-- Name: User User_email_key532; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key532" UNIQUE (email);


--
-- Name: User User_email_key533; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key533" UNIQUE (email);


--
-- Name: User User_email_key534; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key534" UNIQUE (email);


--
-- Name: User User_email_key535; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key535" UNIQUE (email);


--
-- Name: User User_email_key536; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key536" UNIQUE (email);


--
-- Name: User User_email_key537; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key537" UNIQUE (email);


--
-- Name: User User_email_key538; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key538" UNIQUE (email);


--
-- Name: User User_email_key539; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key539" UNIQUE (email);


--
-- Name: User User_email_key54; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key54" UNIQUE (email);


--
-- Name: User User_email_key540; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key540" UNIQUE (email);


--
-- Name: User User_email_key541; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key541" UNIQUE (email);


--
-- Name: User User_email_key542; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key542" UNIQUE (email);


--
-- Name: User User_email_key543; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key543" UNIQUE (email);


--
-- Name: User User_email_key544; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key544" UNIQUE (email);


--
-- Name: User User_email_key545; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key545" UNIQUE (email);


--
-- Name: User User_email_key546; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key546" UNIQUE (email);


--
-- Name: User User_email_key547; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key547" UNIQUE (email);


--
-- Name: User User_email_key548; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key548" UNIQUE (email);


--
-- Name: User User_email_key549; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key549" UNIQUE (email);


--
-- Name: User User_email_key55; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key55" UNIQUE (email);


--
-- Name: User User_email_key550; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key550" UNIQUE (email);


--
-- Name: User User_email_key551; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key551" UNIQUE (email);


--
-- Name: User User_email_key552; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key552" UNIQUE (email);


--
-- Name: User User_email_key553; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key553" UNIQUE (email);


--
-- Name: User User_email_key554; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key554" UNIQUE (email);


--
-- Name: User User_email_key555; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key555" UNIQUE (email);


--
-- Name: User User_email_key556; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key556" UNIQUE (email);


--
-- Name: User User_email_key557; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key557" UNIQUE (email);


--
-- Name: User User_email_key558; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key558" UNIQUE (email);


--
-- Name: User User_email_key559; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key559" UNIQUE (email);


--
-- Name: User User_email_key56; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key56" UNIQUE (email);


--
-- Name: User User_email_key560; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key560" UNIQUE (email);


--
-- Name: User User_email_key561; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key561" UNIQUE (email);


--
-- Name: User User_email_key562; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key562" UNIQUE (email);


--
-- Name: User User_email_key563; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key563" UNIQUE (email);


--
-- Name: User User_email_key564; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key564" UNIQUE (email);


--
-- Name: User User_email_key565; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key565" UNIQUE (email);


--
-- Name: User User_email_key566; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key566" UNIQUE (email);


--
-- Name: User User_email_key567; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key567" UNIQUE (email);


--
-- Name: User User_email_key568; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key568" UNIQUE (email);


--
-- Name: User User_email_key569; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key569" UNIQUE (email);


--
-- Name: User User_email_key57; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key57" UNIQUE (email);


--
-- Name: User User_email_key570; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key570" UNIQUE (email);


--
-- Name: User User_email_key571; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key571" UNIQUE (email);


--
-- Name: User User_email_key572; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key572" UNIQUE (email);


--
-- Name: User User_email_key573; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key573" UNIQUE (email);


--
-- Name: User User_email_key574; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key574" UNIQUE (email);


--
-- Name: User User_email_key575; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key575" UNIQUE (email);


--
-- Name: User User_email_key576; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key576" UNIQUE (email);


--
-- Name: User User_email_key577; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key577" UNIQUE (email);


--
-- Name: User User_email_key578; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key578" UNIQUE (email);


--
-- Name: User User_email_key579; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key579" UNIQUE (email);


--
-- Name: User User_email_key58; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key58" UNIQUE (email);


--
-- Name: User User_email_key580; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key580" UNIQUE (email);


--
-- Name: User User_email_key581; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key581" UNIQUE (email);


--
-- Name: User User_email_key582; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key582" UNIQUE (email);


--
-- Name: User User_email_key583; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key583" UNIQUE (email);


--
-- Name: User User_email_key584; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key584" UNIQUE (email);


--
-- Name: User User_email_key585; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key585" UNIQUE (email);


--
-- Name: User User_email_key586; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key586" UNIQUE (email);


--
-- Name: User User_email_key587; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key587" UNIQUE (email);


--
-- Name: User User_email_key588; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key588" UNIQUE (email);


--
-- Name: User User_email_key589; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key589" UNIQUE (email);


--
-- Name: User User_email_key59; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key59" UNIQUE (email);


--
-- Name: User User_email_key590; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key590" UNIQUE (email);


--
-- Name: User User_email_key591; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key591" UNIQUE (email);


--
-- Name: User User_email_key592; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key592" UNIQUE (email);


--
-- Name: User User_email_key593; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key593" UNIQUE (email);


--
-- Name: User User_email_key594; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key594" UNIQUE (email);


--
-- Name: User User_email_key595; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key595" UNIQUE (email);


--
-- Name: User User_email_key596; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key596" UNIQUE (email);


--
-- Name: User User_email_key597; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key597" UNIQUE (email);


--
-- Name: User User_email_key598; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key598" UNIQUE (email);


--
-- Name: User User_email_key599; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key599" UNIQUE (email);


--
-- Name: User User_email_key6; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key6" UNIQUE (email);


--
-- Name: User User_email_key60; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key60" UNIQUE (email);


--
-- Name: User User_email_key600; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key600" UNIQUE (email);


--
-- Name: User User_email_key601; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key601" UNIQUE (email);


--
-- Name: User User_email_key602; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key602" UNIQUE (email);


--
-- Name: User User_email_key603; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key603" UNIQUE (email);


--
-- Name: User User_email_key604; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key604" UNIQUE (email);


--
-- Name: User User_email_key605; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key605" UNIQUE (email);


--
-- Name: User User_email_key606; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key606" UNIQUE (email);


--
-- Name: User User_email_key607; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key607" UNIQUE (email);


--
-- Name: User User_email_key608; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key608" UNIQUE (email);


--
-- Name: User User_email_key609; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key609" UNIQUE (email);


--
-- Name: User User_email_key61; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key61" UNIQUE (email);


--
-- Name: User User_email_key610; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key610" UNIQUE (email);


--
-- Name: User User_email_key611; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key611" UNIQUE (email);


--
-- Name: User User_email_key612; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key612" UNIQUE (email);


--
-- Name: User User_email_key613; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key613" UNIQUE (email);


--
-- Name: User User_email_key614; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key614" UNIQUE (email);


--
-- Name: User User_email_key615; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key615" UNIQUE (email);


--
-- Name: User User_email_key616; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key616" UNIQUE (email);


--
-- Name: User User_email_key617; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key617" UNIQUE (email);


--
-- Name: User User_email_key618; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key618" UNIQUE (email);


--
-- Name: User User_email_key619; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key619" UNIQUE (email);


--
-- Name: User User_email_key62; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key62" UNIQUE (email);


--
-- Name: User User_email_key620; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key620" UNIQUE (email);


--
-- Name: User User_email_key621; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key621" UNIQUE (email);


--
-- Name: User User_email_key622; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key622" UNIQUE (email);


--
-- Name: User User_email_key623; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key623" UNIQUE (email);


--
-- Name: User User_email_key624; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key624" UNIQUE (email);


--
-- Name: User User_email_key625; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key625" UNIQUE (email);


--
-- Name: User User_email_key626; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key626" UNIQUE (email);


--
-- Name: User User_email_key627; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key627" UNIQUE (email);


--
-- Name: User User_email_key628; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key628" UNIQUE (email);


--
-- Name: User User_email_key629; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key629" UNIQUE (email);


--
-- Name: User User_email_key63; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key63" UNIQUE (email);


--
-- Name: User User_email_key630; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key630" UNIQUE (email);


--
-- Name: User User_email_key631; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key631" UNIQUE (email);


--
-- Name: User User_email_key632; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key632" UNIQUE (email);


--
-- Name: User User_email_key633; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key633" UNIQUE (email);


--
-- Name: User User_email_key634; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key634" UNIQUE (email);


--
-- Name: User User_email_key635; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key635" UNIQUE (email);


--
-- Name: User User_email_key636; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key636" UNIQUE (email);


--
-- Name: User User_email_key637; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key637" UNIQUE (email);


--
-- Name: User User_email_key638; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key638" UNIQUE (email);


--
-- Name: User User_email_key639; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key639" UNIQUE (email);


--
-- Name: User User_email_key64; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key64" UNIQUE (email);


--
-- Name: User User_email_key640; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key640" UNIQUE (email);


--
-- Name: User User_email_key641; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key641" UNIQUE (email);


--
-- Name: User User_email_key642; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key642" UNIQUE (email);


--
-- Name: User User_email_key643; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key643" UNIQUE (email);


--
-- Name: User User_email_key644; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key644" UNIQUE (email);


--
-- Name: User User_email_key645; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key645" UNIQUE (email);


--
-- Name: User User_email_key646; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key646" UNIQUE (email);


--
-- Name: User User_email_key647; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key647" UNIQUE (email);


--
-- Name: User User_email_key648; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key648" UNIQUE (email);


--
-- Name: User User_email_key649; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key649" UNIQUE (email);


--
-- Name: User User_email_key65; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key65" UNIQUE (email);


--
-- Name: User User_email_key650; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key650" UNIQUE (email);


--
-- Name: User User_email_key651; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key651" UNIQUE (email);


--
-- Name: User User_email_key652; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key652" UNIQUE (email);


--
-- Name: User User_email_key653; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key653" UNIQUE (email);


--
-- Name: User User_email_key654; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key654" UNIQUE (email);


--
-- Name: User User_email_key655; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key655" UNIQUE (email);


--
-- Name: User User_email_key656; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key656" UNIQUE (email);


--
-- Name: User User_email_key657; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key657" UNIQUE (email);


--
-- Name: User User_email_key658; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key658" UNIQUE (email);


--
-- Name: User User_email_key659; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key659" UNIQUE (email);


--
-- Name: User User_email_key66; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key66" UNIQUE (email);


--
-- Name: User User_email_key660; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key660" UNIQUE (email);


--
-- Name: User User_email_key661; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key661" UNIQUE (email);


--
-- Name: User User_email_key662; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key662" UNIQUE (email);


--
-- Name: User User_email_key663; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key663" UNIQUE (email);


--
-- Name: User User_email_key664; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key664" UNIQUE (email);


--
-- Name: User User_email_key665; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key665" UNIQUE (email);


--
-- Name: User User_email_key666; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key666" UNIQUE (email);


--
-- Name: User User_email_key667; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key667" UNIQUE (email);


--
-- Name: User User_email_key668; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key668" UNIQUE (email);


--
-- Name: User User_email_key669; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key669" UNIQUE (email);


--
-- Name: User User_email_key67; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key67" UNIQUE (email);


--
-- Name: User User_email_key670; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key670" UNIQUE (email);


--
-- Name: User User_email_key671; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key671" UNIQUE (email);


--
-- Name: User User_email_key672; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key672" UNIQUE (email);


--
-- Name: User User_email_key673; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key673" UNIQUE (email);


--
-- Name: User User_email_key674; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key674" UNIQUE (email);


--
-- Name: User User_email_key675; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key675" UNIQUE (email);


--
-- Name: User User_email_key676; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key676" UNIQUE (email);


--
-- Name: User User_email_key677; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key677" UNIQUE (email);


--
-- Name: User User_email_key678; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key678" UNIQUE (email);


--
-- Name: User User_email_key679; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key679" UNIQUE (email);


--
-- Name: User User_email_key68; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key68" UNIQUE (email);


--
-- Name: User User_email_key680; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key680" UNIQUE (email);


--
-- Name: User User_email_key681; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key681" UNIQUE (email);


--
-- Name: User User_email_key682; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key682" UNIQUE (email);


--
-- Name: User User_email_key683; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key683" UNIQUE (email);


--
-- Name: User User_email_key684; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key684" UNIQUE (email);


--
-- Name: User User_email_key685; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key685" UNIQUE (email);


--
-- Name: User User_email_key686; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key686" UNIQUE (email);


--
-- Name: User User_email_key687; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key687" UNIQUE (email);


--
-- Name: User User_email_key688; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key688" UNIQUE (email);


--
-- Name: User User_email_key689; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key689" UNIQUE (email);


--
-- Name: User User_email_key69; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key69" UNIQUE (email);


--
-- Name: User User_email_key690; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key690" UNIQUE (email);


--
-- Name: User User_email_key691; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key691" UNIQUE (email);


--
-- Name: User User_email_key692; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key692" UNIQUE (email);


--
-- Name: User User_email_key693; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key693" UNIQUE (email);


--
-- Name: User User_email_key694; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key694" UNIQUE (email);


--
-- Name: User User_email_key695; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key695" UNIQUE (email);


--
-- Name: User User_email_key696; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key696" UNIQUE (email);


--
-- Name: User User_email_key697; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key697" UNIQUE (email);


--
-- Name: User User_email_key698; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key698" UNIQUE (email);


--
-- Name: User User_email_key699; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key699" UNIQUE (email);


--
-- Name: User User_email_key7; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key7" UNIQUE (email);


--
-- Name: User User_email_key70; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key70" UNIQUE (email);


--
-- Name: User User_email_key700; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key700" UNIQUE (email);


--
-- Name: User User_email_key701; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key701" UNIQUE (email);


--
-- Name: User User_email_key702; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key702" UNIQUE (email);


--
-- Name: User User_email_key703; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key703" UNIQUE (email);


--
-- Name: User User_email_key704; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key704" UNIQUE (email);


--
-- Name: User User_email_key705; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key705" UNIQUE (email);


--
-- Name: User User_email_key706; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key706" UNIQUE (email);


--
-- Name: User User_email_key707; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key707" UNIQUE (email);


--
-- Name: User User_email_key708; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key708" UNIQUE (email);


--
-- Name: User User_email_key709; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key709" UNIQUE (email);


--
-- Name: User User_email_key71; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key71" UNIQUE (email);


--
-- Name: User User_email_key710; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key710" UNIQUE (email);


--
-- Name: User User_email_key711; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key711" UNIQUE (email);


--
-- Name: User User_email_key712; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key712" UNIQUE (email);


--
-- Name: User User_email_key713; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key713" UNIQUE (email);


--
-- Name: User User_email_key714; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key714" UNIQUE (email);


--
-- Name: User User_email_key715; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key715" UNIQUE (email);


--
-- Name: User User_email_key716; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key716" UNIQUE (email);


--
-- Name: User User_email_key717; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key717" UNIQUE (email);


--
-- Name: User User_email_key718; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key718" UNIQUE (email);


--
-- Name: User User_email_key719; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key719" UNIQUE (email);


--
-- Name: User User_email_key72; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key72" UNIQUE (email);


--
-- Name: User User_email_key720; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key720" UNIQUE (email);


--
-- Name: User User_email_key721; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key721" UNIQUE (email);


--
-- Name: User User_email_key722; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key722" UNIQUE (email);


--
-- Name: User User_email_key723; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key723" UNIQUE (email);


--
-- Name: User User_email_key724; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key724" UNIQUE (email);


--
-- Name: User User_email_key725; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key725" UNIQUE (email);


--
-- Name: User User_email_key726; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key726" UNIQUE (email);


--
-- Name: User User_email_key727; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key727" UNIQUE (email);


--
-- Name: User User_email_key728; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key728" UNIQUE (email);


--
-- Name: User User_email_key729; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key729" UNIQUE (email);


--
-- Name: User User_email_key73; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key73" UNIQUE (email);


--
-- Name: User User_email_key730; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key730" UNIQUE (email);


--
-- Name: User User_email_key731; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key731" UNIQUE (email);


--
-- Name: User User_email_key732; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key732" UNIQUE (email);


--
-- Name: User User_email_key733; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key733" UNIQUE (email);


--
-- Name: User User_email_key734; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key734" UNIQUE (email);


--
-- Name: User User_email_key735; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key735" UNIQUE (email);


--
-- Name: User User_email_key736; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key736" UNIQUE (email);


--
-- Name: User User_email_key737; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key737" UNIQUE (email);


--
-- Name: User User_email_key738; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key738" UNIQUE (email);


--
-- Name: User User_email_key739; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key739" UNIQUE (email);


--
-- Name: User User_email_key74; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key74" UNIQUE (email);


--
-- Name: User User_email_key740; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key740" UNIQUE (email);


--
-- Name: User User_email_key741; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key741" UNIQUE (email);


--
-- Name: User User_email_key742; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key742" UNIQUE (email);


--
-- Name: User User_email_key743; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key743" UNIQUE (email);


--
-- Name: User User_email_key744; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key744" UNIQUE (email);


--
-- Name: User User_email_key745; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key745" UNIQUE (email);


--
-- Name: User User_email_key746; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key746" UNIQUE (email);


--
-- Name: User User_email_key747; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key747" UNIQUE (email);


--
-- Name: User User_email_key748; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key748" UNIQUE (email);


--
-- Name: User User_email_key749; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key749" UNIQUE (email);


--
-- Name: User User_email_key75; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key75" UNIQUE (email);


--
-- Name: User User_email_key750; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key750" UNIQUE (email);


--
-- Name: User User_email_key751; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key751" UNIQUE (email);


--
-- Name: User User_email_key752; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key752" UNIQUE (email);


--
-- Name: User User_email_key753; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key753" UNIQUE (email);


--
-- Name: User User_email_key754; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key754" UNIQUE (email);


--
-- Name: User User_email_key755; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key755" UNIQUE (email);


--
-- Name: User User_email_key756; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key756" UNIQUE (email);


--
-- Name: User User_email_key757; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key757" UNIQUE (email);


--
-- Name: User User_email_key758; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key758" UNIQUE (email);


--
-- Name: User User_email_key759; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key759" UNIQUE (email);


--
-- Name: User User_email_key76; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key76" UNIQUE (email);


--
-- Name: User User_email_key760; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key760" UNIQUE (email);


--
-- Name: User User_email_key761; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key761" UNIQUE (email);


--
-- Name: User User_email_key762; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key762" UNIQUE (email);


--
-- Name: User User_email_key763; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key763" UNIQUE (email);


--
-- Name: User User_email_key764; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key764" UNIQUE (email);


--
-- Name: User User_email_key765; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key765" UNIQUE (email);


--
-- Name: User User_email_key766; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key766" UNIQUE (email);


--
-- Name: User User_email_key767; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key767" UNIQUE (email);


--
-- Name: User User_email_key768; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key768" UNIQUE (email);


--
-- Name: User User_email_key769; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key769" UNIQUE (email);


--
-- Name: User User_email_key77; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key77" UNIQUE (email);


--
-- Name: User User_email_key770; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key770" UNIQUE (email);


--
-- Name: User User_email_key771; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key771" UNIQUE (email);


--
-- Name: User User_email_key772; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key772" UNIQUE (email);


--
-- Name: User User_email_key773; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key773" UNIQUE (email);


--
-- Name: User User_email_key774; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key774" UNIQUE (email);


--
-- Name: User User_email_key775; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key775" UNIQUE (email);


--
-- Name: User User_email_key776; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key776" UNIQUE (email);


--
-- Name: User User_email_key777; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key777" UNIQUE (email);


--
-- Name: User User_email_key778; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key778" UNIQUE (email);


--
-- Name: User User_email_key779; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key779" UNIQUE (email);


--
-- Name: User User_email_key78; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key78" UNIQUE (email);


--
-- Name: User User_email_key780; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key780" UNIQUE (email);


--
-- Name: User User_email_key781; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key781" UNIQUE (email);


--
-- Name: User User_email_key782; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key782" UNIQUE (email);


--
-- Name: User User_email_key783; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key783" UNIQUE (email);


--
-- Name: User User_email_key784; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key784" UNIQUE (email);


--
-- Name: User User_email_key785; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key785" UNIQUE (email);


--
-- Name: User User_email_key786; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key786" UNIQUE (email);


--
-- Name: User User_email_key787; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key787" UNIQUE (email);


--
-- Name: User User_email_key788; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key788" UNIQUE (email);


--
-- Name: User User_email_key789; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key789" UNIQUE (email);


--
-- Name: User User_email_key79; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key79" UNIQUE (email);


--
-- Name: User User_email_key790; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key790" UNIQUE (email);


--
-- Name: User User_email_key791; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key791" UNIQUE (email);


--
-- Name: User User_email_key8; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key8" UNIQUE (email);


--
-- Name: User User_email_key80; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key80" UNIQUE (email);


--
-- Name: User User_email_key81; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key81" UNIQUE (email);


--
-- Name: User User_email_key82; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key82" UNIQUE (email);


--
-- Name: User User_email_key83; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key83" UNIQUE (email);


--
-- Name: User User_email_key84; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key84" UNIQUE (email);


--
-- Name: User User_email_key85; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key85" UNIQUE (email);


--
-- Name: User User_email_key86; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key86" UNIQUE (email);


--
-- Name: User User_email_key87; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key87" UNIQUE (email);


--
-- Name: User User_email_key88; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key88" UNIQUE (email);


--
-- Name: User User_email_key89; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key89" UNIQUE (email);


--
-- Name: User User_email_key9; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key9" UNIQUE (email);


--
-- Name: User User_email_key90; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key90" UNIQUE (email);


--
-- Name: User User_email_key91; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key91" UNIQUE (email);


--
-- Name: User User_email_key92; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key92" UNIQUE (email);


--
-- Name: User User_email_key93; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key93" UNIQUE (email);


--
-- Name: User User_email_key94; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key94" UNIQUE (email);


--
-- Name: User User_email_key95; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key95" UNIQUE (email);


--
-- Name: User User_email_key96; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key96" UNIQUE (email);


--
-- Name: User User_email_key97; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key97" UNIQUE (email);


--
-- Name: User User_email_key98; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key98" UNIQUE (email);


--
-- Name: User User_email_key99; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key99" UNIQUE (email);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: financial_reports financial_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.financial_reports
    ADD CONSTRAINT financial_reports_pkey PRIMARY KEY (id);


--
-- Name: receipt receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_pkey PRIMARY KEY (id);


--
-- Name: receipt receipt_receipt_number_key; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key1; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key1 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key10; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key10 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key11; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key11 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key12; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key12 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key13; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key13 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key2; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key2 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key3; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key3 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key4; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key4 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key5; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key5 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key6; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key6 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key7; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key7 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key8; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key8 UNIQUE (receipt_number);


--
-- Name: receipt receipt_receipt_number_key9; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_receipt_number_key9 UNIQUE (receipt_number);


--
-- Name: signatures signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_pkey PRIMARY KEY (id);


--
-- Name: student_service_preferences student_service_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.student_service_preferences
    ADD CONSTRAINT student_service_preferences_pkey PRIMARY KEY (id);


--
-- Name: student_service_preferences student_service_preferences_student_id_academic_year_key; Type: CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.student_service_preferences
    ADD CONSTRAINT student_service_preferences_student_id_academic_year_key UNIQUE (student_id, academic_year);


--
-- Name: financial_reports_created_at; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX financial_reports_created_at ON public.financial_reports USING btree (created_at);


--
-- Name: financial_reports_generated_by; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX financial_reports_generated_by ON public.financial_reports USING btree (generated_by);


--
-- Name: financial_reports_report_type; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX financial_reports_report_type ON public.financial_reports USING btree (report_type);


--
-- Name: financial_reports_school_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX financial_reports_school_id ON public.financial_reports USING btree (school_id);


--
-- Name: idx_student_service_preferences_school_year; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX idx_student_service_preferences_school_year ON public.student_service_preferences USING btree (school_id, academic_year);


--
-- Name: receipt_created_at; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX receipt_created_at ON public.receipt USING btree (created_at);


--
-- Name: receipt_payment_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX receipt_payment_id ON public.receipt USING btree (payment_id);


--
-- Name: receipt_receipt_number; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX receipt_receipt_number ON public.receipt USING btree (receipt_number);


--
-- Name: receipt_recorded_by; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX receipt_recorded_by ON public.receipt USING btree (recorded_by);


--
-- Name: receipt_school_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX receipt_school_id ON public.receipt USING btree (school_id);


--
-- Name: receipt_student_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX receipt_student_id ON public.receipt USING btree (student_id);


--
-- Name: signatures_is_active; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX signatures_is_active ON public.signatures USING btree (is_active);


--
-- Name: signatures_school_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX signatures_school_id ON public.signatures USING btree (school_id);


--
-- Name: signatures_signature_type; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX signatures_signature_type ON public.signatures USING btree (signature_type);


--
-- Name: signatures_user_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX signatures_user_id ON public.signatures USING btree (user_id);


--
-- Name: student_service_preferences_student_id_academic_year; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE UNIQUE INDEX student_service_preferences_student_id_academic_year ON public.student_service_preferences USING btree (student_id, academic_year);


--
-- Name: subscription_payment_school_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_payment_school_id ON public."SubscriptionPayment" USING btree (school_id);


--
-- Name: subscription_payment_status; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_payment_status ON public."SubscriptionPayment" USING btree (status);


--
-- Name: subscription_payment_stripe_payment_intent_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_payment_stripe_payment_intent_id ON public."SubscriptionPayment" USING btree (stripe_payment_intent_id);


--
-- Name: subscription_payment_subscription_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_payment_subscription_id ON public."SubscriptionPayment" USING btree (subscription_id);


--
-- Name: subscription_school_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_school_id ON public."Subscription" USING btree (school_id);


--
-- Name: subscription_status; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_status ON public."Subscription" USING btree (status);


--
-- Name: subscription_stripe_subscription_id; Type: INDEX; Schema: public; Owner: ecd_user
--

CREATE INDEX subscription_stripe_subscription_id ON public."Subscription" USING btree (stripe_subscription_id);


--
-- Name: Assignment Assignment_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE;


--
-- Name: Assignment Assignment_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: Assignment Assignment_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: AuditLog AuditLog_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Class Class_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: Class Class_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FeeConfiguration FeeConfiguration_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeeConfiguration"
    ADD CONSTRAINT "FeeConfiguration_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: FeePayment FeePayment_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: FeePayment FeePayment_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id);


--
-- Name: FeePayment FeePayment_student_fee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_student_fee_id_fkey" FOREIGN KEY (student_fee_id) REFERENCES public."StudentFee"(id) ON UPDATE CASCADE;


--
-- Name: FeeStructure FeeStructure_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."FeeStructure"
    ADD CONSTRAINT "FeeStructure_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: Material Material_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Material"
    ADD CONSTRAINT "Material_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: Message Message_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: Message Message_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: Message Message_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OptionalService OptionalService_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."OptionalService"
    ADD CONSTRAINT "OptionalService_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: Payment Payment_fee_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_fee_assignment_id_fkey" FOREIGN KEY (fee_assignment_id) REFERENCES public."StudentFeeAssignment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public."User"(id);


--
-- Name: Payment Payment_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id);


--
-- Name: Payment Payment_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: Progress Progress_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public."Assignment"(id) ON UPDATE CASCADE;


--
-- Name: Progress Progress_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: StudentAssignment StudentAssignment_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentAssignment"
    ADD CONSTRAINT "StudentAssignment_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public."Assignment"(id) ON UPDATE CASCADE;


--
-- Name: StudentAssignment StudentAssignment_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentAssignment"
    ADD CONSTRAINT "StudentAssignment_graded_by_fkey" FOREIGN KEY (graded_by) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: StudentAssignment StudentAssignment_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentAssignment"
    ADD CONSTRAINT "StudentAssignment_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: StudentFeeAssignment StudentFeeAssignment_fee_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFeeAssignment"
    ADD CONSTRAINT "StudentFeeAssignment_fee_configuration_id_fkey" FOREIGN KEY (fee_configuration_id) REFERENCES public."FeeConfiguration"(id) ON UPDATE CASCADE;


--
-- Name: StudentFeeAssignment StudentFeeAssignment_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFeeAssignment"
    ADD CONSTRAINT "StudentFeeAssignment_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: StudentFee StudentFee_fee_structure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFee"
    ADD CONSTRAINT "StudentFee_fee_structure_id_fkey" FOREIGN KEY (fee_structure_id) REFERENCES public."FeeStructure"(id) ON UPDATE CASCADE;


--
-- Name: StudentFee StudentFee_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFee"
    ADD CONSTRAINT "StudentFee_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id);


--
-- Name: StudentFee StudentFee_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentFee"
    ADD CONSTRAINT "StudentFee_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: StudentServiceSelection StudentServiceSelection_optional_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentServiceSelection"
    ADD CONSTRAINT "StudentServiceSelection_optional_service_id_fkey" FOREIGN KEY (optional_service_id) REFERENCES public."OptionalService"(id) ON UPDATE CASCADE;


--
-- Name: StudentServiceSelection StudentServiceSelection_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."StudentServiceSelection"
    ADD CONSTRAINT "StudentServiceSelection_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: Student Student_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE;


--
-- Name: Student Student_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: Student Student_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: Student Student_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: SubscriptionPayment SubscriptionPayment_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPayment"
    ADD CONSTRAINT "SubscriptionPayment_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: SubscriptionPayment SubscriptionPayment_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SubscriptionPayment"
    ADD CONSTRAINT "SubscriptionPayment_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES public."Subscription"(id) ON UPDATE CASCADE;


--
-- Name: Subscription Subscription_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: SystemNotification SystemNotification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."SystemNotification"
    ADD CONSTRAINT "SystemNotification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Template Template_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."Template"
    ADD CONSTRAINT "Template_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: User User_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: financial_reports financial_reports_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.financial_reports
    ADD CONSTRAINT financial_reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: financial_reports financial_reports_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.financial_reports
    ADD CONSTRAINT financial_reports_school_id_fkey FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: receipt receipt_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public."FeePayment"(id) ON UPDATE CASCADE;


--
-- Name: receipt receipt_printed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_printed_by_fkey FOREIGN KEY (printed_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: receipt receipt_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: receipt receipt_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_school_id_fkey FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: receipt receipt_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_student_id_fkey FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- Name: signatures signatures_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_school_id_fkey FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: signatures signatures_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.signatures
    ADD CONSTRAINT signatures_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE;


--
-- Name: student_service_preferences student_service_preferences_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.student_service_preferences
    ADD CONSTRAINT student_service_preferences_school_id_fkey FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE;


--
-- Name: student_service_preferences student_service_preferences_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecd_user
--

ALTER TABLE ONLY public.student_service_preferences
    ADD CONSTRAINT student_service_preferences_student_id_fkey FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 2fa39CFVDS8bPAebeo1sdEXsaQfPwkWZ9b1FuhWctkZ8G7iCMHslrSGC6vPq35K

