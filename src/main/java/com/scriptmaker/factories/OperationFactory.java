package com.scriptmaker.factories;

import com.scriptmaker.model.Operation;
import com.scriptmaker.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Objects;
/**
 * Created by Sergey on 11.01.2018.
 */

@Component
public class OperationFactory {
    @Autowired
    private OperationRepository operationRepository;

    public void create(Operation operation) throws Exception {
        if(operationRepository.findByCode(operation.getCode()) != null){
            throw new Exception();
        } else {
            operationRepository.save(operation);
        }
    }

    public void update(Operation operation) throws Exception {
        Operation oldOperation = operationRepository.findOne(operation.getId());
        if( operationRepository.findByCode(operation.getCode())!= null
                && !Objects.equals(operationRepository.findByCode(operation.getCode()).getId(), oldOperation.getId())){
            System.out.println("ERROR operation with code" + operation.getCode() + " already exist");
            throw new Exception();

        } else {
            operationRepository.save(operation);
        }
    }

    public void delete(Operation operation){
        operationRepository.delete(operation);
    }

    public void delete(Long id){
        operationRepository.delete(id);
    }
}
