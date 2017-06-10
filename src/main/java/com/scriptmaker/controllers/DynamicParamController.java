package com.scriptmaker.controllers;

import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by Admin on 07.06.2017.
 */
@RestController
public class DynamicParamController {

    @Autowired
    private DynamicParamRepository dynamicParamRepository;

    @RequestMapping("/api/dynamicParams")
    public List<DynamicParam> getAllParams(){
        List<DynamicParam> list = new ArrayList<>();
        Iterable<DynamicParam> dynamicParams = dynamicParamRepository.findAll();
        for (DynamicParam dynamicParam : dynamicParams) {
            list.add(dynamicParam);
        }
        return list;
    }

    @RequestMapping("/api/dynamicParams/new")
    public DynamicParam newParam(@RequestParam(name="name")String name,
                                 @RequestParam(name="code")String code,
                                 @RequestParam(name="description")String description,
                                 @RequestParam(name="required",required = false) String required,
                                 @RequestParam(name="keepInWorkflow",required = false) String keepInWorkflow){

        DynamicParam newParam = new DynamicParam(
                name,
                code,
                description,
                Boolean.parseBoolean(required),
                Boolean.parseBoolean(keepInWorkflow)
        );
        dynamicParamRepository.save(newParam);
        return newParam;
    }

    @RequestMapping("/api/dynamicParams/edit")
    public DynamicParam editParam(@RequestParam(name="id")String id,
                                  @RequestParam(name="name",required = false) String name,
                                  @RequestParam(name="code",required = false) String code,
                                  @RequestParam(name="description",required = false) String description,
                                  @RequestParam(name="required",required = false) String required,
                                  @RequestParam(name="keepInWorkflow",required = false) String  keepInWorkflow){

        DynamicParam dynamicParam = dynamicParamRepository.findOne(Long.parseLong(id));
        String newName = name != null ? name : dynamicParam.getName();
        String newCode = code != null ? code : dynamicParam.getCode();
        String newDescription = description != null ? description : dynamicParam.getDescription();
        Boolean newRequired = required != null ? Boolean.parseBoolean(required) : dynamicParam.getRequired();
        Boolean newKeepInWorkflow = keepInWorkflow != null ? Boolean.parseBoolean(keepInWorkflow) : dynamicParam.getKeepInWorkflow();
        dynamicParam.setName(newName);
        dynamicParam.setCode(newCode);
        dynamicParam.setDescription(newDescription);
        dynamicParam.setRequired(newRequired);
        dynamicParam.setKeepInWorkflow(newKeepInWorkflow);
        dynamicParamRepository.save(dynamicParam);
        return dynamicParam;
    }

    @RequestMapping("/api/dynamicParams/delete")
    public void deleteParam(@RequestParam(name="id") String id){
        dynamicParamRepository.delete(Long.parseLong(id));
    }
}
