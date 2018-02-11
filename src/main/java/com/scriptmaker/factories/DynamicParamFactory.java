package com.scriptmaker.factories;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.ActionRepository;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
import com.scriptmaker.repository.DynamicParamRepository;
import com.scriptmaker.repository.OperationRepository;
import com.scriptmaker.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by Admin on 17.06.2017.
 */
@Component
public class DynamicParamFactory {
    @Autowired
    private DynamicParamRepository dynamicParamRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;
    @Autowired
    private ActionRepository actionRepository;
    @Autowired
    private OperationRepository operationRepository;
    @Autowired
    private ServiceRepository serviceRepository;

    public void create(DynamicParam param) throws Exception {
        if(dynamicParamRepository.findByCode(param.getCode()) != null){
            throw new Exception();
        } else {
            dynamicParamRepository.save(param);
        }
    }

    public void update(DynamicParam param) throws Exception {
        DynamicParam oldParam = dynamicParamRepository.findOne(param.getId());
        DynamicParam newParam = dynamicParamRepository.findByCode(param.getCode());
        if( newParam!= null
                && !Objects.equals(newParam.getId(), oldParam.getId())){
            System.out.println("ERROR parametr with code" + param.getCode() + " already exist");
            throw new Exception();

        } else {
            dynamicParamRepository.save(param);
        }
    }

    public void delete(DynamicParam param){
        dynamicParamRepository.delete(param);
    }

    public void delete(Long id){
        DynamicParam param = dynamicParamRepository.findOne(id);
        List<DynamicParamInstance> paramInstances = dynamicParamInstanceRepository.findByDynamicParam(param);

        List<Action> actions = new ArrayList<>();
        List<Operation> operations = new ArrayList<>();
        List<Service> services = new ArrayList<>();
        for(DynamicParamInstance dynamicParamInstance:paramInstances){
            actions.addAll(actionRepository.findActionsByInParamsContains(dynamicParamInstance));
            actions.addAll(actionRepository.findActionsByOutParamsContains(dynamicParamInstance));

            operations.addAll(operationRepository.findActionsByInParamsContains(dynamicParamInstance));
            operations.addAll(operationRepository.findActionsByOutParamsContains(dynamicParamInstance));

            services.addAll(serviceRepository.findActionsByInParamsContains(dynamicParamInstance));
            services.addAll(serviceRepository.findActionsByOutParamsContains(dynamicParamInstance));
        }

        for(Action action:actions){
            action.getInParams().removeAll(paramInstances);
            action.getOutParams().removeAll(paramInstances);
        }
        for(Operation operation:operations){
            operation.getInParams().removeAll(paramInstances);
            operation.getOutParams().removeAll(paramInstances);
        }
        for(Service service:services){
            service.getInParams().removeAll(paramInstances);
            service.getOutParams().removeAll(paramInstances);
        }
        actionRepository.save(actions);
        operationRepository.save(operations);
        serviceRepository.save(services);



        dynamicParamInstanceRepository.delete(paramInstances);

        dynamicParamRepository.delete(id);
    }

//    private Boolean isParamLinked(DynamicParam dynamicParam){
//        Boolean isParamLinked = false;
//        for(Action action:actionRepository.findAll()){
//            List<DynamicParam> params = new ArrayList<>();
//            params.addAll(action.getInParams());
//            params.addAll(action.getOutParams());
//            for(DynamicParam param:params){
//                if (Objects.equals(param.getId(), dynamicParam.getId())){
//                    isParamLinked = true;
//                    break;
//                }
//            }
//            if(isParamLinked)
//                break;
//        }
//        return isParamLinked;
//    }

    private void deleteAllLinks(DynamicParam param){
        for(Action action:actionRepository.findAll()) {
            action.getInParams().remove(param);
            action.getOutParams().remove(param);
        }
        for(Operation operation:operationRepository.findAll()) {
            operation.getInParams().remove(param);
            operation.getOutParams().remove(param);
        }
        for(Service service:serviceRepository.findAll()) {
            service.getInParams().remove(param);
            service.getOutParams().remove(param);
        }
    }
}
