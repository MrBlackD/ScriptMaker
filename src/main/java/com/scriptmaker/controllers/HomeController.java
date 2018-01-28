package com.scriptmaker.controllers;

import com.scriptmaker.common.ExcelHelper;
import com.scriptmaker.model.Service;
import com.scriptmaker.repository.ServiceRepository;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.File;
import java.io.FileInputStream;


@Controller
public class HomeController {

    @Autowired
    private ServiceRepository serviceRepository;


    @RequestMapping(value = "/")
    public String index(){
        return "index.html";
    }

    @RequestMapping(path = "/download", method = RequestMethod.GET)
    public ResponseEntity<Resource> download() throws Exception {

        XSSFWorkbook workBook = ExcelHelper.createWorkBook();
        Iterable<Service> services = serviceRepository.findAll();
        if(services == null){
            System.out.println("No service found");
            throw new Exception("No service found");
        }
        for(Service service:services){
            XSSFSheet sheet = ExcelHelper.createNewSheet(workBook, service.getName());
            ExcelHelper.writeServiceScript(workBook,sheet,service,1,1);
        }


        try {
            ExcelHelper.saveWorkBook(workBook,"tmp.xlsx");
        } catch (Exception e) {
            e.printStackTrace();
        }

        File file = new File("tmp.xlsx");
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=script.xlsx");
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }


}
