package com.scriptmaker.common;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.Service;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.util.List;

/**
 * Created by Admin on 27.01.2018.
 */
public class ExcelHelper {
    public static XSSFWorkbook createWorkBook(){
        return new XSSFWorkbook();
    }

    public static void saveWorkBook(XSSFWorkbook workbook,String file) throws Exception {
        workbook.write(new FileOutputStream(file));
        workbook.close();
    }
    public static XSSFSheet createNewSheet(XSSFWorkbook workbook, String str){
        return workbook.createSheet(str);
    }

    public static void writeServiceScript(XSSFWorkbook workbook,XSSFSheet sheet,Service service,int startRow,int startCol){
        writeServiceToSheet(workbook,sheet,service,startRow,startCol);
        int nextRow = startRow;
        int paramsCount = 5;
        int inParams = 0;
        int outParams = 0;
        if(service.getInParams()!=null){
            inParams = service.getInParams().size();
        }
        if(service.getOutParams()!=null){
            outParams = service.getOutParams().size();
        }
        paramsCount = Math.max(paramsCount,inParams);
        paramsCount = Math.max(paramsCount,outParams);
        for(Operation operation:service.getOperations()){
            if(operation.getInParams()!=null){
                paramsCount = Math.max(paramsCount,operation.getInParams().size());
            }
            if(operation.getOutParams()!=null){
                paramsCount = Math.max(paramsCount,operation.getOutParams().size());
            }
            for(ActionInstance actionInstance:operation.getActions()){
                Action action = actionInstance.getAction();
                if(action.getInParams()!=null){
                    paramsCount = Math.max(paramsCount,action.getInParams().size());
                }
                if(action.getOutParams()!=null){
                    paramsCount = Math.max(paramsCount,action.getOutParams().size());
                }
            }
            nextRow +=11 + paramsCount*2 + 2;
            writeOperationScript(workbook,sheet,operation,nextRow,startCol);
        }
    }

    public static void writeOperationScript(XSSFWorkbook workbook,XSSFSheet sheet,Operation operation,int startRow,int startCol){
        writeOperationToSheet(workbook,sheet,operation,startRow,startCol);
        int nextCol = startCol;
        for (ActionInstance action:operation.getActions()){
            nextCol+=10;
            writeActionToSheet(workbook,sheet,action.getAction(),startRow,nextCol);
        }
    }

    public static void writeActionToSheet(XSSFWorkbook workbook,XSSFSheet sheet,Action action,int startRow,int startCol){
        XSSFRow row = getOrCreateRow(sheet,startRow);



        XSSFCell cell = row.createCell(startCol);
        cell.setCellValue("Действие");
        XSSFCellStyle simpleBorder = cell.getCellStyle();
        simpleBorder.setBorderBottom(BorderStyle.THIN);
        simpleBorder.setBorderRight(BorderStyle.THIN);
        simpleBorder.setBorderLeft(BorderStyle.THIN);
        simpleBorder.setBorderTop(BorderStyle.THIN);
        XSSFCellStyle borderWithBackground = workbook.createCellStyle();
        borderWithBackground.setFillForegroundColor(new XSSFColor(new java.awt.Color(251, 197, 125)));
        borderWithBackground.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow,startRow,startCol,startCol + 1));
        XSSFCell cell1 = row.createCell(startCol + 2);
        cell1.setCellValue(action.getName());
        cell1.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow,startRow,startCol+2,startCol+7));

        XSSFRow row1 = getOrCreateRow(sheet,startRow +1);

        XSSFCell cell2 = row1.createCell(startCol);
        cell2.setCellValue("Код действия");
        cell2.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+1,startRow+1,startCol,startCol+1));
        XSSFCell cell3 = row1.createCell(startCol + 2);
        cell3.setCellValue(action.getCode());
        cell3.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow+1,startRow+1,startCol+2,startCol+7));

        XSSFRow row2 = getOrCreateRow(sheet,startRow +2);
        XSSFCell cell4 = row2.createCell(startCol);
        cell4.setCellValue("Входящие параметры");
        cell4.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+2,startRow+3,startCol,startCol+3));
        XSSFCell cell5 = row2.createCell(startCol + 4);
        cell5.setCellValue("Исходящие параметры");
        cell5.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+2,startRow+3,startCol+4,startCol+7));

        XSSFRow row3 = getOrCreateRow(sheet,startRow +4);
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5, startCol, startCol));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+1,startCol+1));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+2,startCol+2));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+3,startCol+3));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+4,startCol+4));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+5,startCol+5));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+6,startCol+6));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+7,startCol+7));
        XSSFCell cell6 = row3.createCell(startCol);
        cell6.setCellValue("Имя");
        cell6.setCellStyle(borderWithBackground);
        XSSFCell cell7 = row3.createCell(startCol + 1);
        cell7.setCellValue("Код");
        cell7.setCellStyle(borderWithBackground);
        XSSFCell cell8 = row3.createCell(startCol + 2);
        cell8.setCellValue("Тип");
        cell8.setCellStyle(borderWithBackground);
        XSSFCell cell9 = row3.createCell(startCol + 3);
        cell9.setCellValue("Обязательность");
        cell9.setCellStyle(borderWithBackground);
        XSSFCell cell10 = row3.createCell(startCol + 4);
        cell10.setCellValue("Имя");
        cell10.setCellStyle(borderWithBackground);
        XSSFCell cell11 = row3.createCell(startCol + 5);
        cell11.setCellValue("Код");
        cell11.setCellStyle(borderWithBackground);
        XSSFCell cell12 = row3.createCell(startCol + 6);
        cell12.setCellValue("Тип");
        cell12.setCellStyle(borderWithBackground);
        XSSFCell cell13 = row3.createCell(startCol + 7);
        cell13.setCellValue("Обязательность");
        cell13.setCellStyle(borderWithBackground);

        List<DynamicParamInstance> inParams = action.getInParams();
        List<DynamicParamInstance> outParams = action.getOutParams();
        int inParamsSize = inParams==null?0:inParams.size();
        int outParamsSize = outParams==null?0:outParams.size();
        Integer size = Math.max(inParamsSize,outParamsSize);
        size = Math.max(size,5);
        for (int i = 0; i < size; i++) {
            XSSFRow row4 = getOrCreateRow(sheet,startRow+6 + 2*i);
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1, startCol, startCol));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+1,startCol+1));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+2,startCol+2));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+3,startCol+3));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+4,startCol+4));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+5,startCol+5));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+6,startCol+6));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+7,startCol+7));
            if(inParams!=null&&inParams.size()>i) {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue(inParams.get(i).getDynamicParam().getName());
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue(inParams.get(i).getDynamicParam().getCode());
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue(inParams.get(i).getDynamicParam().getType());
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue(inParams.get(i).getRequired());
                cell17.setCellStyle(simpleBorder);
            } else {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
            }
            if(outParams!=null&&outParams.size()>i){
                XSSFCell cell14 = row4.createCell(startCol + 4);
                cell14.setCellValue(outParams.get(i).getDynamicParam().getName());
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 5);
                cell15.setCellValue(outParams.get(i).getDynamicParam().getCode());
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 6);
                cell16.setCellValue(outParams.get(i).getDynamicParam().getType());
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 7);
                cell17.setCellValue(outParams.get(i).getRequired());
                cell17.setCellStyle(simpleBorder);
            } else {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
            }
        }
        XSSFRow row5 = getOrCreateRow(sheet,startRow+6 + 2*size);
        sheet.addMergedRegion(new CellRangeAddress(row5.getRowNum(),row5.getRowNum(), startCol,startCol+7));
        XSSFCell cell14 = row5.createCell(startCol);
        cell14.setCellValue("Алгоритм");
        cell14.setCellStyle(borderWithBackground);

        XSSFRow row6 = getOrCreateRow(sheet,startRow+6 + 2*size +1);
        sheet.addMergedRegion(new CellRangeAddress(row6.getRowNum(),row6.getRowNum()+3, startCol,startCol+7));
        XSSFCell cell15 = row6.createCell(startCol);
        cell15.setCellValue(action.getDescription());
        cell15.setCellStyle(simpleBorder);

    }

    public static void writeOperationToSheet(XSSFWorkbook workbook, XSSFSheet sheet, Operation operation, int startRow, int startCol){
        XSSFRow row = sheet.createRow(startRow);

        XSSFCell cell = row.createCell(startCol);
        cell.setCellValue("Действие");
        XSSFCellStyle simpleBorder = cell.getCellStyle();
        simpleBorder.setBorderBottom(BorderStyle.THIN);
        simpleBorder.setBorderRight(BorderStyle.THIN);
        simpleBorder.setBorderLeft(BorderStyle.THIN);
        simpleBorder.setBorderTop(BorderStyle.THIN);
        XSSFCellStyle borderWithBackground = workbook.createCellStyle();
        borderWithBackground.setFillForegroundColor(new XSSFColor(new java.awt.Color(84, 216, 251)));
        borderWithBackground.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow,startRow,startCol,startCol + 1));
        XSSFCell cell1 = row.createCell(startCol + 2);
        cell1.setCellValue(operation.getName());
        cell1.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow,startRow,startCol+2,startCol+7));

        XSSFRow row1 = sheet.createRow(startRow+1);
        XSSFCell cell2 = row1.createCell(startCol);
        cell2.setCellValue("Код действия");
        cell2.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+1,startRow+1,startCol,startCol+1));
        XSSFCell cell3 = row1.createCell(startCol + 2);
        cell3.setCellValue(operation.getCode());
        cell3.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow+1,startRow+1,startCol+2,startCol+7));

        XSSFRow row2 = sheet.createRow(startRow+2);
        XSSFCell cell4 = row2.createCell(startCol);
        cell4.setCellValue("Входящие параметры");
        cell4.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+2,startRow+3,startCol,startCol+3));
        XSSFCell cell5 = row2.createCell(startCol + 4);
        cell5.setCellValue("Исходящие параметры");
        cell5.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+2,startRow+3,startCol+4,startCol+7));

        XSSFRow row3 = sheet.createRow(startRow+4);
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5, startCol, startCol));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+1,startCol+1));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+2,startCol+2));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+3,startCol+3));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+4,startCol+4));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+5,startCol+5));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+6,startCol+6));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+7,startCol+7));
        XSSFCell cell6 = row3.createCell(startCol);
        cell6.setCellValue("Имя");
        cell6.setCellStyle(borderWithBackground);
        XSSFCell cell7 = row3.createCell(startCol + 1);
        cell7.setCellValue("Код");
        cell7.setCellStyle(borderWithBackground);
        XSSFCell cell8 = row3.createCell(startCol + 2);
        cell8.setCellValue("Тип");
        cell8.setCellStyle(borderWithBackground);
        XSSFCell cell9 = row3.createCell(startCol + 3);
        cell9.setCellValue("Обязательность");
        cell9.setCellStyle(borderWithBackground);
        XSSFCell cell10 = row3.createCell(startCol + 4);
        cell10.setCellValue("Имя");
        cell10.setCellStyle(borderWithBackground);
        XSSFCell cell11 = row3.createCell(startCol + 5);
        cell11.setCellValue("Код");
        cell11.setCellStyle(borderWithBackground);
        XSSFCell cell12 = row3.createCell(startCol + 6);
        cell12.setCellValue("Тип");
        cell12.setCellStyle(borderWithBackground);
        XSSFCell cell13 = row3.createCell(startCol + 7);
        cell13.setCellValue("Обязательность");
        cell13.setCellStyle(borderWithBackground);

        List<DynamicParamInstance> inParams = operation.getInParams();
        List<DynamicParamInstance> outParams = operation.getOutParams();
        int inParamsSize = inParams==null?0:inParams.size();
        int outParamsSize = outParams==null?0:outParams.size();
        Integer size = Math.max(inParamsSize,outParamsSize);
        size = Math.max(size,5);
        for (int i = 0; i < size; i++) {
            XSSFRow row4 = sheet.createRow(startRow+6 + 2*i);
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1, startCol, startCol));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+1,startCol+1));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+2,startCol+2));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+3,startCol+3));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+4,startCol+4));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+5,startCol+5));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+6,startCol+6));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+7,startCol+7));
            if(inParams!=null&&inParams.size()>i) {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue(inParams.get(i).getDynamicParam().getName());
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue(inParams.get(i).getDynamicParam().getCode());
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue(inParams.get(i).getDynamicParam().getType());
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue(inParams.get(i).getRequired());
                cell17.setCellStyle(simpleBorder);
            } else {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
            }
            if(outParams!=null&&outParams.size()>i){
                XSSFCell cell14 = row4.createCell(startCol + 4);
                cell14.setCellValue(outParams.get(i).getDynamicParam().getName());
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 5);
                cell15.setCellValue(outParams.get(i).getDynamicParam().getCode());
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 6);
                cell16.setCellValue(outParams.get(i).getDynamicParam().getType());
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 7);
                cell17.setCellValue(outParams.get(i).getRequired());
                cell17.setCellStyle(simpleBorder);
            } else {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
            }
        }
        XSSFRow row5 = sheet.createRow(startRow+6 + 2*size);
        sheet.addMergedRegion(new CellRangeAddress(row5.getRowNum(),row5.getRowNum(), startCol,startCol+7));
        XSSFCell cell14 = row5.createCell(startCol);
        cell14.setCellValue("Алгоритм");
        cell14.setCellStyle(borderWithBackground);

        XSSFRow row6 = sheet.createRow(startRow+6 + 2*size +1);
        sheet.addMergedRegion(new CellRangeAddress(row6.getRowNum(),row6.getRowNum()+3, startCol,startCol+7));
        XSSFCell cell15 = row6.createCell(startCol);
        cell15.setCellValue(operation.getDescription());
        cell15.setCellStyle(simpleBorder);

    }

    public static void writeServiceToSheet(XSSFWorkbook workbook, XSSFSheet sheet, Service service, int startRow, int startCol){
        XSSFRow row = sheet.createRow(startRow);

        XSSFCell cell = row.createCell(startCol);
        cell.setCellValue("Действие");
        XSSFCellStyle simpleBorder = cell.getCellStyle();
        simpleBorder.setBorderBottom(BorderStyle.THIN);
        simpleBorder.setBorderRight(BorderStyle.THIN);
        simpleBorder.setBorderLeft(BorderStyle.THIN);
        simpleBorder.setBorderTop(BorderStyle.THIN);
        XSSFCellStyle borderWithBackground = workbook.createCellStyle();
        borderWithBackground.setFillForegroundColor(new XSSFColor(new java.awt.Color(132, 134, 139)));
        borderWithBackground.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow,startRow,startCol,startCol + 1));
        XSSFCell cell1 = row.createCell(startCol + 2);
        cell1.setCellValue(service.getName());
        cell1.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow,startRow,startCol+2,startCol+7));

        XSSFRow row1 = sheet.createRow(startRow+1);
        XSSFCell cell2 = row1.createCell(startCol);
        cell2.setCellValue("Код действия");
        cell2.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+1,startRow+1,startCol,startCol+1));
        XSSFCell cell3 = row1.createCell(startCol + 2);
        cell3.setCellValue(service.getCode());
        cell3.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow+1,startRow+1,startCol+2,startCol+7));

        XSSFRow row2 = sheet.createRow(startRow+2);
        XSSFCell cell4 = row2.createCell(startCol);
        cell4.setCellValue("Входящие параметры");
        cell4.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+2,startRow+3,startCol,startCol+3));
        XSSFCell cell5 = row2.createCell(startCol + 4);
        cell5.setCellValue("Исходящие параметры");
        cell5.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow+2,startRow+3,startCol+4,startCol+7));

        XSSFRow row3 = sheet.createRow(startRow+4);
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5, startCol, startCol));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+1,startCol+1));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+2,startCol+2));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+3,startCol+3));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+4,startCol+4));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+5,startCol+5));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+6,startCol+6));
        sheet.addMergedRegion(new CellRangeAddress(startRow+4,startRow+5,startCol+7,startCol+7));
        XSSFCell cell6 = row3.createCell(startCol);
        cell6.setCellValue("Имя");
        cell6.setCellStyle(borderWithBackground);
        XSSFCell cell7 = row3.createCell(startCol + 1);
        cell7.setCellValue("Код");
        cell7.setCellStyle(borderWithBackground);
        XSSFCell cell8 = row3.createCell(startCol + 2);
        cell8.setCellValue("Тип");
        cell8.setCellStyle(borderWithBackground);
        XSSFCell cell9 = row3.createCell(startCol + 3);
        cell9.setCellValue("Обязательность");
        cell9.setCellStyle(borderWithBackground);
        XSSFCell cell10 = row3.createCell(startCol + 4);
        cell10.setCellValue("Имя");
        cell10.setCellStyle(borderWithBackground);
        XSSFCell cell11 = row3.createCell(startCol + 5);
        cell11.setCellValue("Код");
        cell11.setCellStyle(borderWithBackground);
        XSSFCell cell12 = row3.createCell(startCol + 6);
        cell12.setCellValue("Тип");
        cell12.setCellStyle(borderWithBackground);
        XSSFCell cell13 = row3.createCell(startCol + 7);
        cell13.setCellValue("Обязательность");
        cell13.setCellStyle(borderWithBackground);

        List<DynamicParamInstance> inParams = service.getInParams();
        List<DynamicParamInstance> outParams = service.getOutParams();
        int inParamsSize = inParams==null?0:inParams.size();
        int outParamsSize = outParams==null?0:outParams.size();
        Integer size = Math.max(inParamsSize,outParamsSize);
        size = Math.max(size,5);
        for (int i = 0; i < size; i++) {
            XSSFRow row4 = sheet.createRow(startRow+6 + 2*i);
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1, startCol, startCol));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+1,startCol+1));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+2,startCol+2));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+3,startCol+3));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+4,startCol+4));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+5,startCol+5));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+6,startCol+6));
            sheet.addMergedRegion(new CellRangeAddress(startRow+6 + 2*i,startRow+6 + 2*i +1,startCol+7,startCol+7));
            if(inParams!=null&&inParams.size()>i) {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue(inParams.get(i).getDynamicParam().getName());
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue(inParams.get(i).getDynamicParam().getCode());
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue(inParams.get(i).getDynamicParam().getType());
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue(inParams.get(i).getRequired());
                cell17.setCellStyle(simpleBorder);
            } else {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
            }
            if(outParams!=null&&outParams.size()>i){
                XSSFCell cell14 = row4.createCell(startCol + 4);
                cell14.setCellValue(outParams.get(i).getDynamicParam().getName());
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 5);
                cell15.setCellValue(outParams.get(i).getDynamicParam().getCode());
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 6);
                cell16.setCellValue(outParams.get(i).getDynamicParam().getType());
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 7);
                cell17.setCellValue(outParams.get(i).getRequired());
                cell17.setCellStyle(simpleBorder);
            } else {
                XSSFCell cell14 = row4.createCell(startCol);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 1);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 2);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 3);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
            }
        }
        XSSFRow row5 = sheet.createRow(startRow+6 + 2*size);
        sheet.addMergedRegion(new CellRangeAddress(row5.getRowNum(),row5.getRowNum(), startCol,startCol+7));
        XSSFCell cell14 = row5.createCell(startCol);
        cell14.setCellValue("Алгоритм");
        cell14.setCellStyle(borderWithBackground);

        XSSFRow row6 = sheet.createRow(startRow+6 + 2*size +1);
        sheet.addMergedRegion(new CellRangeAddress(row6.getRowNum(),row6.getRowNum()+3, startCol,startCol+7));
        XSSFCell cell15 = row6.createCell(startCol);
        cell15.setCellValue(service.getDescription());
        cell15.setCellStyle(simpleBorder);

    }

    public static XSSFRow getOrCreateRow(XSSFSheet sheet, int rowIdx){
        XSSFRow row;
        row = sheet.getRow(rowIdx);
        if(row==null) {
            row = sheet.createRow(rowIdx);
        }
        return row;
    }
}
