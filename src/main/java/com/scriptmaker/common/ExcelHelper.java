package com.scriptmaker.common;

import com.scriptmaker.model.Action;
import com.scriptmaker.model.ActionInstance;
import com.scriptmaker.model.DynamicParamInstance;
import com.scriptmaker.model.Operation;
import com.scriptmaker.model.ParamMapping;
import com.scriptmaker.model.ScriptEntity;
import com.scriptmaker.model.Service;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
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
    public static XSSFWorkbook createWorkBook() {
        return new XSSFWorkbook();
    }

    public static void saveWorkBook(XSSFWorkbook workbook, String file) throws Exception {
        workbook.write(new FileOutputStream(file));
        workbook.close();
    }

    public static XSSFSheet createNewSheet(XSSFWorkbook workbook, String str) {
        return workbook.createSheet(str);
    }

    public static void writeServiceScript(XSSFWorkbook workbook, XSSFSheet sheet, Service service, int startRow, int startCol) {
        writeScriptEntityToSheet(workbook, sheet, service, startRow, startCol);
        int nextRow = startRow;
        int paramsCount = 5;
        int inParams = 0;
        int outParams = 0;
        if (service.getInParams() != null) {
            inParams = service.getInParams().size();
        }
        if (service.getOutParams() != null) {
            outParams = service.getOutParams().size();
        }
        paramsCount = Math.max(paramsCount, inParams);
        paramsCount = Math.max(paramsCount, outParams);
        for (Operation operation : service.getOperations()) {
            if (operation.getInParams() != null) {
                paramsCount = Math.max(paramsCount, operation.getInParams().size());
            }
            if (operation.getOutParams() != null) {
                paramsCount = Math.max(paramsCount, operation.getOutParams().size());
            }
            for (ActionInstance actionInstance : operation.getActions()) {
                Action action = actionInstance.getAction();
                if (action.getInParams() != null) {
                    paramsCount = Math.max(paramsCount, action.getInParams().size());
                }
                if (action.getOutParams() != null) {
                    paramsCount = Math.max(paramsCount, action.getOutParams().size());
                }
            }
            nextRow += 11 + paramsCount * 2 + 4;
            writeOperationScript(workbook, sheet, operation, nextRow, startCol);
        }
    }

    public static void writeOperationScript(XSSFWorkbook workbook, XSSFSheet sheet, Operation operation, int startRow, int startCol) {
        writeScriptEntityToSheet(workbook, sheet, operation, startRow, startCol);
        int nextCol = startCol;
        for (ActionInstance action : operation.getActions()) {
            nextCol += 8 + 4;
            writeScriptEntityToSheet(workbook, sheet, action.getAction(), startRow, nextCol, action.getMapping());
        }
    }

    public static void writeScriptEntityToSheet(XSSFWorkbook workbook,
                                                XSSFSheet sheet,
                                                ScriptEntity scriptEntity,
                                                int startRow,
                                                int startCol) {
        writeScriptEntityToSheet(workbook, sheet, scriptEntity, startRow, startCol, null);
    }

    public static void writeScriptEntityToSheet(XSSFWorkbook workbook,
                                                XSSFSheet sheet,
                                                ScriptEntity scriptEntity,
                                                int startRow,
                                                int startCol,
                                                List<ParamMapping> mapping) {
        XSSFRow row = getOrCreateRow(sheet, startRow);


        XSSFCell cell = row.createCell(startCol);
        cell.setCellValue("Наименование");
        XSSFCellStyle simpleBorder = workbook.createCellStyle();
        addCommonStyle(simpleBorder, BorderStyle.MEDIUM);
        XSSFCellStyle borderWithBackground = workbook.createCellStyle();
        addCommonStyle(borderWithBackground, BorderStyle.MEDIUM);
        if (scriptEntity instanceof Action) {
            borderWithBackground.setFillForegroundColor(new XSSFColor(new java.awt.Color(251, 197, 125)));
        }
        if (scriptEntity instanceof Operation) {
            borderWithBackground.setFillForegroundColor(new XSSFColor(new java.awt.Color(116, 231, 251)));
        }
        if (scriptEntity instanceof Service) {
            borderWithBackground.setFillForegroundColor(new XSSFColor(new java.awt.Color(209, 209, 216)));
        }
        borderWithBackground.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, startCol, startCol + 1));


        XSSFCell cell1 = row.createCell(startCol + 2);
        cell1.setCellValue(scriptEntity.getName());
        cell1.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow, startRow, startCol + 2, startCol + 7));

        for(int i = startCol;i<=startCol+1;i++){
            XSSFCell tmp = row.getCell(i);
            if(tmp == null){
                tmp = row.createCell(i);
            }
            tmp.setCellStyle(borderWithBackground);
        }
        for(int i = startCol +2;i<=startCol+7;i++){
            XSSFCell tmp = row.getCell(i);
            if(tmp == null){
                tmp = row.createCell(i);
            }
            tmp.setCellStyle(simpleBorder);
        }

        XSSFRow row1 = getOrCreateRow(sheet, startRow + 1);

        XSSFCell cell2 = row1.createCell(startCol);
        cell2.setCellValue("Код");
        cell2.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow + 1, startRow + 1, startCol, startCol + 1));
        XSSFCell cell3 = row1.createCell(startCol + 2);
        cell3.setCellValue(scriptEntity.getCode());
        cell3.setCellStyle(simpleBorder);
        sheet.addMergedRegion(new CellRangeAddress(startRow + 1, startRow + 1, startCol + 2, startCol + 7));

        for(int i = startCol;i<=startCol+1;i++){
            XSSFCell tmp = row1.getCell(i);
            if(tmp == null){
                tmp = row1.createCell(i);
            }
            tmp.setCellStyle(borderWithBackground);
        }
        for(int i = startCol +2;i<=startCol+7;i++){
            XSSFCell tmp = row1.getCell(i);
            if(tmp == null){
                tmp = row1.createCell(i);
            }
            tmp.setCellStyle(simpleBorder);
        }


        XSSFRow row2 = getOrCreateRow(sheet, startRow + 2);
        XSSFCell cell4 = row2.createCell(startCol);
        cell4.setCellValue("Входящие параметры");
        cell4.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow + 2, startRow + 3, startCol, startCol + 3));

        XSSFCell cell5 = row2.createCell(startCol + 4);
        cell5.setCellValue("Исходящие параметры");
        cell5.setCellStyle(borderWithBackground);
        sheet.addMergedRegion(new CellRangeAddress(startRow + 2, startRow + 3, startCol + 4, startCol + 7));


        for(int i = startCol;i<=startCol+7;i++){
            XSSFCell tmp = row2.getCell(i);
            if(tmp == null){
                tmp = row2.createCell(i);
            }
            tmp.setCellStyle(borderWithBackground);
        }
        XSSFRow row2_2 = getOrCreateRow(sheet, startRow + 3);
        for(int i = startCol;i<=startCol+7;i++){
            XSSFCell tmp = row2_2.getCell(i);
            if(tmp == null){
                tmp = row2_2.createCell(i);
            }
            tmp.setCellStyle(borderWithBackground);
        }

        XSSFRow row3 = getOrCreateRow(sheet, startRow + 4);
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol-1, startCol-1));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol, startCol));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 1, startCol + 1));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 2, startCol + 2));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 3, startCol + 3));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 4, startCol + 4));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 5, startCol + 5));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 6, startCol + 6));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 7, startCol + 7));
        sheet.addMergedRegion(new CellRangeAddress(startRow + 4, startRow + 5, startCol + 8, startCol + 8));
        if(mapping!=null){
            XSSFCell cell6 = row3.createCell(startCol -1);
            cell6.setCellValue("Входящий маппинг");
            cell6.setCellStyle(borderWithBackground);
            XSSFRow row3_2 = getOrCreateRow(sheet,row3.getRowNum() + 1);
            XSSFCell cell15 = row3_2.createCell(startCol -1);
            cell15.setCellStyle(borderWithBackground);
        }
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
        if(mapping!=null){
            XSSFCell cell14 = row3.createCell(startCol + 8);
            cell14.setCellValue("Исходящий маппинг");
            cell14.setCellStyle(borderWithBackground);
            XSSFRow row3_2 = getOrCreateRow(sheet,row3.getRowNum() + 1);
            XSSFCell cell15 = row3_2.createCell(startCol + 8);
            cell15.setCellStyle(borderWithBackground);
        }

        for(int i = startCol;i<=startCol+7;i++){
            XSSFCell tmp = row3.getCell(i);
            if(tmp == null){
                tmp = row3.createCell(i);
            }
            tmp.setCellStyle(borderWithBackground);
        }
        XSSFRow row3_2 = getOrCreateRow(sheet, row3.getRowNum() +1);
        for(int i = startCol;i<=startCol+7;i++){
            XSSFCell tmp = row3_2.getCell(i);
            if(tmp == null){
                tmp = row3_2.createCell(i);
            }
            tmp.setCellStyle(borderWithBackground);
        }
        List<DynamicParamInstance> inParams = scriptEntity.getInParams();
        List<DynamicParamInstance> outParams = scriptEntity.getOutParams();
        int inParamsSize = inParams == null ? 0 : inParams.size();
        int outParamsSize = outParams == null ? 0 : outParams.size();
        Integer size = Math.max(inParamsSize, outParamsSize);
        size = Math.max(size, 5);
        for (int i = 0; i < size; i++) {
            XSSFRow row4 = getOrCreateRow(sheet, startRow + 6 + 2 * i);
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol, startCol));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 1, startCol + 1));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 2, startCol + 2));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 3, startCol + 3));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 4, startCol + 4));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 5, startCol + 5));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 6, startCol + 6));
            sheet.addMergedRegion(new CellRangeAddress(startRow + 6 + 2 * i, startRow + 6 + 2 * i + 1, startCol + 7, startCol + 7));
            if (inParams != null && inParams.size() > i) {
                if (mapping != null) {
                    for (ParamMapping paramMapping : mapping) {
                        if ((paramMapping.getType() == Type.INPARAM ||paramMapping.getType() == Type.INVALUE)
                                && paramMapping.getOut().equals(inParams.get(i).getDynamicParam().getCode())) {
                            XSSFCell cell14 = row4.createCell(startCol - 1);
                            cell14.setCellValue(paramMapping.getIn());
                            cell14.setCellStyle(simpleBorder);
                            XSSFRow row5 = getOrCreateRow(sheet, row4.getRowNum() + 1);
                            XSSFCell cell15 = row5.createCell(startCol - 1);
                            cell15.setCellStyle(simpleBorder);
                            sheet.addMergedRegion(new CellRangeAddress(row4.getRowNum(), row4.getRowNum() + 1, startCol - 1, startCol - 1));
                        }
                    }
                }
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

                XSSFRow row4_2 = getOrCreateRow(sheet, row4.getRowNum() + 1);
                for(int ind = startCol;ind<=startCol+3;ind++){
                    XSSFCell tmp = row4_2.getCell(ind);
                    if(tmp == null){
                        tmp = row4_2.createCell(ind);
                    }
                    tmp.setCellStyle(simpleBorder);
                }
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
                XSSFRow row4_2 = getOrCreateRow(sheet, row4.getRowNum() + 1);
                for(int ind = startCol;ind<=startCol+3;ind++){
                    XSSFCell tmp = row4_2.getCell(ind);
                    if(tmp == null){
                        tmp = row4_2.createCell(ind);
                    }
                    tmp.setCellStyle(simpleBorder);
                }
            }
            if (outParams != null && outParams.size() > i) {
                if (mapping != null) {
                    for (ParamMapping paramMapping : mapping) {
                        if ((paramMapping.getType() == Type.OUTPARAM||paramMapping.getType() == Type.OUTVALUE)
                                && paramMapping.getIn().equals(outParams.get(i).getDynamicParam().getCode())) {
                            XSSFCell cell14 = row4.createCell(startCol + 7 + 1);
                            cell14.setCellValue(paramMapping.getOut());
                            cell14.setCellStyle(simpleBorder);
                            XSSFRow row5 = getOrCreateRow(sheet, row4.getRowNum() + 1);
                            XSSFCell cell15 = row5.createCell(startCol + 7 + 1);
                            cell15.setCellStyle(simpleBorder);
                            sheet.addMergedRegion(new CellRangeAddress(row4.getRowNum(), row4.getRowNum() + 1, startCol + 7 + 1, startCol + 7 + 1));
                        }
                    }
                }
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

                XSSFRow row4_2 = getOrCreateRow(sheet, row4.getRowNum() + 1);
                for(int ind = startCol + 4;ind<=startCol+7;ind++){
                    XSSFCell tmp = row4_2.getCell(ind);
                    if(tmp == null){
                        tmp = row4_2.createCell(ind);
                    }
                    tmp.setCellStyle(simpleBorder);
                }
            } else {
                XSSFCell cell14 = row4.createCell(startCol + 4);
                cell14.setCellValue("");
                cell14.setCellStyle(simpleBorder);
                XSSFCell cell15 = row4.createCell(startCol + 5);
                cell15.setCellValue("");
                cell15.setCellStyle(simpleBorder);
                XSSFCell cell16 = row4.createCell(startCol + 6);
                cell16.setCellValue("");
                cell16.setCellStyle(simpleBorder);
                XSSFCell cell17 = row4.createCell(startCol + 7);
                cell17.setCellValue("");
                cell17.setCellStyle(simpleBorder);
                XSSFRow row4_2 = getOrCreateRow(sheet, row4.getRowNum() + 1);
                for(int ind = startCol + 4;ind<=startCol+7;ind++){
                    XSSFCell tmp = row4_2.getCell(ind);
                    if(tmp == null){
                        tmp = row4_2.createCell(ind);
                    }
                    tmp.setCellStyle(simpleBorder);
                }
            }
        }
        XSSFRow row5 = getOrCreateRow(sheet, startRow + 6 + 2 * size);
        sheet.addMergedRegion(new CellRangeAddress(row5.getRowNum(), row5.getRowNum(), startCol, startCol + 7));
        XSSFCell cell14 = row5.createCell(startCol);
        cell14.setCellValue("Алгоритм");
        cell14.setCellStyle(borderWithBackground);

        for(int ind = startCol;ind<=startCol+7;ind++){
            XSSFCell tmp = row5.getCell(ind);
            if(tmp == null){
                tmp = row5.createCell(ind);
            }
            tmp.setCellStyle(borderWithBackground);
        }

        XSSFRow row6 = getOrCreateRow(sheet, startRow + 6 + 2 * size + 1);
        sheet.addMergedRegion(new CellRangeAddress(row6.getRowNum(), row6.getRowNum() + 3, startCol, startCol + 7));
        XSSFCell cell15 = row6.createCell(startCol);
        cell15.setCellValue(scriptEntity.getDescription());
        cell15.setCellStyle(simpleBorder);
        for(int j = row6.getRowNum();j<=row6.getRowNum()+3;j++) {
            XSSFRow xssfRow = getOrCreateRow(sheet, j);
            for (int ind = startCol; ind <= startCol + 7; ind++) {
                XSSFCell tmp = xssfRow.getCell(ind);
                if (tmp == null) {
                    tmp = xssfRow.createCell(ind);
                }
                tmp.setCellStyle(simpleBorder);
            }
        }


        for (int i = startRow; i <= row6.getRowNum() + 3; i++) {
            for (int j = startCol; j <= startCol + 7; j++) {
                XSSFRow tmpRow = getOrCreateRow(sheet, i);
                XSSFCell tmpCell = tmpRow.getCell(j);
                if (tmpCell == null) {
                    tmpCell = tmpRow.createCell(j);
                }
                XSSFCellStyle cellStyle = tmpCell.getCellStyle();
                cellStyle.setAlignment(HorizontalAlignment.CENTER);
                cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
                tmpCell.setCellStyle(cellStyle);
            }
        }
    }
    private static void addCommonStyle(XSSFCellStyle cellStyle, BorderStyle borderStyle) {
        cellStyle.setBorderBottom(borderStyle);
        cellStyle.setBorderRight(borderStyle);
        cellStyle.setBorderLeft(borderStyle);
        cellStyle.setBorderTop(borderStyle);
    }

    public static XSSFRow getOrCreateRow(XSSFSheet sheet, int rowIdx) {
        XSSFRow row;
        row = sheet.getRow(rowIdx);
        if (row == null) {
            row = sheet.createRow(rowIdx);
        }
        return row;
    }
}
