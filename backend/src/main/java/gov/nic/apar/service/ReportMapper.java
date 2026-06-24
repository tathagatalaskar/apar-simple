package gov.nic.apar.service;

import gov.nic.apar.dto.ReportView;
import gov.nic.apar.dto.TargetView;
import gov.nic.apar.entity.AparReport;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReportMapper {

    public ReportView toView(AparReport r) {
        List<TargetView> targets = r.getTargets().stream()
                .map(t -> new TargetView(t.getTargetText(), t.getAchievement()))
                .toList();
        return new ReportView(
                r.getId(), r.getOfficerName(), r.getDepartment(), r.getDesignation(),
                r.getAssessmentYear(), r.getSelfAppraisal(), r.getStatus().name(),
                r.getGrade(), r.getAuthorityRemarks(),
                Boolean.TRUE.equals(r.getIsFlagged()), r.getFlagReason(),
                r.getReviewedBy() != null ? r.getReviewedBy().getFullName() : null,
                targets, r.getCreatedAt(), r.getReviewedAt());
    }
}
