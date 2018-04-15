package com.scriptmaker.controllers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.scriptmaker.common.Utils;
import com.scriptmaker.dto.ParamInstanceDto;
import com.scriptmaker.factories.ServiceFactory;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.repository.NodeRepository;
import com.scriptmaker.repository.OperationRepository;
import com.scriptmaker.repository.ServiceRepository;
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
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;

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
        java.lang.reflect.Type type = new TypeToken<ArrayList<ParamInstanceDto>>() {}.getType();
        Gson gson = new Gson();
        List<ParamInstanceDto> inParamsList = gson.fromJson(inParams, type);
        List<ParamInstanceDto> outParamsList = gson.fromJson(outParams, type);
        List<DynamicParamInstance> inParamInstances = utils.getDynamicParamsInstances(inParamsList);
        List<DynamicParamInstance> outParamInstances = utils.getDynamicParamsInstances(outParamsList);
        dynamicParamInstanceRepository.save(inParamInstances);
        dynamicParamInstanceRepository.save(outParamInstances);
        Service newService = new Service(
                name,
                code,
                description,
                inParamInstances,
                outParamInstances,
                utils.getIdsFromString(operations, operationRepository),
                node == null ? null : nodeRepository.findOne(Long.parseLong(node))
        );
        serviceFactory.create(newService);
        linked(newService);
        return newService;
    }

    private void linked(Service newService) {
        Set<DynamicParam> dynamicParams = new HashSet<>();
        if (dynamicParams != null) {
            Long serviceId = serviceRepository.findByCode(newService.getCode()).getId();
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
                    if (count == strings.length) {
                        dynamicParam.setRefersServices(string + "," + serviceId);
                        dynamicParamRepository.save(dynamicParam);
                    }

                } else {
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
                        string += strings[i] + ",";
                    }
                }
                if (string.equals(""))
                    string = null;
                else {
                    if (string.charAt(string.length() - 1) == ',')
                        string = string.substring(0, string.length() - 1);
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

        java.lang.reflect.Type type = new TypeToken<ArrayList<ParamInstanceDto>>() {}.getType();
        Gson gson = new Gson();


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
        if(inParams!=null){
            List<ParamInstanceDto> inParamsList = gson.fromJson(inParams, type);
            List<DynamicParamInstance> inParamInstances = utils.getDynamicParamsInstances(inParamsList);
            dynamicParamInstanceRepository.save(inParamInstances);
            service.setInParams(inParamInstances);
        } else {
            service.setInParams(new ArrayList<>());
        }
        if(outParams!=null){
            List<ParamInstanceDto> outParamsList = gson.fromJson(outParams, type);
            List<DynamicParamInstance> outParamInstances = utils.getDynamicParamsInstances(outParamsList);
            dynamicParamInstanceRepository.save(outParamInstances);
            service.setOutParams(outParamInstances);
        } else {
            service.setOutParams(new ArrayList<>());
        }
        if (operations != null) {
            service.setOperations(utils.getIdsFromString(operations, operationRepository));
        }
        serviceFactory.update(service);
        linked(service);
        return service;
    }

    @RequestMapping("/api/services/delete")
    public void deleteService(@RequestParam(name = "id") String id) {
        serviceFactory.delete(Long.parseLong(id));
    }

}
