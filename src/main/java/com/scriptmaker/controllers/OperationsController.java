package com.scriptmaker.controllers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.scriptmaker.common.Type;
import com.scriptmaker.common.Utils;
import com.scriptmaker.dto.ActionInstanceDto;
import com.scriptmaker.dto.ParamInstanceDto;
import com.scriptmaker.factories.OperationFactory;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.ParamMapping;
import com.scriptmaker.repository.ActionInstanceRepository;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import com.scriptmaker.repository.ParamMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
    @Autowired
    private ParamMappingRepository paramMappingRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;

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
            @RequestParam(name = "description",defaultValue = "") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams,
            @RequestParam(name = "startNode", required = false) String node,
            @RequestParam(name = "actions", required = false) String actions

    ) throws Exception {
        System.out.println(actions);
        Gson gson = new Gson();
        java.lang.reflect.Type type = new TypeToken<ArrayList<ActionInstanceDto>>() {
        }.getType();
        List<ActionInstanceDto> list = gson.fromJson(actions,type);
        List<ActionInstance> actionInstances = getActionInstances(list);

        java.lang.reflect.Type paramType = new TypeToken<ArrayList<ParamInstanceDto>>() {}.getType();
        List<ParamInstanceDto> inParamsList = gson.fromJson(inParams, paramType);
        List<ParamInstanceDto> outParamsList = gson.fromJson(outParams, paramType);
        List<DynamicParamInstance> inParamInstances = utils.getDynamicParamsInstances(inParamsList);
        List<DynamicParamInstance> outParamInstances = utils.getDynamicParamsInstances(outParamsList);
        dynamicParamInstanceRepository.save(inParamInstances);
        dynamicParamInstanceRepository.save(outParamInstances);
        actionInstanceRepository.save(actionInstances);
        Operation newOperation = new Operation(
                name,
                code,
                description,
                inParamInstances,
                outParamInstances,
                node == null ? null : nodeRepository.findOne(Long.parseLong(node)),
                actionInstances
        );
        operationFactory.create(newOperation);
        linked(newOperation);
        return newOperation;
    }

    private void linked(Operation newOperation) {
        Set<DynamicParam> dynamicParams = new HashSet<>();
        if (dynamicParams != null) {
            Long operationId = operationRepository.findByCode(newOperation.getCode()).getId();
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
                    if (count == strings.length) {
                        dynamicParam.setRefersOperations(string + "," + operationId);
                        dynamicParamRepository.save(dynamicParam);
                    }

                } else {
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
                        string += strings[i] + ",";
                    }
                }
                if (string.equals(""))
                    string = null;
                else {
                    if (string.charAt(string.length() - 1) == ',')
                        string = string.substring(0, string.length() - 1);
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
            @RequestParam(name = "description",defaultValue = "") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams,
            @RequestParam(name = "actions", required = false) String actions

    ) throws Exception {
        Operation operation = operationRepository.findOne(Long.parseLong(id));
        if (name != null) {
            operation.setName(name);
        }
        if (code != null) {
            operation.setCode(code);
        }
        if (description != null) {
            operation.setDescription(description);
        }

        java.lang.reflect.Type paramType = new TypeToken<ArrayList<ParamInstanceDto>>() {}.getType();
        Gson gson = new Gson();



        if(inParams!=null){
            List<ParamInstanceDto> inParamsList = gson.fromJson(inParams, paramType);
            List<DynamicParamInstance> inParamInstances = utils.getDynamicParamsInstances(inParamsList);
            dynamicParamInstanceRepository.save(inParamInstances);
            operation.setInParams(inParamInstances);

        } else {
            operation.setInParams(new ArrayList<>());
        }
        if(outParams!=null){
            List<ParamInstanceDto> outParamsList = gson.fromJson(outParams, paramType);
            List<DynamicParamInstance> outParamInstances = utils.getDynamicParamsInstances(outParamsList);
            dynamicParamInstanceRepository.save(outParamInstances);
            operation.setOutParams(outParamInstances);

        } else {
            operation.setOutParams(new ArrayList<>());
        }

        java.lang.reflect.Type type = new TypeToken<ArrayList<ActionInstanceDto>>() {}.getType();
        List<ActionInstanceDto> list = new Gson().fromJson(actions,type);
        List<ActionInstance> actionInstances = getActionInstances(list);
        actionInstanceRepository.save(actionInstances);
        operation.setActions(actionInstances);
        operationFactory.update(operation);
        linked(operation);
        return operation;
    }

    @RequestMapping("/api/operations/delete")
    public void deleteOperation(@RequestParam(name = "id") String id) {
        operationFactory.delete(Long.parseLong(id));
    }

    private List<ActionInstance> getActionInstances(List<ActionInstanceDto> list) {
        List<ActionInstance> actionInstances = new ArrayList<>();
        for (ActionInstanceDto actionInstanceDto : list) {
            actionInstances.add(getActionInstance(actionInstanceDto));
        }

        return actionInstances;
    }


    private ActionInstance getActionInstance(ActionInstanceDto instanceDto) {
        ActionInstance actionInstance = new ActionInstance();
        actionInstance.setAction(actionRepository.findOne(Long.valueOf(instanceDto.getActionId())));
        List<ParamMapping> paramMappings = new ArrayList<>();
        for (Map<String, String> mapping : instanceDto.getMapping()) {
            ParamMapping paramMapping = new ParamMapping();
            paramMapping.setIn(mapping.get("in"));
            paramMapping.setOut(mapping.get("out"));
            paramMapping.setType(Type.valueOf(mapping.get("type")));
            paramMappings.add(paramMapping);
        }
        actionInstance.setMapping(paramMappings);
        paramMappingRepository.save(paramMappings);
        return actionInstance;
    }

}
