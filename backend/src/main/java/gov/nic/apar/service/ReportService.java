package gov.nic.apar.service;

import gov.nic.apar.dto.*;
import gov.nic.apar.entity.*;
import gov.nic.apar.exception.ForbiddenException;
import gov.nic.apar.exception.NotFoundException;
import gov.nic.apar.repository.AparReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AparReportRepository reportRepository;
    private final ReportMapper mapper;

    /** Employee sees only their own; Authority sees all. */
    @Transactional(readOnly = true)
    public List<ReportView> list(User user) {
        List<AparReport> reports = user.getRole() == Role.AUTHORITY
                ? reportRepository.findAllByOrderByCreatedAtDesc()
                : reportRepository.findByEmployeeIdOrderByCreatedAtDesc(user.getId());
        return reports.stream().map(mapper::toView).toList();
    }

    @Transactional(readOnly = true)
    public ReportView get(Long id, User user) {
        AparReport r = load(id);
        // Employee can only view their own
        if (user.getRole() == Role.EMPLOYEE && !r.getEmployee().getId().equals(user.getId()))
            throw new ForbiddenException("You can only view your own report");
        return mapper.toView(r);
    }

    /** Employee submits a new APAR. */
    @Transactional
    public ReportView submit(SubmitReportRequest req, User employee) {
        if (employee.getRole() != Role.EMPLOYEE)
            throw new ForbiddenException("Only employees can submit reports");

        AparReport report = AparReport.builder()
                .employee(employee)
                .officerName(req.officerName().trim())
                .department(req.department().trim())
                .designation(req.designation().trim())
                .assessmentYear(req.assessmentYear().trim())
                .selfAppraisal(req.selfAppraisal() != null ? req.selfAppraisal().trim() : null)
                .status(ReportStatus.SUBMITTED)
                .build();

        short seq = 1;
        for (TargetDTO t : req.targets()) {
            report.getTargets().add(AparTarget.builder()
                    .report(report)
                    .targetText(t.target().trim())
                    .achievement(t.achievement().trim())
                    .sequenceOrder(seq++)
                    .build());
        }
        return mapper.toView(reportRepository.save(report));
    }

    /** Authority reviews: adds grade + remarks, optionally flags. */
    @Transactional
    public ReportView review(Long id, ReviewRequest req, User authority) {
        if (authority.getRole() != Role.AUTHORITY)
            throw new ForbiddenException("Only the authority can review reports");

        AparReport r = load(id);
        r.setGrade(req.grade().trim());
        r.setAuthorityRemarks(req.remarks() != null ? req.remarks().trim() : null);
        r.setIsFlagged(req.flagged());
        r.setFlagReason(req.flagged() ? req.flagReason() : null);
        r.setStatus(ReportStatus.REVIEWED);
        r.setReviewedBy(authority);
        r.setReviewedAt(OffsetDateTime.now());
        return mapper.toView(reportRepository.save(r));
    }

    private AparReport load(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Report not found: " + id));
    }
}
