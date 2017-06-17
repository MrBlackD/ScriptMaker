package com.scriptmaker;

import com.scriptmaker.model.Action;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.model.DynamicParam;
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

    @Autowired
    public DataLoader(DynamicParamRepository dynamicParamRepository,ActionRepository actionRepository) {
        this.dynamicParamRepository = dynamicParamRepository;
        this.actionRepository = actionRepository;
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
    }
}
