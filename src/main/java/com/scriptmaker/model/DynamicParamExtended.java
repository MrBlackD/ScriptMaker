package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Data
@Entity
public class DynamicParamExtended {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private DynamicParam dynamicParam;
    private Boolean required = false;
    private Boolean keepInWorkflow = false;

    public DynamicParamExtended() {
    }

    public DynamicParam getDynamicParam() {
        return dynamicParam;
    }

    public void setDynamicParam(DynamicParam dynamicParam) {
        this.dynamicParam = dynamicParam;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
