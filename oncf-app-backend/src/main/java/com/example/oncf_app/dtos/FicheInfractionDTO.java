package com.example.oncf_app.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FicheInfractionDTO {
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
    private Long controllerId;
    private String controllerName; // For display purposes
    private Long agentComId;
}