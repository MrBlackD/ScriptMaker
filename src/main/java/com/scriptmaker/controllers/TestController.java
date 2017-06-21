package com.scriptmaker.controllers;

import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.Node;
import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.ws.Action;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 20.06.2017.
 */
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
