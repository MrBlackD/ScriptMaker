package com.scriptmaker.factories;

import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.OperationRepository;
import com.scriptmaker.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
/**
 * Created by Sergey on 11.01.2018.
 */

@Component
public class OperationFactory {
    @Autowired
    private OperationRepository operationRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;
    @Autowired
    private ServiceRepository serviceRepository;

    public void create(Operation operation) throws Exception {
        if(operationRepository.findByCode(operation.getCode()) != null){
            throw new Exception();
        } else {
            operationRepository.save(operation);
        }
    }

    public void update(Operation operation) throws Exception {
        Operation oldOperation = operationRepository.findOne(operation.getId());
        Operation newOperation = operationRepository.findByCode(operation.getCode());
        if( newOperation!= null
                && !Objects.equals(newOperation.getId(), oldOperation.getId())){
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
        Operation operation = operationRepository.findOne(id);
        List<Service> services = serviceRepository.findByOperationsContains(operation);
        for(Service service:services){
            service.getOperations().remove(operation);
        }
        serviceRepository.save(services);
        List<DynamicParamInstance> dynamicParamInstances = new ArrayList<>();
        dynamicParamInstances.addAll(operation.getInParams());
        dynamicParamInstances.addAll(operation.getOutParams());
        operation.setInParams(new ArrayList<>());
        operation.setOutParams(new ArrayList<>());
        dynamicParamInstanceRepository.delete(dynamicParamInstances);

        operationRepository.delete(id);
    }
}
