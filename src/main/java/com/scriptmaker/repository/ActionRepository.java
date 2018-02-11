package com.scriptmaker.repository;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.DynamicParamInstance;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Admin on 11.06.2017.
 */
public interface ActionRepository extends CrudRepository<Action, Long> {
    Action findByCode(String code);
    List<Action> findActionsByInParamsContains(DynamicParamInstance dynamicParamInstance);
    List<Action> findActionsByOutParamsContains(DynamicParamInstance dynamicParamInstance);
}
