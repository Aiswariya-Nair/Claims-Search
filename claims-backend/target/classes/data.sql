-- Sample data for PostgreSQL claims table
-- Insert sample claims data
INSERT INTO claim (
    claim_id, claim_number, claim_status_code, examiner_code, adjusting_office_code, 
    state_code, incident_date, add_date, policy_number, claimant_name, ssn, 
    program_code, insurance_type_id, organization_code, org1_code, org2_code, 
    org3_code, org4_code, loss_state, loss_state_code, underwriter_code, 
    jurisdiction_code, incident_reported_date, estimated_incident_amount, 
    total_payout_on_incident, active, affiliate_claim_number, jurisdiction_claim_number
) VALUES
(1, 'CLM-001', 1, 'EXM001', 'AO1', 'CA', '2024-01-15 09:30:00', '2024-01-16 10:00:00', NULL, 'John Smith', NULL, 'AUTO', 1, 'ORG001', 'ORG1', 'ORG2', NULL, NULL, 'California', 'CA', 'UW001', 1, '2024-01-15 10:00:00', NULL, NULL, '1', NULL, NULL),
(2, 'CLM-002', 2, 'EXM002', 'AO2', 'TX', '2024-02-20 14:15:00', '2024-02-21 09:15:00', NULL, 'Jane Doe', NULL, 'HOME', 2, 'ORG002', 'ORG1', 'ORG2', NULL, NULL, 'Texas', 'TX', 'UW002', 2, '2024-02-20 15:00:00', NULL, NULL, '1', NULL, NULL),
(3, 'CLM-003', 1, 'EXM001', 'AO1', 'NY', '2024-03-10 11:00:00', '2024-03-11 14:30:00', NULL, 'Robert Johnson', NULL, 'AUTO', 1, 'ORG001', 'ORG1', 'ORG2', NULL, NULL, 'New York', 'NY', 'UW001', 1, '2024-03-10 12:00:00', NULL, NULL, '1', NULL, NULL),
(4, 'CLM-004', 3, 'EXM002', 'AO3', 'FL', '2024-04-05 16:45:00', '2024-04-06 11:45:00', NULL, 'Mary Wilson', NULL, 'HEALTH', 3, 'ORG003', 'ORG1', 'ORG2', NULL, NULL, 'Florida', 'FL', 'UW003', 2, '2024-04-05 17:00:00', NULL, NULL, '1', NULL, NULL),
(5, 'CLM-005', 2, 'EXM001', 'AO2', 'IL', '2024-05-12 08:20:00', '2024-05-13 08:00:00', NULL, 'David Brown', NULL, 'LIFE', 4, 'ORG002', 'ORG1', 'ORG2', NULL, NULL, 'Illinois', 'IL', 'UW002', 1, '2024-05-12 09:00:00', NULL, NULL, '1', NULL, NULL);