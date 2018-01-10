package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
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

    @RequestMapping("/api/operations")
    public List<Operation> getAllOperations(){
        return (List<Operation>)operationRepository.findAll();
    }

    @RequestMapping("/api/operations/{id}")
    public Operation getOperation(@PathVariable(name = "id") String id){
        return operationRepository.findOne(Long.parseLong(id));
    }

}
