package com.scriptmaker.factories;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.ParamMapping;
import com.scriptmaker.repository.ActionInstanceRepository;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.OperationRepository;
import com.scriptmaker.repository.ParamMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by Admin on 17.06.2017.
 */
@Component
public class ActionFactory {
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private ActionInstanceRepository actionInstanceRepository;
    @Autowired
    private OperationRepository operationRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;
    @Autowired
    private ParamMappingRepository paramMappingRepository;


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
        Action action = actionRepository.findOne(id);

        List<ActionInstance> actionInstances = actionInstanceRepository.findByAction(action);
        List<Operation> operations = new ArrayList<>();
        for(ActionInstance actionInstance:actionInstances){
            List<ParamMapping> mapping = actionInstance.getMapping();
            actionInstance.setMapping(new ArrayList<>());
            paramMappingRepository.delete(mapping);
            operations.addAll(operationRepository.findByActionsContains(actionInstance));
        }
        for (Operation operation:operations){
            operation.getActions().removeAll(actionInstances);
        }
        operationRepository.save(operations);

        actionInstanceRepository.delete(actionInstances);
        List<DynamicParamInstance> dynamicParamInstances = new ArrayList<>();
        dynamicParamInstances.addAll(action.getInParams());
        dynamicParamInstances.addAll(action.getOutParams());
        action.setInParams(new ArrayList<>());
        action.setOutParams(new ArrayList<>());
        dynamicParamInstanceRepository.delete(dynamicParamInstances);
        actionRepository.delete(id);
    }
}
