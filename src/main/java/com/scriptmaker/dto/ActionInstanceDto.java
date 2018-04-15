package com.scriptmaker.dto;

import java.util.List;
import java.util.Map;

/**
 * Created by Admin on 28.03.2018.
 */
public class ActionInstanceDto {
    private String actionId;
    private List<Map<String,String>> mapping;

    public ActionInstanceDto() {
    }

    public String getActionId() {
        return actionId;
    }

    public void setActionId(String actionId) {
        this.actionId = actionId;
    }

    public List<Map<String, String>> getMapping() {
        return mapping;
    }

    public void setMapping(List<Map<String, String>> mapping) {
        this.mapping = mapping;
    }
}
