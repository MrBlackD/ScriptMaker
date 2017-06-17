package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
public class Action {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String code;
    private String module;
    private String description;
    @ManyToMany
    private List<DynamicParam> inParams;
    @ManyToMany
    private List<DynamicParam> outParams;

    public Action() {
    }

    public Action(String name, String code, String module, String description, List<DynamicParam> inParams, List<DynamicParam> outParams) {
        this.name = name;
        this.code = code;
        this.module = module;
        this.description = description;
        this.inParams = inParams;
        this.outParams = outParams;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<DynamicParam> getInParams() {
        return inParams;
    }

    public void setInParams(List<DynamicParam> inParams) {
        this.inParams = inParams;
    }

    public List<DynamicParam> getOutParams() {
        return outParams;
    }

    public void setOutParams(List<DynamicParam> outParams) {
        this.outParams = outParams;
    }
}
