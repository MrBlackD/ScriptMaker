package com.scriptmaker.common;

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

    /**
     * Создаёт список экземпляров динамических параметров из строки
     * @param string  строка вида `dynamicParamId,required,keepInworkflow,defaultValue;`
     * @return список экземпляров динамических параметров
     */
    public List<DynamicParamInstance> getDynamicParamsInstances(String string) {
        if(string == null || string.isEmpty()){
            return new ArrayList<>();
        }
        List<DynamicParamInstance> dynamicParamInstances = new ArrayList<>();
        for(String paramInstance : string.split(";")){
            String[] props = paramInstance.split(",");
            DynamicParamInstance dynamicParamInstance = new DynamicParamInstance();
            dynamicParamInstance.setDynamicParam(dynamicParamRepository.findOne(Long.valueOf(props[0])));
            if(props.length>=2) {
                dynamicParamInstance.setRequired(Boolean.valueOf(props[1]));
            }
            if(props.length>=3) {
                dynamicParamInstance.setKeepInWorkflow(Boolean.valueOf(props[2]));
            }
            if(props.length>=4){
                dynamicParamInstance.setDefaultValue(String.valueOf(props[3]));
            }
            dynamicParamInstances.add(dynamicParamInstance);
        }
        return dynamicParamInstances;
    }
}
