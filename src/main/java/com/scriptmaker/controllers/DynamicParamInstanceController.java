package com.scriptmaker.controllers;

import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
public class DynamicParamInstanceController {

    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;


    @RequestMapping("/api/dynamicParamInstances")
    public List<DynamicParamInstance> getAllParams() {
        return (List<DynamicParamInstance>)dynamicParamInstanceRepository.findAll();
    }

    @RequestMapping("/api/dynamicParamInstances/new")
    public DynamicParamInstance newParam(
            @RequestParam(name="paramId")String paramId,
            @RequestParam(name="defaultValue",required = false)String defaultValue,
            @RequestParam(name="keepInWorkflow")Boolean keepInWorkflow,
            @RequestParam(name="required")Boolean required) throws Exception {

        DynamicParamInstance dynamicParamInstance = new DynamicParamInstance();
        dynamicParamInstance.setDynamicParam(dynamicParamRepository.findOne(Long.valueOf(paramId)));
        dynamicParamInstance.setDefaultValue(defaultValue);
        dynamicParamInstance.setKeepInWorkflow(keepInWorkflow);
        dynamicParamInstance.setRequired(required);
        dynamicParamInstanceRepository.save(dynamicParamInstance);
        return dynamicParamInstance;
    }

    @RequestMapping("/api/dynamicParamInstances/edit")
    public DynamicParamInstance editParam(
            @RequestParam(name="id")String id,
            @RequestParam(name="defaultValue",required = false) String defaultValue,
            @RequestParam(name="keepInWorkflow") Boolean keepInWorkflow,
            @RequestParam(name="required") Boolean required)
            throws Exception {

        DynamicParamInstance dynamicParamInstance = dynamicParamInstanceRepository.findOne(Long.valueOf(id));
        dynamicParamInstance.setDefaultValue(defaultValue);
        dynamicParamInstance.setKeepInWorkflow(keepInWorkflow);
        dynamicParamInstance.setRequired(required);
        dynamicParamInstanceRepository.save(dynamicParamInstance);
        return dynamicParamInstance;
    }

    @RequestMapping("/api/dynamicParamInstances/delete")
    public void deleteParam(@RequestParam(name="id") String id){
        dynamicParamInstanceRepository.delete(Long.parseLong(id));
    }
}
