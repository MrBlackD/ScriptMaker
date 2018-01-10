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
                "Тут должно быть описание очень полезного действия",
                Arrays.asList(dynamicParam),
                Collections.singletonList(dynamicParam2)
        );
        this.dynamicParamRepository.save(dynamicParam);
        this.dynamicParamRepository.save(dynamicParam2);
        this.actionRepository.save(action);
        this.actionRepository.save(action2);

        Node node = new Node(action,null,null,200L,200L);

        Node node2 = new Node(action,null,null,150L,150L);
        Node node3 = new Node(action,null,node,50L,50L);
        Condition condition = new Condition("cond",node2,node3);
        Node node4 = new Node(action2,condition,null,100L,100L);
        this.nodeRepository.save(node);
        this.nodeRepository.save(node2);
        this.nodeRepository.save(node3);
        this.conditionRepository.save(condition);
        this.nodeRepository.save(node4);

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
