package com.archeo.server.modules.user.mapper;

import com.archeo.server.modules.user.dtos.OwnerProfileDTO;
import com.archeo.server.modules.user.dtos.UpdateOwnerProfileRequest;
import com.archeo.server.modules.user.models.Owner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OwnerProfileMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "agent", ignore = true)
    void updateOwnerFromDto(UpdateOwnerProfileRequest dto, @MappingTarget Owner entity);


    void getOwnerDTOFromOwner(Owner owner, @MappingTarget OwnerProfileDTO ownerProfileDTO);
}
