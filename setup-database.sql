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

-- Insert sample data
INSERT INTO claim (
    claim_id, claim_number, claim_status_code, examiner_code, adjusting_office_code, 
    state_code, incident_date, add_date, policy_number, claimant_name, ssn, 
    program_code, insurance_type_id, organization_code, org1_code, org2_code, 
    org3_code, org4_code, loss_state, loss_state_code, underwriter_code, 
    jurisdiction_code, incident_reported_date, estimated_incident_amount, 
    total_payout_on_incident, active, affiliate_claim_number, jurisdiction_claim_number
) VALUES
(136895137, '240000821', 1, 'hkhan', '420', 'AK', '2024-03-13 12:00:00', '2024-03-21 09:43:09', 'POL012', 'aa5, aa665', '123456789', 'AUTO', 4, 'ORG001', 'ORG001', 'ORG002', NULL, NULL, 'Alaska', 'AK', 'UW001', 1, '2024-03-14 10:00:00', 15000.00, 12500.50, '1', 'AFF001', 'JUR001'),
(136895138, '241157401', 2, 'jsmith', '421', 'CA', '2024-01-01 08:00:00', '2024-01-02 14:30:00', 'POL013', 'qa finbnalsqa, qa finbnals qa', '987654321', 'HOME', 2, 'ORG002', 'ORG002', 'ORG003', NULL, NULL, 'California', 'CA', 'UW002', 2, '2024-01-02 09:00:00', 25000.00, 22000.00, '1', 'AFF002', 'JUR002'),
(136895139, '241160924', 2, 'jdoe', '420', 'CA', '2024-10-16 15:30:00', '2024-10-17 10:15:00', 'POL014', 'test, test', '555666777', 'AUTO', 4, 'ORG001', 'ORG001', NULL, NULL, NULL, 'California', 'CA', 'UW001', 1, '2024-10-17 08:00:00', 8000.00, 7500.00, '1', 'AFF003', 'JUR003'),
(136895140, '241162025', 2, 'hkhan', '422', 'NY', '2024-10-18 11:45:00', '2024-10-19 16:20:00', 'POL015', 'Morsy, Ihab', '111222333', 'LIFE', 1, 'ORG003', 'ORG003', 'ORG001', NULL, NULL, 'New York', 'NY', 'UW003', 3, '2024-10-19 12:00:00', 50000.00, 45000.00, '1', 'AFF004', 'JUR004'),
(136895141, '241174447', 2, 'jsmith', '420', 'TX', '2024-11-20 09:15:00', '2024-11-21 11:30:00', 'POL016', 'Smith, John', '444555666', 'HEALTH', 3, 'ORG002', 'ORG002', 'ORG003', 'ORG001', NULL, 'Texas', 'TX', 'UW002', 2, '2024-11-21 10:00:00', 12000.00, 10500.00, '1', 'AFF005', 'JUR005'),
(136895142, '255001990', 1, 'jdoe', '420', 'AK', '2025-08-05 14:22:00', '2025-08-06 08:45:00', 'POL017', 'test, test', '', 'AUTO', 4, 'ORG001', 'ORG001', NULL, NULL, NULL, 'Alaska', 'AK', 'UW001', 1, '2025-08-06 09:00:00', 18000.00, 16000.00, '1', 'AFF006', 'JUR006'),
(136895143, '250001234', 4, 'hkhan', '421', 'FL', '2024-05-15 13:30:00', '2024-05-16 15:45:00', 'POL018', 'Johnson, Mary', '777888999', 'HOME', 2, 'ORG003', 'ORG003', 'ORG002', NULL, NULL, 'Florida', 'FL', 'UW003', 2, '2024-05-17 11:30:00', 22000.00, 20000.00, '1', 'AFF007', 'JUR007'),
(136895144, '250002345', 3, 'jsmith', '422', 'IL', '2024-07-22 16:00:00', '2024-07-23 12:15:00', 'POL019', 'Williams, Robert', '123987456', 'WC', 5, 'ORG001', 'ORG001', 'ORG003', 'ORG002', NULL, 'Illinois', 'IL', 'UW001', 3, '2024-07-24 14:00:00', 35000.00, 30000.00, '1', 'AFF008', 'JUR008'),
(136895145, '250003456', 1, 'jdoe', '420', 'WA', '2024-09-10 10:45:00', '2024-09-11 09:30:00', 'POL020', 'Davis, Jennifer', '654321987', 'GL', 6, 'ORG002', 'ORG002', 'ORG001', NULL, NULL, 'Washington', 'WA', 'UW002', 1, '2024-09-12 08:15:00', 28000.00, 25000.00, '1', 'AFF009', 'JUR009'),
(136895146, '250004567', 2, 'hkhan', '421', 'TX', '2024-12-01 08:30:00', '2024-12-02 13:20:00', 'POL021', 'Brown, Michael', '987123654', 'AUTO', 4, 'ORG003', 'ORG003', NULL, NULL, NULL, 'Texas', 'TX', 'UW003', 2, '2024-12-03 10:45:00', 16500.00, 14000.00, '1', 'AFF010', 'JUR010');

-- Verify the data was inserted
SELECT COUNT(*) as total_claims FROM claim;
SELECT claim_number, claimant_name, incident_date, claim_status_code FROM claim ORDER BY add_date DESC LIMIT 5;

-- Grant permissions if using a specific user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO claims_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO claims_user;

COMMIT;

\echo 'Database setup completed successfully!'
\echo 'You can now start the backend application.'