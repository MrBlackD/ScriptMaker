package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Admin on 07.06.2017.
 */
@RestController
public class ActionsController {

    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private Utils utils;

    @RequestMapping("/api/actions")
    public List<Action> getAllActions(){
        List<Action> list = new ArrayList<>();
        Iterable<Action> actions = actionRepository.findAll();
        for(Action action : actions){
            list.add(action);
        }
        return list;
    }

    @RequestMapping("/api/actions/{id}")
    public Action getAction(@PathVariable(name = "id") String id){
        return actionRepository.findOne(Long.parseLong(id));
    }

    @RequestMapping("/api/actions/new")
    public Action newAction(
            @RequestParam(name="name") String name,
            @RequestParam(name="code") String code,
            @RequestParam(name="module") String module,
            @RequestParam(name="description") String description,
            @RequestParam(name="inParams", required = false) String inParams,
            @RequestParam(name="outParams", required = false) String outParams
    ){
        Action newAction = new Action();
        newAction.setName(name);
        newAction.setCode(code);
        newAction.setModule(module);
        newAction.setDescription(description);
        newAction.setInParams(utils.getDynamicParamsFromString(inParams));
        newAction.setOutParams(utils.getDynamicParamsFromString(outParams));
        actionRepository.save(newAction);
        return newAction;
    }

    @RequestMapping("/api/actions/edit")
    public Action editAction(
            @RequestParam(name="id") String id,
            @RequestParam(name="name",required = false) String name,
            @RequestParam(name="code",required = false) String code,
            @RequestParam(name="module",required = false) String module,
            @RequestParam(name="description",required = false) String description,
            @RequestParam(name="inParams", required = false) String inParams,
            @RequestParam(name="outParams", required = false) String outParams
    ){
        Action action = actionRepository.findOne(Long.parseLong(id));
        String newName = name == null? action.getName() : name;
        String newCode = code == null? action.getCode() : code;
        String newModule = module == null? action.getModule() : module;
        String newDescription = description == null? action.getDescription() : description;
        List<DynamicParam> newInParams = utils.getDynamicParamsFromString(inParams);
        List<DynamicParam> newOutParams = utils.getDynamicParamsFromString(outParams);
        action.setName(newName);
        action.setCode(newCode);
        action.setModule(newModule);
        action.setDescription(newDescription);
        action.setInParams(newInParams);
        action.setOutParams(newOutParams);
        actionRepository.save(action);
        return action;
    }

    @RequestMapping("/api/actions/delete")
    public void deleteAction(@RequestParam(name="id") String id){
        actionRepository.delete(Long.parseLong(id));
    }
}
