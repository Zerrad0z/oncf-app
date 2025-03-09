package com.example.oncf_app.mappers;

import com.example.oncf_app.dtos.FicheInfractionDTO;
import com.example.oncf_app.entities.FicheInfraction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface FicheInfractionMapper {

    @Mapping(source = "controleur.id", target = "controllerId")
    @Mapping(target = "controllerName", expression = "java(ficheInfraction.getControleur() != null ? ficheInfraction.getControleur().getNom() + \" \" + ficheInfraction.getControleur().getPrenom() : null)")
    @Mapping(source = "agentCom.id", target = "agentComId")
    FicheInfractionDTO toDto(FicheInfraction ficheInfraction);

    @Mapping(target = "controleur", ignore = true)
    @Mapping(target = "agentCom", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    FicheInfraction toEntity(FicheInfractionDTO dto);

    @Mapping(target = "controleur", ignore = true)
    @Mapping(target = "agentCom", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDto(FicheInfractionDTO dto, @MappingTarget FicheInfraction ficheInfraction);
}