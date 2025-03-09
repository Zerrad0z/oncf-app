package com.example.oncf_app.mappers;

import com.example.oncf_app.dtos.CartePerimeeDTO;
import com.example.oncf_app.entities.CartePerimee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CartePerimeeMapper {

    @Mapping(source = "controleur.id", target = "controllerId")
    @Mapping(target = "controllerName", expression = "java(cartePerimee.getControleur() != null ? cartePerimee.getControleur().getNom() + \" \" + cartePerimee.getControleur().getPrenom() : null)")
    @Mapping(source = "agentCom.id", target = "agentComId")
    CartePerimeeDTO toDto(CartePerimee cartePerimee);

    @Mapping(target = "controleur", ignore = true)
    @Mapping(target = "agentCom", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    CartePerimee toEntity(CartePerimeeDTO dto);

    @Mapping(target = "controleur", ignore = true)
    @Mapping(target = "agentCom", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDto(CartePerimeeDTO dto, @MappingTarget CartePerimee cartePerimee);
}