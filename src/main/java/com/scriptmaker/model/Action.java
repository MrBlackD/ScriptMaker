package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
    private List<DynamicParamInstance> inParams;
    @ManyToMany
    private List<DynamicParamInstance> outParams;

    public List<DynamicParam> getOutParamsLink(){
        List<DynamicParam> dynamicParams=new ArrayList<>();
        for (DynamicParamInstance dpi:outParams) {
            dynamicParams.add(dpi.getDynamicParam());
        }
        return dynamicParams;
    }

    public List<DynamicParam> getInParamsLink() {
        List<DynamicParam> dynamicParams=new ArrayList<>();
        for (DynamicParamInstance dpi:inParams) {
            dynamicParams.add(dpi.getDynamicParam());
        }
        return dynamicParams;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Action action = (Action) o;
        return Objects.equals(id, action.id) &&
                Objects.equals(name, action.name) &&
                Objects.equals(code, action.code) &&
                Objects.equals(module, action.module) &&
                Objects.equals(description, action.description) &&
                Objects.equals(inParams, action.inParams) &&
                Objects.equals(outParams, action.outParams);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, name, code, module, description, inParams, outParams);
    }

    public Action() {
    }

    public Action(String name,
                  String code,
                  String module,
                  String description,
                  List<DynamicParamInstance> inParams,
                  List<DynamicParamInstance> outParams) {
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
