package gov.nic.apar.repository;

import gov.nic.apar.entity.AparReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AparReportRepository extends JpaRepository<AparReport, Long> {
    // Employee sees only their own reports
    List<AparReport> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    // Authority sees all reports
    List<AparReport> findAllByOrderByCreatedAtDesc();
}
