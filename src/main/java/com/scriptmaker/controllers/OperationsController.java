package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.OperationFactory;
import com.scriptmaker.model.Action;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.ActionInstanceRepository;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Admin on 07.06.2017.
 */
@CrossOrigin
@RestController
public class OperationsController {

    @Autowired
    private OperationRepository operationRepository;
    @Autowired
    private Utils utils;
    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private ActionInstanceRepository actionInstanceRepository;
    @Autowired
    private OperationFactory operationFactory;
    @Autowired
    private NodeRepository nodeRepository;

    @RequestMapping("/api/operations")
    public List<Operation> getAllOperations() {
        return (List<Operation>) operationRepository.findAll();
    }

    @RequestMapping("/api/operations/{id}")
    public Operation getOperation(@PathVariable(name = "id") String id) {
        return operationRepository.findOne(Long.parseLong(id));
    }

    @RequestMapping("/api/operations/new")
    public Operation newOperation(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "code") String code,
            @RequestParam(name = "description") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams,
            @RequestParam(name = "startNode", required = false) String node,
            @RequestParam(name = "actions", required = false) String actions

    ) throws Exception {
        List<Action> actionList = utils.getIdsFromString(actions, actionRepository);
        List<ActionInstance> actionInstances = new ArrayList<>();
        for(Action action:actionList){
            actionInstances.add(new ActionInstance(action,null));
        }
        actionInstanceRepository.save(actionInstances);
        Operation newOperation = new Operation(
                name,
                code,
                description,
                utils.getIdsFromString(inParams,dynamicParamRepository),
                utils.getIdsFromString(outParams,dynamicParamRepository),
                node == null ? null : nodeRepository.findOne(Long.parseLong(node)),
                actionInstances
                );
        operationFactory.create(newOperation);
        linked(newOperation);
        return newOperation;
    }
    private void linked(Operation newOperation) {
        Set<DynamicParam> dynamicParams = new HashSet<>();
        if (newOperation.getInParams() != null) {
            dynamicParams.addAll(newOperation.getInParams());
        }
        if (newOperation.getOutParams() != null)
            dynamicParams.addAll(newOperation.getOutParams());
        if (dynamicParams != null){
            Long operationId=operationRepository.findByCode(newOperation.getCode()).getId();
            for (DynamicParam dynamicParam : dynamicParams) {
                String string = dynamicParam.getRefersOperations();
                if (string != null) {
                    String[] strings = string.split(",");
                    int count = 0;
                    for (int i = 0; i < strings.length; i++) {
                        if (!strings[i].equals(newOperation.getId().toString()))
                            count++;
                        else break;
                    }
                    if (count == strings.length){
                        dynamicParam.setRefersOperations(string+","+operationId);
                        dynamicParamRepository.save(dynamicParam);
                    }

                }
                else {
                    dynamicParam.setRefersOperations(operationId.toString());
                    dynamicParamRepository.save(dynamicParam);
                }

            }
        }

    }

    public static void removeLinked(List<DynamicParam> dynamicParams, Operation operation) {
        if (dynamicParams != null) {
            for (DynamicParam dynamicParam : dynamicParams) {
                String[] strings = dynamicParam.getRefersOperations().split(",");
                String string = "";
                for (int i = 0; i < strings.length; i++) {
                    if (!strings[i].equals(operation.getId().toString())) {
                        string += strings[i]+",";
                    }
                }
                if(string.equals(""))
                    string=null;
                else{
                    if(string.charAt(string.length()-1)==',')
                        string=string.substring(0,string.length()-1);
                }
                dynamicParam.setRefersOperations(string);
            }
        }
    }


    @RequestMapping("/api/operations/edit")
    public Operation editOperation(
            @RequestParam(name = "id") String id,
            @RequestParam(name = "name") String name,
            @RequestParam(name = "code") String code,
            @RequestParam(name = "description") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams,
            @RequestParam(name = "actions", required = false) String actions

    ) throws Exception {
        Operation operation = operationRepository.findOne(Long.parseLong(id));
        List<DynamicParam> oldInParams = operation.getInParams();
        List<DynamicParam> oldOutParams = operation.getOutParams();
        if (name != null) {
            operation.setName(name);
        }
        if (code != null) {
            operation.setCode(code);
        }
        if (description != null) {
            operation.setDescription(description);
        }
        if (inParams != null) {
            List<DynamicParam> dynamicParams=utils.getIdsFromString(inParams, dynamicParamRepository);
            operation.setInParams(dynamicParams);
            if (oldInParams != null) {
                if (oldInParams.removeAll(dynamicParams))
                    removeLinked(oldInParams, operation);
            }
        }
        if (outParams != null) {
            List<DynamicParam> dynamicParams = utils.getIdsFromString(outParams, dynamicParamRepository);
            operation.setOutParams(dynamicParams);
            if (oldOutParams != null) {
                if (oldOutParams.removeAll(dynamicParams))
                    removeLinked(oldOutParams, operation);
            }
        }
        if(actions!=null){
            List<Action> actionList = utils.getIdsFromString(actions, actionRepository);
            List<ActionInstance> actionInstances = new ArrayList<>();
            for(Action action:actionList){
                actionInstances.add(new ActionInstance(action,null));
            }
            actionInstanceRepository.save(actionInstances);
            operation.setActions(actionInstances);
        }
        operationFactory.update(operation);
        linked(operation);
        return operation;
    }

    @RequestMapping("/api/operations/delete")
    public void deleteOperation(@RequestParam(name = "id") String id) {
        Operation operation = operationRepository.findOne(Long.parseLong(id));
        List<DynamicParam> dynamicInParams = operation.getInParams();
        List<DynamicParam> dynamicOutParams = operation.getOutParams();
        if (dynamicInParams != null)
            removeLinked(dynamicInParams, operation);
        if (dynamicOutParams != null)
            removeLinked(dynamicOutParams, operation);
        operationFactory.delete(Long.parseLong(id));
    }

}
