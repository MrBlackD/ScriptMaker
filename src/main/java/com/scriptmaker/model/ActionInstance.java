package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.List;

/**
 * Created by Admin on 17.01.2018.
 */
@Data
@Entity
public class ActionInstance {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private Action action;
    @OneToMany
    private List<ParamMapping> mapping;

    public ActionInstance(Action action, List<ParamMapping> mapping) {
        this.action = action;
        this.mapping = mapping;
    }

    public ActionInstance() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public List<ParamMapping> getMapping() {
        return mapping;
    }

    public void setMapping(List<ParamMapping> mapping) {
        this.mapping = mapping;
    }
}

