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
    private String type;
    private String refersActions;
    private String refersOperations;
    private String refersServices;

    public String getRefersOperations() {
        return refersOperations;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public DynamicParam(String name, String code, String type) {
        this.name = name;
        this.code = code;
        this.type = type;
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

    public DynamicParam(String name, String code) {
        this.name = name;
        this.code = code;
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


}
