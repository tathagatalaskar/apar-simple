package gov.nic.apar.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record ReportView(
        Long id,
        String officerName,
        String department,
        String designation,
        String assessmentYear,
        String selfAppraisal,
        String status,
        String grade,
        String authorityRemarks,
        boolean flagged,
        String flagReason,
        String reviewedByName,
        List<TargetView> targets,
        OffsetDateTime createdAt,
        OffsetDateTime reviewedAt
) {}
