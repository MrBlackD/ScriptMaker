package com.scriptmaker.common;

import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<DynamicParam> getDynamicParamsFromString(String paramsIds){
        if(paramsIds == null)
            return null;
        String[] params = paramsIds.split(",");
        List<DynamicParam> dynamicParams = new ArrayList<>();
        for(String id : params){
            if(dynamicParamRepository.findOne(Long.parseLong(id))!=null){
                dynamicParams.add(dynamicParamRepository.findOne(Long.parseLong(id)));
            }
        }
        return dynamicParams;
    }
}
