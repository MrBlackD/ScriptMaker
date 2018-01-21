package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import java.util.Objects;

@Data
@Entity
public class DynamicParamInstance {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private DynamicParam dynamicParam;
    private Boolean required = false;
    private Boolean keepInWorkflow = false;
    private String defaultValue;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DynamicParamInstance dynamicParamInstance = (DynamicParamInstance) o;
        return Objects.equals(dynamicParam.getId(), dynamicParamInstance.dynamicParam.getId()) &&
                Objects.equals(required, dynamicParamInstance.required) &&
                Objects.equals(keepInWorkflow, dynamicParamInstance.keepInWorkflow) &&
                Objects.equals(defaultValue, dynamicParamInstance.defaultValue);
    }

    @Override
    public int hashCode() {

        return Objects.hash(dynamicParam.getId(), required, keepInWorkflow, defaultValue);
    }

    public DynamicParamInstance() {
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

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }
}
