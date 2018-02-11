package com.scriptmaker.repository;

import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DynamicParamInstanceRepository extends CrudRepository<DynamicParamInstance,Long> {
    List<DynamicParamInstance> findByDynamicParam(DynamicParam dynamicParam);
}
