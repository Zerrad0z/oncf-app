package com.example.oncf_app.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EpaveDTO {
    private Long id;
    private LocalDate date;
    private String gareDepot;
    private String train;
    private String bm379;
    private String contenu;
    private String controllerId;
    private String controllerName; // For display purposes
    private String agentComId;
}