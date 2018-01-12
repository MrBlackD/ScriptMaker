package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.OperationFactory;
import com.scriptmaker.factories.ServiceFactory;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import com.scriptmaker.repository.ServiceRepository;
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
                utils.getDynamicParamsFromString(inParams),
                utils.getDynamicParamsFromString(outParams),
                        utils.getOperationsFromString(operations),
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
            service.setInParams(utils.getDynamicParamsFromString(inParams));
        }
        if (outParams != null) {
            service.setOutParams(utils.getDynamicParamsFromString(outParams));
        }
        if(operations!=null){
            service.setOperations(utils.getOperationsFromString(operations));
        }
        serviceFactory.update(service);
        return service;
    }

    @RequestMapping("/api/services/delete")
    public void deleteService(@RequestParam(name = "id") String id) {
        serviceFactory.delete(Long.parseLong(id));
    }

}
