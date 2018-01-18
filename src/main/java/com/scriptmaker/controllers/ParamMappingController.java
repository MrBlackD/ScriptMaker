package com.scriptmaker.controllers;


import com.scriptmaker.common.Type;
import com.scriptmaker.model.ParamMapping;
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
public class ParamMappingController {

    @Autowired
    private ParamMappingRepository mappingRepository;

    @RequestMapping("/api/mapping")
    public List<ParamMapping> getAllMapping() {
        return (List<ParamMapping>) mappingRepository.findAll();
    }

    @RequestMapping("/api/mapping/{id}")
    public ParamMapping getMapping(@PathVariable(name = "id") String id) {
        return mappingRepository.findOne(Long.parseLong(id));
    }

    @RequestMapping("/api/mapping/new")
    public ParamMapping newAction(@RequestParam(name = "in") String in,
                                  @RequestParam(name = "out") String out,
                                  @RequestParam(name = "type") String type)
            throws Exception {

        ParamMapping mapping = new ParamMapping();
        mapping.setIn(in);
        mapping.setOut(out);
        mapping.setType(Type.valueOf(type));
        mappingRepository.save(mapping);
        return mapping;
    }

    @RequestMapping("/api/mapping/edit")
    public ParamMapping editAction(@RequestParam(name = "id") String id,
                                   @RequestParam(name = "in") String in,
                                   @RequestParam(name = "out") String out,
                                   @RequestParam(name = "type") String type)
            throws Exception {
        ParamMapping mapping = mappingRepository.findOne(Long.valueOf(id));
        mapping.setIn(in);
        mapping.setOut(out);
        mapping.setType(Type.valueOf(type));
        mappingRepository.save(mapping);
        return mapping;
    }

    @RequestMapping("/api/mapping/delete")
    public void deleteAction(@RequestParam(name = "id") String id) {
        mappingRepository.delete(Long.parseLong(id));
    }
}
