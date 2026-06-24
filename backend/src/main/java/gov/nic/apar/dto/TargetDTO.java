package gov.nic.apar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TargetDTO(
        @NotBlank @Size(max = 1000) String target,
        @NotBlank @Size(max = 1000) String achievement
) {}
