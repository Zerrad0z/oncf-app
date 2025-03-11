package com.example.oncf_app.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartePerimeeDTO {
    private Long id;
    private LocalDate date;
    private String numCarte;
    private String gareD;
    private String gareA;
    private String train;
    private Integer confort;
    private LocalDate dateDv;
    private LocalDate dateFv;
    private String suiteReservee;
    private String controllerId;
    private String controllerName; // For display purposes
    private String agentComId;
}