package com.scriptmaker.common;

import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.ScriptEntity;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    public<T extends ScriptEntity,E extends CrudRepository<T, Long>> void linked(T controller, E repository) {
        Set<DynamicParam> dynamicParams = new HashSet<>();
        if (controller.getInParams() != null) {
            dynamicParams.addAll(controller.getInParamsLink());
        }
        if (controller.getOutParams() != null)
            dynamicParams.addAll(controller.getOutParamsLink());
        if (dynamicParams != null) {
            Long id=null;
            for (T t:repository.findAll()) {
                if(t.getName().equals(controller.getName())) {
                    id = t.getId();
                    break;
                }
            }
            for (DynamicParam dynamicParam : dynamicParams) {
                String string = dynamicParam.getRefersActions();
                if (string != null) {
                    String[] strings = string.split(",");
                    int count = 0;
                    for (int i = 0; i < strings.length; i++) {
                        if (!strings[i].equals(controller.getId().toString()))
                            count++;
                        else break;
                    }
                    if (count == strings.length) {
                        dynamicParam.setRefersActions(string + "," + id);
                        dynamicParamRepository.save(dynamicParam);
                    }

                } else {
                    dynamicParam.setRefersActions(id.toString());
                    dynamicParamRepository.save(dynamicParam);
                }

            }
        }
    }
}
