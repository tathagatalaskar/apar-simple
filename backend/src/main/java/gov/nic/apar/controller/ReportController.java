package gov.nic.apar.controller;

import gov.nic.apar.dto.*;
import gov.nic.apar.security.AppUserDetails;
import gov.nic.apar.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** APAR report endpoints. Full prefix: /api/v1/reports */
@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public List<ReportView> list(@AuthenticationPrincipal AppUserDetails me) {
        return reportService.list(me.getUser());
    }

    @GetMapping("/{id}")
    public ReportView get(@PathVariable Long id, @AuthenticationPrincipal AppUserDetails me) {
        return reportService.get(id, me.getUser());
    }

    @PostMapping
    public ResponseEntity<ReportView> submit(@Valid @RequestBody SubmitReportRequest req,
                                             @AuthenticationPrincipal AppUserDetails me) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.submit(req, me.getUser()));
    }

    @PutMapping("/{id}/review")
    public ReportView review(@PathVariable Long id, @Valid @RequestBody ReviewRequest req,
                             @AuthenticationPrincipal AppUserDetails me) {
        return reportService.review(id, req, me.getUser());
    }
}
