package gov.nic.apar.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "apar_targets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AparTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private AparReport report;

    @Column(name = "target_text", nullable = false, columnDefinition = "TEXT")
    private String targetText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String achievement;

    @Column(name = "sequence_order", nullable = false)
    private Short sequenceOrder;
}
