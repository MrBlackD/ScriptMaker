package com.scriptmaker.model;

import com.scriptmaker.common.Type;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class ParamMapping {
    @Id
    @GeneratedValue
    private Long id;
    private String in;
    private String out;
    private Type type;

    public ParamMapping() {
    }

    public ParamMapping(String from, String to, Type type) {
        this.in = from;
        this.out = to;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIn() {
        return in;
    }

    public void setIn(String in) {
        this.in = in;
    }

    public String getOut() {
        return out;
    }

    public void setOut(String out) {
        this.out = out;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
