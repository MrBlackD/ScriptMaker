package com.scriptmaker.common;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParam;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.ParamMapping;
import com.scriptmaker.model.Service;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by Admin on 27.01.2018.
 */

public class ExcelHelperTest {
    @Test
    public void test() throws Exception {
        DynamicParam dynamicParam = new DynamicParam("name","code","type");
        DynamicParamInstance dynamicParamInstance = new DynamicParamInstance();
        dynamicParamInstance.setDynamicParam(dynamicParam);

        Action action = new Action();
        action.setName("action name");
        action.setCode("action code");
        action.setModule("module");
        action.setDescription("description");
        action.setInParams(Arrays.asList(dynamicParamInstance,dynamicParamInstance,dynamicParamInstance));
        action.setOutParams(Arrays.asList(dynamicParamInstance,dynamicParamInstance,dynamicParamInstance,dynamicParamInstance));

        ActionInstance actionInstance = new ActionInstance();
        actionInstance.setAction(action);

        List<ParamMapping> mappings = new ArrayList<>();
        ParamMapping paramMapping = new ParamMapping();
        paramMapping.setType(Type.INPARAM);
        paramMapping.setIn("INPARAMMAPPING");
        paramMapping.setOut("code");
        mappings.add(paramMapping);

        ParamMapping paramMapping2 = new ParamMapping();
        paramMapping2.setType(Type.OUTPARAM);
        paramMapping2.setIn("code");
        paramMapping2.setOut("OutParamMapping");
        mappings.add(paramMapping2);
        actionInstance.setMapping(mappings);

        Operation operation = new Operation();
        operation.setName("OperName");
        operation.setCode("OperCode");
        operation.setDescription("OperDescription");
        operation.setActions(Arrays.asList(actionInstance,actionInstance));

        Service service = new Service();
        service.setCode("ServiceCode");
        service.setName("ServiceName");
        service.setDescription("ServiceDescription");
        service.setOperations(Arrays.asList(operation,operation,operation));

        XSSFWorkbook workBook = ExcelHelper.createWorkBook();
        XSSFSheet testSheet = ExcelHelper.createNewSheet(workBook, "testSheet");
        ExcelHelper.writeServiceScript(workBook,testSheet,service,1,1);

        ExcelHelper.saveWorkBook(workBook,"tmp.xlsx");
    }

}