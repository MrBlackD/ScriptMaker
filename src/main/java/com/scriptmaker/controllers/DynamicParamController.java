package com.scriptmaker.controllers;

import com.scriptmaker.factories.DynamicParamFactory;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
public class DynamicParamController {

    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private DynamicParamFactory dynamicParamFactory;

    @RequestMapping("/api/dynamicParams")
    public List<DynamicParam> getAllParams(){
        return (List<DynamicParam>)dynamicParamRepository.findAll();
    }

    @RequestMapping("/api/dynamicParams/new")
    public DynamicParam newParam(@RequestParam(name="name")String name,
                                 @RequestParam(name="code")String code,
                                 @RequestParam(name="description")String description,
                                 @RequestParam(name="required",required = false) String required,
                                 @RequestParam(name="keepInWorkflow",required = false) String keepInWorkflow) throws Exception {

        DynamicParam newParam = new DynamicParam(
                name,
                code,
                description,
                Boolean.parseBoolean(required),
                Boolean.parseBoolean(keepInWorkflow)
        );
        dynamicParamFactory.create(newParam);
        return newParam;
    }

    @RequestMapping("/api/dynamicParams/edit")
    public DynamicParam editParam(@RequestParam(name="id")String id,
                                  @RequestParam(name="name",required = false) String name,
                                  @RequestParam(name="code",required = false) String code,
                                  @RequestParam(name="description",required = false) String description,
                                  @RequestParam(name="required",required = false) String required,
                                  @RequestParam(name="keepInWorkflow",required = false) String  keepInWorkflow) throws Exception {

        DynamicParam dynamicParam = dynamicParamRepository.findOne(Long.parseLong(id));
        if(name!=null){
            dynamicParam.setName(name);
        }
        if(code!=null){
            dynamicParam.setCode(code);
        }
        if(description!=null){
            dynamicParam.setDescription(description);
        }
        if(required!=null){
            dynamicParam.setRequired(Boolean.parseBoolean(required));
        }
        if(keepInWorkflow!=null){
            dynamicParam.setKeepInWorkflow(Boolean.parseBoolean(keepInWorkflow));
        }
        dynamicParamFactory.update(dynamicParam);
        return dynamicParam;
    }

    @RequestMapping("/api/dynamicParams/delete")
    public void deleteParam(@RequestParam(name="id") String id){
        dynamicParamFactory.delete(Long.parseLong(id));
    }
}
