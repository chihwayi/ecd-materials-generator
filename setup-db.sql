-- Create database and user for ECD Materials Generator
CREATE DATABASE ecd_db;
CREATE USER ecd_user WITH PASSWORD 'ecd_password';
GRANT ALL PRIVILEGES ON DATABASE ecd_db TO ecd_user;
ALTER USER ecd_user CREATEDB;