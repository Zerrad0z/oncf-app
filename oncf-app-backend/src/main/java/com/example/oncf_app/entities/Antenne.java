package com.example.oncf_app.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "antenne")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Antenne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @OneToMany(mappedBy = "antenne")
    @JsonManagedReference("antenne-employee")
    private List<Employee> employees = new ArrayList<>();
}