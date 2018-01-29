package com.scriptmaker.model;

import java.util.List;

/**
 * Created by Admin on 29.01.2018.
 */
public class ScriptEntity {
    protected String name;
    protected String code;
    protected String description;
    private List<DynamicParamInstance> inParams;
    private List<DynamicParamInstance> outParams;


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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<DynamicParamInstance> getInParams() {
        return inParams;
    }

    public void setInParams(List<DynamicParamInstance> inParams) {
        this.inParams = inParams;
    }

    public List<DynamicParamInstance> getOutParams() {
        return outParams;
    }

    public void setOutParams(List<DynamicParamInstance> outParams) {
        this.outParams = outParams;
    }
}
