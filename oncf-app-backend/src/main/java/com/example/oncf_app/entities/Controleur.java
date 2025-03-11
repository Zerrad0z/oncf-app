package com.example.oncf_app.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "controleurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Controleur {

    @Id
    private String id; // Matricule number (unique identifier)

    private String nom;

    private String prenom;

    @ManyToOne
    @JoinColumn(name = "antenne_id")
    @JsonIgnoreProperties("employees") // Prevent serialization of employees
    private Antenne antenne;

    @OneToMany(mappedBy = "controleur")
    private List<Epave> epaves;

    @OneToMany(mappedBy = "controleur")
    private List<FicheInfraction> ficheInfractions;

    @OneToMany(mappedBy = "controleur")
    private List<CartePerimee> cartePerimees;
}