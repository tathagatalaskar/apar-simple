package gov.nic.apar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Authority reviews: grade + remarks, and optionally flags. */
public record ReviewRequest(
        @NotBlank @Size(max = 20) String grade,
        @Size(max = 2000) String remarks,
        boolean flagged,
        @Size(max = 1000) String flagReason
) {}
