package com.scriptmaker.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Node {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne
    private Action action;
    @OneToOne
    private Condition condition;
    @OneToOne
    private Node nextNode;


    public Node() {
    }

    public Node(Action action, Condition condition, Node nextNode) {
        this.action = action;
        this.condition = condition;
        this.nextNode = nextNode;
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

    public Condition getCondition() {
        return condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public Node getNextNode() {
        return nextNode;
    }

    public void setNextNode(Node nextNode) {
        this.nextNode = nextNode;
    }
}
