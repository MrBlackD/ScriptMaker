package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import java.util.List;

@Data
@Entity
public class Operation extends ScriptEntity{
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String code;
    @Column( length = 100000 )
    private String description;
    @ManyToMany
    private List<DynamicParamInstance> inParams;
    @ManyToMany
    private List<DynamicParamInstance> outParams;
    @ManyToMany
    private List<ActionInstance> actions;
    @OneToOne
    private Node startNode;

    public Operation(String name,
                     String code,
                     String description,
                     List<DynamicParamInstance> inParams,
                     List<DynamicParamInstance> outParams,
                     Node startNode) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.inParams = inParams;
        this.outParams = outParams;
        this.startNode = startNode;
    }
    public List<ActionInstance> getActions() {
        return actions;
    }

    public void setActions(List<ActionInstance> actions) {
        this.actions = actions;
    }

    public Operation() {
    }

    public Operation(String name,
                     String code,
                     String description,
                     List<DynamicParamInstance> inParams,
                     List<DynamicParamInstance> outParams,
                     Node startNode,
                     List<ActionInstance> actions) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.inParams = inParams;
        this.outParams = outParams;
        this.startNode = startNode;
        this.actions=actions;
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

    public Node getStartNode() {
        return startNode;
    }

    public void setStartNode(Node startNode) {
        this.startNode = startNode;
    }
}
