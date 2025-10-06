-- PostgreSQL Database Setup Script for Claims Management System
-- Run this script in PostgreSQL to set up the database

-- Create database (run as postgres superuser)
-- CREATE DATABASE claims_db;

-- Connect to the claims_db database
\c claims_db;

-- Create user (optional, if not using default postgres user)
-- CREATE USER claims_user WITH PASSWORD 'claims_password';
-- GRANT ALL PRIVILEGES ON DATABASE claims_db TO claims_user;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS claim CASCADE;

-- Create the main claim table with all required fields
CREATE TABLE claim (
    claim_id bigint NOT NULL PRIMARY KEY,
    claim_status_code bigint,
    claim_number varchar(20),
    examiner_code varchar(10),
    adjusting_office_code varchar(3),
    state_code varchar(2),
    jurisdiction_code bigint,
    incident_date timestamp,
    add_date timestamp,
    policy_number varchar(50),
    claimant_name varchar(200),
    ssn varchar(11),
    program_code varchar(20),
    insurance_type_id bigint,
    organization_code varchar(20),
    
    -- Enhanced fields from requirements
    org1_code varchar(10),
    org2_code varchar(10),
    org3_code varchar(10),
    org4_code varchar(10),
    loss_state varchar(5),
    loss_state_code varchar(5),
    underwriter_code varchar(10),
    incident_reported_date timestamp,
    claim_closed_date timestamp,
    estimated_incident_amount numeric(16,2),
    total_payout_on_incident numeric(16,2),
    active varchar(1) DEFAULT '1',
    master_claim varchar(1),
    affiliate_claim_number varchar(30),
    jurisdiction_claim_number varchar(25),
    
    -- Additional fields for completeness
    manual_insured_name varchar(80),
    country_code varchar(3),
    examiner_start_date timestamp,
    file_loc_code bigint,
    incident_type_code bigint,
    address1 varchar(100),
    address2 varchar(100),
    city varchar(50),
    zip_code varchar(10),
    county varchar(50),
    fiscal_year_desc varchar(30),
    policy_period_desc varchar(30),
    incident_claims_made_date timestamp,
    incident_desc varchar(1000),
    incident_location_desc varchar(500),
    incident_name varchar(80),
    on_insured_premises varchar(1),
    not_covered varchar(1),
    org_group_code bigint,
    subrogated varchar(1),
    catastrophe_code varchar(4),
    safety varchar(1),
    deductible_amount numeric(16,2),
    estimated_subro_recovery numeric(16,2),
    estimated_excess_recovery numeric(16,2),
    time_tracking varchar(1),
    add_user varchar(40) DEFAULT 'system',
    edit_date timestamp,
    edit_user varchar(40) DEFAULT 'system'
);

-- Create indexes for performance
CREATE INDEX idx_claim_number ON claim (claim_number);
CREATE INDEX idx_claim_status ON claim (claim_status_code);
CREATE INDEX idx_examiner_code ON claim (examiner_code);
CREATE INDEX idx_adjusting_office ON claim (adjusting_office_code);
CREATE INDEX idx_state_code ON claim (state_code);
CREATE INDEX idx_incident_date ON claim (incident_date);
CREATE INDEX idx_add_date ON claim (add_date);
CREATE INDEX idx_active ON claim (active);
CREATE INDEX idx_claimant_name ON claim (claimant_name);
CREATE INDEX idx_policy_number ON claim (policy_number);
CREATE INDEX idx_org_codes ON claim (org1_code, org2_code, org3_code, org4_code);


-- Verify the data was inserted
SELECT COUNT(*) as total_claims FROM claim;
SELECT claim_number, claimant_name, incident_date, claim_status_code FROM claim ORDER BY add_date DESC LIMIT 5;

-- Grant permissions if using a specific user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO claims_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO claims_user;

COMMIT;

\echo 'Database setup completed successfully!'
\echo 'You can now start the backend application.'
