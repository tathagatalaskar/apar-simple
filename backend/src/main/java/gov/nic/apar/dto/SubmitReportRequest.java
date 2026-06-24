package gov.nic.apar.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

/** Employee fills and submits their APAR. */
public record SubmitReportRequest(
        @NotBlank @Size(min = 2, max = 120) String officerName,
        @NotBlank @Size(min = 2, max = 150) String department,
        @NotBlank @Size(min = 2, max = 120) String designation,
        @NotBlank @Size(min = 4, max = 9) String assessmentYear,
        @Size(max = 4000) String selfAppraisal,
        @NotNull @Size(min = 1, max = 15) @Valid List<TargetDTO> targets
) {}
