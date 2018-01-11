package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.ActionFactory;
import com.scriptmaker.model.Action;
import com.scriptmaker.repository.ActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class ActionsController {

    @Autowired
    private ActionFactory actionFactory;
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private Utils utils;

    @RequestMapping("/api/actions")
    public List<Action> getAllActions(){
        return  (List<Action>)actionRepository.findAll();
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
    ) throws Exception {
        Action newAction = new Action(name,code,module,description,utils.getDynamicParamsFromString(inParams),utils.getDynamicParamsFromString(outParams));
        actionFactory.create(newAction);
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
    ) throws Exception {
        Action action = actionRepository.findOne(Long.parseLong(id));
        if(name!=null){
            action.setName(name);
        }
        if(code!=null){
            action.setCode(code);
        }
        if(module!=null){
            action.setModule(module);
        }
        if(description!=null){
            action.setDescription(description);
        }
        if(inParams!=null){
            action.setInParams(utils.getDynamicParamsFromString(inParams));
        }
        if(outParams!=null){
            action.setOutParams(utils.getDynamicParamsFromString(outParams));
        }
        actionFactory.update(action);
        return action;
    }

    @RequestMapping("/api/actions/delete")
    public void deleteAction(@RequestParam(name="id") String id){
        actionFactory.delete(Long.parseLong(id));
    }
}
