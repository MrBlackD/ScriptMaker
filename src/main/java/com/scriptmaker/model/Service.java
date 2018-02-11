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
public class Service extends ScriptEntity {
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
    private List<Operation> operations;
    @OneToOne
    private Node startNode;

    public Service() {
    }

    public Service(String name,
                   String code,
                   String description,
                   List<DynamicParamInstance> inParams,
                   List<DynamicParamInstance> outParams,
                   List<Operation> operations,
                   Node startNode
    ) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.inParams = inParams;
        this.outParams = outParams;
        this.operations = operations;
        this.startNode = startNode;
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

    public List<Operation> getOperations() {
        return operations;
    }

    public void setOperations(List<Operation> operations) {
        this.operations = operations;
    }

    public Node getStartNode() {
        return startNode;
    }

    public void setStartNode(Node startNode) {
        this.startNode = startNode;
    }
}
