package com.scriptmaker.common;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.repository.ActionRepository;
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
    @Autowired
    private ActionRepository actionRepository;

    public List<DynamicParam> getDynamicParamsFromString(String paramsIds){
        if(paramsIds == null)
            return null;
        String[] params = paramsIds.split(",");
        List<DynamicParam> dynamicParams = new ArrayList<>();
        for(String id : params){
            DynamicParam dynamicParam=dynamicParamRepository.findOne(Long.parseLong(id));
            if(dynamicParam!=null){
                dynamicParams.add(dynamicParam);
            }
        }
        return dynamicParams;
    }

    public List<Action> getActionsFromString(String actionsIds){
        if(actionsIds== null)
            return null;
        String[] actions = actionsIds.split(",");
        List<Action> actionsList = new ArrayList<>();
        for(String id : actions){
            Action action=actionRepository.findOne(Long.parseLong(id));
            if(action!=null){
                actionsList.add(action);
            }
        }
        return actionsList;
    }
}
