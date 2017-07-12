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
    private Long x;
    private Long y;


    public Node() {
    }

    public Node(Action action, Condition condition, Node nextNode, Long x, Long y) {
        this.action = action;
        this.condition = condition;
        this.nextNode = nextNode;
        this.x = x;
        this.y = y;
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

    public Long getX() {
        return x;
    }

    public void setX(Long x) {
        this.x = x;
    }

    public Long getY() {
        return y;
    }

    public void setY(Long y) {
        this.y = y;
    }
}
