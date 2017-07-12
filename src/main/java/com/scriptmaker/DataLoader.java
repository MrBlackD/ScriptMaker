package com.scriptmaker;

import com.scriptmaker.model.*;
import com.scriptmaker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

@Component
public class DataLoader implements CommandLineRunner {

    private final DynamicParamRepository dynamicParamRepository;
    private final ActionRepository actionRepository;
    private final OperationRepository operationRepository;
    private final NodeRepository nodeRepository;
    private final ConditionRepository conditionRepository;

    @Autowired
    public DataLoader(DynamicParamRepository dynamicParamRepository,
                      ActionRepository actionRepository,
                      OperationRepository operationRepository,
                      NodeRepository nodeRepository,
                      ConditionRepository conditionRepository
    ) {
        this.dynamicParamRepository = dynamicParamRepository;
        this.actionRepository = actionRepository;
        this.operationRepository = operationRepository;
        this.nodeRepository = nodeRepository;
        this.conditionRepository = conditionRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        DynamicParam dynamicParam = new DynamicParam("Тестовый динамический параметр","test","");
        DynamicParam dynamicParam2 = new DynamicParam("Новый параметр","NEW","Новый параметр для теста");
        Action action = new Action(
                "name",
                "code",
                "module",
                "description",
                Collections.singletonList(dynamicParam),
                Collections.singletonList(dynamicParam)
        );
        Action action2 = new Action(
                "Очень полезное действие",
                "DoSomeShitAction",
                "another module",
                "Тут должно быть описание очень полезного действия которое делает некоторое дерьмо",
                Arrays.asList(dynamicParam),
                Collections.singletonList(dynamicParam2)
        );
        this.dynamicParamRepository.save(dynamicParam);
        this.dynamicParamRepository.save(dynamicParam2);
        this.actionRepository.save(action);
        this.actionRepository.save(action2);

        Node node = new Node(action,null,null,200L,200L);

        Node node2 = new Node(action,null,node,150L,150L);
        Condition condition = new Condition("cond",node,node2);
        Node node3 = new Node(null,condition,null,0L,0L);
        Node node4 = new Node(action2,null,node2,100L,100L);
        this.nodeRepository.save(node);
        this.nodeRepository.save(node2);
        this.conditionRepository.save(condition);
        this.nodeRepository.save(node3);
        this.nodeRepository.save(node4);

//        Node node = new Node(action.getId(),null,null);
//        this.nodeRepository.save(node);
//        Node node2 = new Node(null,null,null);
//        this.nodeRepository.save(node2);
//        node.setNextNodeId(node2.getId());
//        this.nodeRepository.save(node);
//
//        Node node3 = new Node(action2.getId(),null,null);
//        this.nodeRepository.save(node3);
//
//        Condition condition = new Condition("cond",node.getId(),node3.getId());
//        this.conditionRepository.save(condition);
//
//        node2.setConditionId(condition.getId());
//        this.nodeRepository.save(node2);
//
        Operation operation = new Operation(
                "operName",
                "operCode",
                "operDesc",
                Arrays.asList(dynamicParam),
                Arrays.asList(dynamicParam2),
                node4
        );


        this.operationRepository.save(operation);
    }
}
