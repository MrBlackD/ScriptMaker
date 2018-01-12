package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.OperationFactory;
import com.scriptmaker.factories.ServiceFactory;
import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Admin on 07.06.2017.
 */
@CrossOrigin
@RestController
public class ServicesController {

    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private Utils utils;
    @Autowired
    private ServiceFactory serviceFactory;
    @Autowired
    private NodeRepository nodeRepository;
    @Autowired
    private Utils<Operation,OperationRepository> utilForOperation;
    @Autowired
    private Utils<DynamicParam,DynamicParamRepository> utilFordynamicParam;
    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private OperationRepository operationRepository;

    @RequestMapping("/api/services")
    public List<Service> getAllServices() {
        return (List<Service>) serviceRepository.findAll();
    }

    @RequestMapping("/api/services/{id}")
    public Service getService(@PathVariable(name = "id") String id) {
        return serviceRepository.findOne(Long.parseLong(id));
    }

    @RequestMapping("/api/services/new")
    public Service newService(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "code") String code,
            @RequestParam(name = "description") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams,
            @RequestParam(name = "startNode", required = false) String node,
            @RequestParam(name = "operations", required = false) String operations

    ) throws Exception {
        Service newService = new Service(
                name,
                code,
                description,
                utilFordynamicParam.getIdsFromString(inParams,dynamicParamRepository),
                utilFordynamicParam.getIdsFromString(outParams,dynamicParamRepository),
                       utilForOperation.getIdsFromString(operations,operationRepository),
                node == null ? null : nodeRepository.findOne(Long.parseLong(node))
                );
        serviceFactory.create(newService);
        return newService;
    }

    @RequestMapping("/api/services/edit")
    public Service editService(
            @RequestParam(name = "id") String id,
            @RequestParam(name = "name") String name,
            @RequestParam(name = "code") String code,
            @RequestParam(name = "description") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams,
            @RequestParam(name = "operations", required = false) String operations

    ) throws Exception {
        Service service = serviceRepository.findOne(Long.parseLong(id));
        if (name != null) {
            service.setName(name);
        }
        if (code != null) {
            service.setCode(code);
        }
        if (description != null) {
            service.setDescription(description);
        }
        if (inParams != null) {
            service.setInParams( utilFordynamicParam.getIdsFromString(inParams,dynamicParamRepository));
        }
        if (outParams != null) {
            service.setOutParams( utilFordynamicParam.getIdsFromString(outParams,dynamicParamRepository));
        }
        if(operations!=null){
            service.setOperations( utilForOperation.getIdsFromString(operations,operationRepository));
        }
        serviceFactory.update(service);
        return service;
    }

    @RequestMapping("/api/services/delete")
    public void deleteService(@RequestParam(name = "id") String id) {
        serviceFactory.delete(Long.parseLong(id));
    }

}
