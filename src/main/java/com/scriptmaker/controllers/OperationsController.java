package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.ActionFactory;
import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 07.06.2017.
 */
@RestController
public class OperationsController {

    @Autowired
    private OperationRepository operationRepository;
    @Autowired
    private Utils utils;

    @RequestMapping("/api/operations")
    public List<Operation> getAllOperations(){
        List<Operation> list = new ArrayList<>();
        Iterable<Operation> operations = operationRepository.findAll();
        for(Operation operation : operations){
            list.add(operation);
        }
        return list;
    }

    @RequestMapping("/api/operations/{id}")
    public Operation getOperation(@PathVariable(name = "id") String id){
        return operationRepository.findOne(Long.parseLong(id));
    }

}
