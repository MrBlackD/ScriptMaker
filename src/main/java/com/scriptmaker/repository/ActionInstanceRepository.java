package com.scriptmaker.repository;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.ActionInstance;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Admin on 11.06.2017.
 */
public interface ActionInstanceRepository extends CrudRepository<ActionInstance, Long> {
    List<ActionInstance> findByAction(Action action);
}
