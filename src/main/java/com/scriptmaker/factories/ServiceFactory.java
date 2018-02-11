package com.scriptmaker.factories;

import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.DynamicParamInstanceRepository;
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
public class ServiceFactory {
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private DynamicParamInstanceRepository dynamicParamInstanceRepository;

    public void create(Service service) throws Exception {
        if(serviceRepository.findByCode(service.getCode()) != null){
            throw new Exception();
        } else {
            serviceRepository.save(service);
        }
    }

    public void update(Service service) throws Exception {
        Service oldService = serviceRepository.findOne(service.getId());
        Service newService = serviceRepository.findByCode(service.getCode());
        if( newService!= null
                && !Objects.equals(newService.getId(), oldService.getId())){
            System.out.println("ERROR service with code" + service.getCode() + " already exist");
            throw new Exception();

        } else {
            serviceRepository.save(service);
        }
    }

    public void delete(Service service){
        serviceRepository.delete(service);
    }

    public void delete(Long id){
        Service service = serviceRepository.findOne(id);
        List<DynamicParamInstance> dynamicParamInstances = new ArrayList<>();
        dynamicParamInstances.addAll(service.getInParams());
        dynamicParamInstances.addAll(service.getOutParams());
        service.setInParams(new ArrayList<>());
        service.setOperations(new ArrayList<>());
        dynamicParamInstanceRepository.delete(dynamicParamInstances);
        serviceRepository.delete(id);
    }
}
