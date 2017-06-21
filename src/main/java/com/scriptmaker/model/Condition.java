package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@Data
@Entity
public class Condition {
    @Id
    @GeneratedValue
    private Long id;
    private String condition;
    @OneToOne
    private Node isTrueNode;
    @OneToOne
    private Node isFalseNode;

    public Condition() {
    }

    public Condition(String condition, Node isTrueNode, Node isFalseNode) {
        this.condition = condition;
        this.isTrueNode = isTrueNode;
        this.isFalseNode = isFalseNode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Node getIsTrueNode() {
        return isTrueNode;
    }

    public void setIsTrueNode(Node isTrueNode) {
        this.isTrueNode = isTrueNode;
    }

    public Node getIsFalseNode() {
        return isFalseNode;
    }

    public void setIsFalseNode(Node isFalseNode) {
        this.isFalseNode = isFalseNode;
    }
}
