package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Entity
public class DynamicParam {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String code;
    private String description;
    private Boolean required = false;
    private Boolean keepInWorkflow = false;
    private String refersActions;
    private String refersOperations;
    private String refersServices;

    public String getRefersOperations() {
        return refersOperations;
    }

    public void setRefersOperations(String refersOperations) {
        this.refersOperations = refersOperations;
    }

    public String getRefersServices() {
        return refersServices;
    }

    public void setRefersServices(String refersServices) {
        this.refersServices = refersServices;
    }

    public String getRefersActions() {
        return refersActions;
    }

    public void setRefersActions(String refersActions) {
        this.refersActions = refersActions;
    }

    public DynamicParam() {
    }

    public DynamicParam(String name, String code, String description) {
        this.name = name;
        this.code = code;
        this.description = description;
    }

    public DynamicParam(String name, String code, String description, Boolean required, Boolean keepInWorkflow) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.required = required;
        this.keepInWorkflow = keepInWorkflow;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Boolean getKeepInWorkflow() {
        return keepInWorkflow;
    }

    public void setKeepInWorkflow(Boolean keepInWorkflow) {
        this.keepInWorkflow = keepInWorkflow;
    }
}
