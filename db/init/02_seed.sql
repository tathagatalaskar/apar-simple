-- ═══════════════════════════════════════════════════════════════
-- Seed data — all passwords = 'Password@123'
-- ═══════════════════════════════════════════════════════════════

-- The single authority
INSERT INTO users (email, full_name, password_hash, role, designation, department)
VALUES ('authority@nic.in', 'Rajesh Kumar', '$2b$10$vttwGAI.2vQgKVYUYyVlcOb6o.hHedni66GTcN3fKgDXPNq0FiWHS', 'AUTHORITY',
        'Senior Director', 'NIC Headquarters');

-- Two employees
INSERT INTO users (email, full_name, password_hash, role, designation, department)
VALUES ('employee@nic.in', 'Tathagata Laskar', '$2b$10$vttwGAI.2vQgKVYUYyVlcOb6o.hHedni66GTcN3fKgDXPNq0FiWHS', 'EMPLOYEE',
        'Scientist-B', 'NIC Tripura State Centre');

INSERT INTO users (email, full_name, password_hash, role, designation, department)
VALUES ('priya@nic.in', 'Priya Menon', '$2b$10$vttwGAI.2vQgKVYUYyVlcOb6o.hHedni66GTcN3fKgDXPNq0FiWHS', 'EMPLOYEE',
        'Scientist-B', 'NIC Tripura State Centre');

-- A sample already-submitted report (so the authority has something to review on day one)
INSERT INTO apar_reports (employee_id, officer_name, department, designation, assessment_year, self_appraisal, status)
VALUES (
    (SELECT id FROM users WHERE email = 'priya@nic.in'),
    'Priya Menon', 'NIC Tripura State Centre', 'Scientist-B', '2025-2026',
    'Handled the citizen services portal migration and mentored two interns during the cycle.',
    'SUBMITTED'
);

INSERT INTO apar_targets (report_id, target_text, achievement, sequence_order)
SELECT r.id, t.tt, t.ac, t.seq
FROM apar_reports r,
(VALUES
    ('Migrate citizen portal to new stack', 'Completed migration with zero downtime', 1),
    ('Mentor two junior developers', 'Both cleared internal certification', 2)
) AS t(tt, ac, seq)
WHERE r.employee_id = (SELECT id FROM users WHERE email = 'priya@nic.in');
