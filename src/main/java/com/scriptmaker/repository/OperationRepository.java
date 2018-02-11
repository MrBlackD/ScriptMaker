package com.scriptmaker.repository;

import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Admin on 11.06.2017.
 */
public interface OperationRepository extends CrudRepository<Operation, Long> {
    Operation findByCode(String code);
    List<Operation> findActionsByInParamsContains(DynamicParamInstance dynamicParamInstance);
    List<Operation> findActionsByOutParamsContains(DynamicParamInstance dynamicParamInstance);
    List<Operation> findByActionsContains(ActionInstance actionInstance);
}
