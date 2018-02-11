package com.scriptmaker.repository;

import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Service;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ServiceRepository extends CrudRepository<Service, Long> {
    Service findByCode(String code);
    List<Service> findActionsByInParamsContains(DynamicParamInstance dynamicParamInstance);
    List<Service> findActionsByOutParamsContains(DynamicParamInstance dynamicParamInstance);
}
