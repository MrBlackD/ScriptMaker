package com.scriptmaker.factories;

import com.scriptmaker.model.Action;
import com.scriptmaker.repository.ActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * Created by Admin on 17.06.2017.
 */
@Component
public class ActionFactory {
    @Autowired
    private ActionRepository actionRepository;

    public void create(Action action) throws Exception {
        if(actionRepository.findByCode(action.getCode()) != null){
            throw new Exception();
        } else {
            actionRepository.save(action);
        }
    }

    public void update(Action action) throws Exception {
        Action oldAction = actionRepository.findOne(action.getId());
        if( actionRepository.findByCode(action.getCode())!= null
                && !Objects.equals(actionRepository.findByCode(action.getCode()).getId(), oldAction.getId())){
            System.out.println("ERROR action with code" + action.getCode() + " already exist");
            throw new Exception();

        } else {
            actionRepository.save(action);
        }
    }

    public void delete(Action action){
        actionRepository.delete(action);
    }

    public void delete(Long id){
        actionRepository.delete(id);
    }
}
