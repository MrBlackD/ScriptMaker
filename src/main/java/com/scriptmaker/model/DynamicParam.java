package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class DynamicParam {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String code;
    private String description;

    public DynamicParam() {
    }

    public DynamicParam(String name, String code, String description) {
        this.name = name;
        this.code = code;
        this.description = description;
    }
}
