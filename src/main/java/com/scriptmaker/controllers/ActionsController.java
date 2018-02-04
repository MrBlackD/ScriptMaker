package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.factories.ActionFactory;
import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
public class ActionsController {

    @Autowired
    private ActionFactory actionFactory;
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;
    @Autowired
    private Utils utils;

    @RequestMapping("/api/actions")
    public List<Action> getAllActions() {
        return (List<Action>) actionRepository.findAll();
    }

    @RequestMapping("/api/actions/{id}")
    public Action getAction(@PathVariable(name = "id") String id) {
        return actionRepository.findOne(Long.parseLong(id));
    }

    @RequestMapping("/api/actions/new")
    public Action newAction(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "code") String code,
            @RequestParam(name = "module") String module,
            @RequestParam(name = "description") String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams
    ) throws Exception {
        List<DynamicParamInstance> inParamInstances = utils.getDynamicParamsInstances(inParams);
        List<DynamicParamInstance> outParamInstances = utils.getDynamicParamsInstances(outParams);
        dynamicParamInstanceRepository.save(inParamInstances);
        dynamicParamInstanceRepository.save(outParamInstances);
        Action newAction = new Action(
                name,
                code,
                module,
                description,
                inParamInstances,
                outParamInstances
        );
        actionFactory.create(newAction);
        utils.linked(newAction,actionRepository);
        return newAction;
    }



    public static void removeLinked(List<DynamicParam> dynamicParams, Action action) {
        if (dynamicParams != null) {
            for (DynamicParam dynamicParam : dynamicParams) {
                String[] strings = dynamicParam.getRefersActions().split(",");
                String string = "";
                for (int i = 0; i < strings.length; i++) {
                    if (!strings[i].equals(action.getId().toString())) {
                        string += strings[i] + ",";
                    }
                }
                if (string.equals(""))
                    string = null;
                else {
                    if (string.charAt(string.length() - 1) == ',')
                        string = string.substring(0, string.length() - 1);
                }
                dynamicParam.setRefersActions(string);
            }
        }
    }

    @RequestMapping("/api/actions/edit")
    public Action editAction(
            @RequestParam(name = "id") String id,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "module", required = false) String module,
            @RequestParam(name = "description", required = false) String description,
            @RequestParam(name = "inParams", required = false) String inParams,
            @RequestParam(name = "outParams", required = false) String outParams
    ) throws Exception {
        Action action = actionRepository.findOne(Long.parseLong(id));


        List<DynamicParam> oldInParams = action.getInParamsLink();
        List<DynamicParam> oldOutParams = action.getOutParamsLink();
        if (name != null) {
            action.setName(name);
        }
        if (code != null) {
            action.setCode(code);
        }
        if (module != null) {
            action.setModule(module);
        }
        if (description != null) {
            action.setDescription(description);
        }
        if (inParams != null) {
            List<DynamicParamInstance> inParamInstances = utils.getDynamicParamsInstances(inParams);
            dynamicParamInstanceRepository.save(inParamInstances);
            action.setInParams(inParamInstances);
            if (oldInParams != null) {
                if (oldInParams.removeAll(action.getInParamsLink()))
                    removeLinked(oldInParams, action);
            }
        } else {
            action.setInParams(new ArrayList<>());
        }
        if (outParams != null) {
            List<DynamicParamInstance> outParamInstances = utils.getDynamicParamsInstances(outParams);
            dynamicParamInstanceRepository.save(outParamInstances);
            action.setOutParams(outParamInstances);
            if (oldOutParams != null) {
                if (oldOutParams.removeAll(action.getOutParamsLink()))
                    removeLinked(oldOutParams, action);
            }
        } else {
            action.setOutParams(new ArrayList<>());
        }
        actionFactory.update(action);
        utils.linked(action,actionRepository);
        return action;
    }

    @RequestMapping("/api/actions/delete")
    public void deleteAction(@RequestParam(name = "id") String id) {
        Action action = actionRepository.findOne(Long.parseLong(id));
        List<DynamicParam> dynamicInParams = action.getInParamsLink();
        List<DynamicParam> dynamicOutParams = action.getOutParamsLink();
        if (dynamicInParams != null)
            removeLinked(dynamicInParams, action);
        if (dynamicOutParams != null)
            removeLinked(dynamicOutParams, action);
        actionFactory.delete(Long.parseLong(id));

    }
}
