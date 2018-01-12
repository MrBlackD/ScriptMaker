package com.scriptmaker.repository;

import com.scriptmaker.model.Operation;
import com.scriptmaker.model.Service;
import org.springframework.data.repository.CrudRepository;

public interface ServiceRepository extends CrudRepository<Service, Long> {
    Service findByCode(String code);
}
