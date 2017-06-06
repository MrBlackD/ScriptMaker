package com.scriptmaker;

import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.model.DynamicParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final DynamicParamRepository dynamicParamRepository;

    @Autowired
    public DataLoader(DynamicParamRepository dynamicParamRepository) {
        this.dynamicParamRepository = dynamicParamRepository;
    }

    @Override
    public void run(String... strings) throws Exception {
        DynamicParam dynamicParam = new DynamicParam("Тестовый динамический параметр","test","");
        this.dynamicParamRepository.save(dynamicParam);
    }
}
