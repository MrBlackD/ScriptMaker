package com.scriptmaker.controllers;

import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin
@RestController
public class TestController {

    @Autowired
    private NodeRepository nodeRepository;
    @Autowired
    private OperationRepository operationRepository;

    @RequestMapping("/api/test")
    public Operation getNode(){
        return operationRepository.findOne(1L);
    }
}
