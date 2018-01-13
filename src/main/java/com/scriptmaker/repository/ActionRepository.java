package com.scriptmaker.repository;

import com.scriptmaker.model.Action;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Admin on 11.06.2017.
 */
public interface ActionRepository extends CrudRepository<Action, Long> {
    Action findByCode(String code);
}
