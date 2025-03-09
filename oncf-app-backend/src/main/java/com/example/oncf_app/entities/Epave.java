package com.example.oncf_app.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "epave")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Epave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String gareDepot;

    private String train;

    private String bm379;

    private String contenu;

    @ManyToOne
    @JoinColumn(name = "controller_id")
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