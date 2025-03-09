package com.example.oncf_app.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "antenne")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Antenne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @OneToMany(mappedBy = "antenne")
    private List<Employee> employees;
}