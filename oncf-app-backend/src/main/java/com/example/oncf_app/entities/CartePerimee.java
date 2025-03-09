package com.example.oncf_app.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "carte_perimee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartePerimee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String numCarte;

    private String gareD;

    private String gareA;

    private String train;

    private Integer confort; // 1 or 2

    private LocalDate dateDv; // Date de validité

    private LocalDate dateFv; // Date fin de validité

    private String suiteReservee;

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