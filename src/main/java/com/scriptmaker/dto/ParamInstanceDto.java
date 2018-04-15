package com.scriptmaker.dto;

/**
 * Created by Admin on 15.04.2018.
 */
public class ParamInstanceDto {
    private String id;
    private String required;
    private String keepInWorkflow;
    private String defaultValue;

    public ParamInstanceDto() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequired() {
        return required;
    }

    public void setRequired(String required) {
        this.required = required;
    }

    public String getKeepInWorkflow() {
        return keepInWorkflow;
    }

    public void setKeepInWorkflow(String keepInWorkflow) {
        this.keepInWorkflow = keepInWorkflow;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }
}
