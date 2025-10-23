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
(1, 'CLM-001', 1, 'EXM001', 'AO1', 'CA', '2024-01-15 09:30:00', '2024-01-16 10:00:00', 'POL-001', 'John Smith', '123-45-6789', 'AUTO', 1, 'ORG001', 'ORG1', 'ORG2', NULL, NULL, 'California', 'CA', 'UW001', 1, '2024-01-15 10:00:00', 5000.00, 3500.00, '1', 'AFF-001', 'JUR-001'),
(2, 'CLM-002', 2, 'EXM002', 'AO2', 'TX', '2024-02-20 14:15:00', '2024-02-21 09:15:00', 'POL-002', 'Jane Doe', '987-65-4321', 'HOME', 2, 'ORG002', 'ORG1', 'ORG2', NULL, NULL, 'Texas', 'TX', 'UW002', 2, '2024-02-20 15:00:00', 15000.00, 12000.00, '1', 'AFF-002', 'JUR-002'),
(3, 'CLM-003', 1, 'EXM001', 'AO1', 'NY', '2024-03-10 11:00:00', '2024-03-11 14:30:00', 'POL-003', 'Robert Johnson', '456-78-9123', 'AUTO', 1, 'ORG001', 'ORG1', 'ORG2', NULL, NULL, 'New York', 'NY', 'UW001', 1, '2024-03-10 12:00:00', 7500.00, 6000.00, '1', 'AFF-003', 'JUR-003'),
(4, 'CLM-004', 3, 'EXM002', 'AO3', 'FL', '2024-04-05 16:45:00', '2024-04-06 11:45:00', 'POL-004', 'Mary Wilson', '321-54-9876', 'HEALTH', 3, 'ORG003', 'ORG1', 'ORG2', NULL, NULL, 'Florida', 'FL', 'UW003', 2, '2024-04-05 17:00:00', 25000.00, 20000.00, '1', 'AFF-004', 'JUR-004'),
(5, 'CLM-005', 2, 'EXM001', 'AO2', 'IL', '2024-05-12 08:20:00', '2024-05-13 08:00:00', 'POL-005', 'David Brown', '654-32-1987', 'LIFE', 4, 'ORG002', 'ORG1', 'ORG2', NULL, NULL, 'Illinois', 'IL', 'UW002', 1, '2024-05-12 09:00:00', 50000.00, 45000.00, '1', 'AFF-005', 'JUR-005');