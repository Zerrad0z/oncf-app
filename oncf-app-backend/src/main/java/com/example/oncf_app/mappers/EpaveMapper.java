package com.example.oncf_app.mappers;

import com.example.oncf_app.dtos.EpaveDTO;
import com.example.oncf_app.entities.Epave;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EpaveMapper {

    @Mapping(source = "controleur.id", target = "controllerId")
    @Mapping(target = "controllerName", expression = "java(epave.getControleur() != null ? epave.getControleur().getNom() + \" \" + epave.getControleur().getPrenom() : null)")
    @Mapping(source = "agentCom.id", target = "agentComId")
    EpaveDTO toDto(Epave epave);

    @Mapping(target = "controleur", ignore = true)
    @Mapping(target = "agentCom", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Epave toEntity(EpaveDTO dto);

    @Mapping(target = "controleur", ignore = true)
    @Mapping(target = "agentCom", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDto(EpaveDTO dto, @MappingTarget Epave epave);
}