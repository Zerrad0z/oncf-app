package com.example.oncf_app.mappers;

import com.example.oncf_app.dtos.EmployeeDTO;
import com.example.oncf_app.entities.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EmployeeMapper {

    @Mapping(source = "antenne.id", target = "antenneId")
    @Mapping(source = "antenne.nom", target = "antenneName")
    EmployeeDTO toDto(Employee employee);

    @Mapping(target = "antenne", ignore = true)
    @Mapping(target = "epaveEntries", ignore = true)
    @Mapping(target = "ficheInfractionEntries", ignore = true)
    @Mapping(target = "cartePerimeeEntries", ignore = true)
    Employee toEntity(EmployeeDTO dto);

    @Mapping(target = "antenne", ignore = true)
    @Mapping(target = "epaveEntries", ignore = true)
    @Mapping(target = "ficheInfractionEntries", ignore = true)
    @Mapping(target = "cartePerimeeEntries", ignore = true)
    void updateEntityFromDto(EmployeeDTO dto, @MappingTarget Employee employee);
}