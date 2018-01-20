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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
                utils.getIdsFromString(inParams,dynamicParamRepository),
                utils.getIdsFromString(outParams,dynamicParamRepository),
                utils.getIdsFromString(operations,operationRepository),
                node == null ? null : nodeRepository.findOne(Long.parseLong(node))
                );
        serviceFactory.create(newService);
       linked(newService);
        return newService;
    }

    private void linked(Service newService) {
        Set<DynamicParam> dynamicParams = new HashSet<>();
        if (newService.getInParams() != null) {
            dynamicParams.addAll(newService.getInParams());
        }
        if (newService.getOutParams() != null)
            dynamicParams.addAll(newService.getOutParams());
        if (dynamicParams != null){
            Long serviceId=serviceRepository.findByCode(newService.getCode()).getId();
            for (DynamicParam dynamicParam : dynamicParams) {
                String string = dynamicParam.getRefersServices();
                if (string != null) {
                    String[] strings = string.split(",");
                    int count = 0;
                    for (int i = 0; i < strings.length; i++) {
                        if (!strings[i].equals(newService.getId().toString()))
                            count++;
                        else break;
                    }
                    if (count == strings.length){
                        dynamicParam.setRefersServices(string+","+serviceId);
                        dynamicParamRepository.save(dynamicParam);
                    }

                }
                else {
                    dynamicParam.setRefersServices(serviceId.toString());
                    dynamicParamRepository.save(dynamicParam);
                }

            }
        }

    }

    public static void removeLinked(List<DynamicParam> dynamicParams, Service service) {
        if (dynamicParams != null) {
            for (DynamicParam dynamicParam : dynamicParams) {
                String[] strings = dynamicParam.getRefersServices().split(",");
                String string = "";
                for (int i = 0; i < strings.length; i++) {
                    if (!strings[i].equals(service.getId().toString())) {
                        string += strings[i]+",";
                    }
                }
                if(string.equals(""))
                    string=null;
                else{
                    if(string.charAt(string.length()-1)==',')
                        string=string.substring(0,string.length()-1);
                }
                dynamicParam.setRefersServices(string);
            }
        }
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
        List<DynamicParam> oldInParams = service.getInParams();
        List<DynamicParam> oldOutParams = service.getOutParams();
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
            List<DynamicParam> dynamicParams=utils.getIdsFromString(inParams, dynamicParamRepository);
            service.setInParams(dynamicParams);
            if (oldInParams != null) {
                if (oldInParams.removeAll(dynamicParams))
                    removeLinked(oldInParams, service);
            }
        }
        if (outParams != null) {
            List<DynamicParam> dynamicParams = utils.getIdsFromString(outParams, dynamicParamRepository);
            service.setOutParams(dynamicParams);
            if (oldOutParams != null) {
                if (oldOutParams.removeAll(dynamicParams))
                    removeLinked(oldOutParams, service);
            }
        }
        if(operations!=null){
            service.setOperations( utils.getIdsFromString(operations,operationRepository));
        }
        serviceFactory.update(service);
        linked(service);
        return service;
    }

    @RequestMapping("/api/services/delete")
    public void deleteService(@RequestParam(name = "id") String id) {
        Service service = serviceRepository.findOne(Long.parseLong(id));
        List<DynamicParam> dynamicInParams = service.getInParams();
        List<DynamicParam> dynamicOutParams = service.getOutParams();
        if (dynamicInParams != null)
            removeLinked(dynamicInParams, service);
        if (dynamicOutParams != null)
            removeLinked(dynamicOutParams, service);
        serviceFactory.delete(Long.parseLong(id));
    }

}
