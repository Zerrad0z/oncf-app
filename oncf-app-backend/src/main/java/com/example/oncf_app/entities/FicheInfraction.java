package com.example.oncf_app.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fiche_infraction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FicheInfraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String gareD;

    private String gareA;

    private String gareDepot;

    private String train;

    private Integer numVoy;

    private Double montant;

    private String motif;

    private String observation;

    @ManyToOne
    @JoinColumn(name = "controleur_id")
    private Controleur controleur; // The controller who reported this in the field

    @ManyToOne
    @JoinColumn(name = "agent_com_id")
    private Employee agentCom; // The agent who entered this data into the system

    @Column(name = "created_at")
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}