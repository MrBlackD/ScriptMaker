package com.scriptmaker.common;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.repository.OperationRepository;
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

}
