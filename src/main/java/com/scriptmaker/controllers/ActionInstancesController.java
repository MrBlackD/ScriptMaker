package com.scriptmaker.controllers;

import com.scriptmaker.common.Utils;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.ParamMapping;
import com.scriptmaker.repository.ActionInstanceRepository;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.ParamMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
public class ActionInstancesController {

    @Autowired
    private ActionInstanceRepository actionInstanceRepository;
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private ParamMappingRepository mappingRepository;
    @Autowired
    private Utils utils;

    @RequestMapping("/api/actionInstances")
    public List<ActionInstance> getAllActions() {
        return (List<ActionInstance>) actionInstanceRepository.findAll();
    }

    @RequestMapping("/api/actionInstances/{id}")
    public ActionInstance getAction(@PathVariable(name = "id") String id) {
        return actionInstanceRepository.findOne(Long.parseLong(id));
    }

    @RequestMapping("/api/actionInstances/new")
    public ActionInstance newAction(@RequestParam(name = "actionId") String actionId,
                                    @RequestParam(name = "mappingId") String mappingId)
            throws Exception {

        ActionInstance actionInstance = new ActionInstance();
        actionInstance.setAction(actionRepository.findOne(Long.valueOf(actionId)));
        List<ParamMapping> mappingList = utils.getIdsFromString(mappingId, mappingRepository);
        actionInstance.setMapping(mappingList);
        actionInstanceRepository.save(actionInstance);
        return actionInstance;
    }

    @RequestMapping("/api/actionInstances/edit")
    public ActionInstance editAction(
            @RequestParam(name = "id") String id,
            @RequestParam(name = "actionId",required = false) String actionId)
            throws Exception {
        ActionInstance actionInstance = actionInstanceRepository.findOne(Long.valueOf(id));
        if(actionId!=null&&!actionId.isEmpty()) {
            actionInstance.setAction(actionRepository.findOne(Long.valueOf(actionId)));
        }
        actionInstanceRepository.save(actionInstance);
        return actionInstance;
    }

    @RequestMapping("/api/actionInstances/delete")
    public void deleteAction(@RequestParam(name = "id") String id) {
        actionInstanceRepository.delete(Long.parseLong(id));
    }
}
