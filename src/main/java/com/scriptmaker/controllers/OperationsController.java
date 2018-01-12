package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.ActionFactory;
import com.scriptmaker.factories.OperationFactory;
import com.scriptmaker.model.Action;
import com.scriptmaker.model.Node;
import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        Operation newOperation = new Operation(
                name,
                code,
                description,
                utils.getDynamicParamsFromString(inParams),
                utils.getDynamicParamsFromString(outParams),
                node == null ? null : nodeRepository.findOne(Long.parseLong(node)),
                        utils.getActionsFromString(actions)
                );
        operationFactory.create(newOperation);
        return newOperation;
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
            operation.setInParams(utils.getDynamicParamsFromString(inParams));
        }
        if (outParams != null) {
            operation.setOutParams(utils.getDynamicParamsFromString(outParams));
        }
        if(actions!=null){
            operation.setActions(utils.getActionsFromString(actions));
        }
        operationFactory.update(operation);
        return operation;
    }

    @RequestMapping("/api/operations/delete")
    public void deleteOperation(@RequestParam(name = "id") String id) {
        operationFactory.delete(Long.parseLong(id));
    }

}
