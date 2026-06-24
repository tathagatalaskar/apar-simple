-- ═══════════════════════════════════════════════════════════════
-- APAR Simple — Database Schema (PostgreSQL)
-- Two tables: users and apar_reports
-- ═══════════════════════════════════════════════════════════════
SET client_min_messages TO WARNING;

-- Users: two roles only — EMPLOYEE and AUTHORITY
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(150) NOT NULL UNIQUE,
    full_name       VARCHAR(120) NOT NULL,
    password_hash   VARCHAR(100) NOT NULL,
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('EMPLOYEE','AUTHORITY')),
    designation     VARCHAR(120),
    department      VARCHAR(150),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- APAR reports submitted by employees, reviewed by the authority
CREATE TABLE apar_reports (
    id              BIGSERIAL PRIMARY KEY,
    employee_id     BIGINT       NOT NULL REFERENCES users(id),

    -- Section 1: filled by employee
    officer_name    VARCHAR(120) NOT NULL,
    department      VARCHAR(150) NOT NULL,
    designation     VARCHAR(120) NOT NULL,
    assessment_year VARCHAR(9)   NOT NULL,
    self_appraisal  TEXT,

    -- Status: SUBMITTED -> REVIEWED (or FLAGGED at any point)
    status          VARCHAR(20)  NOT NULL DEFAULT 'SUBMITTED'
                    CHECK (status IN ('SUBMITTED','REVIEWED')),

    -- Section 2: filled by authority
    grade           VARCHAR(20),                 -- e.g. Outstanding / Very Good / Good
    authority_remarks TEXT,
    is_flagged      BOOLEAN      NOT NULL DEFAULT FALSE,
    flag_reason     TEXT,
    reviewed_by     BIGINT       REFERENCES users(id),
    reviewed_at     TIMESTAMPTZ,

    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_reports_employee ON apar_reports(employee_id);
CREATE INDEX idx_reports_status   ON apar_reports(status);

-- Targets & achievements for each report
CREATE TABLE apar_targets (
    id              BIGSERIAL PRIMARY KEY,
    report_id       BIGINT  NOT NULL REFERENCES apar_reports(id) ON DELETE CASCADE,
    target_text     TEXT    NOT NULL,
    achievement     TEXT    NOT NULL,
    sequence_order  SMALLINT NOT NULL
);
CREATE INDEX idx_targets_report ON apar_targets(report_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_touch BEFORE UPDATE ON apar_reports
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
