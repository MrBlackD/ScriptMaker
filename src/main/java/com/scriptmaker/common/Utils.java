package com.scriptmaker.common;

import com.scriptmaker.dto.ParamInstanceDto;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 15.06.2017.
 */
@Component
public class Utils {
    @Autowired
    private DynamicParamRepository dynamicParamRepository;

    public <T,E extends CrudRepository<T, Long>>List<T> getIdsFromString(
            String ids,E repository){
        if(ids == null)
            return null;
        String[] params = ids.split(",");
        List<T> paramsList = new ArrayList<>();
        for(String id : params){
            T param=repository.findOne(Long.parseLong(id));
            if(param!=null){
                paramsList.add(param);
            }
        }
        return paramsList;
    }


    public List<DynamicParamInstance> getDynamicParamsInstances(List<ParamInstanceDto> paramsList) {
        List<DynamicParamInstance> dynamicParamInstances = new ArrayList<>();
        for (ParamInstanceDto paramInstanceDto : paramsList) {
            DynamicParamInstance dynamicParamInstance = new DynamicParamInstance();
            Long paramId = Long.valueOf(paramInstanceDto.getId());
            dynamicParamInstance.setDynamicParam(dynamicParamRepository.findOne(paramId));
            dynamicParamInstance.setRequired(Boolean.valueOf(paramInstanceDto.getRequired()));
            dynamicParamInstance.setKeepInWorkflow(Boolean.valueOf(paramInstanceDto.getKeepInWorkflow()));
            dynamicParamInstance.setDefaultValue(paramInstanceDto.getDefaultValue());
            dynamicParamInstances.add(dynamicParamInstance);
        }
        return dynamicParamInstances;
    }
}
