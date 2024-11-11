import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {
    constructor() { }

    async generateExcel(excelData: any) {
        console.log(excelData);

        // Excel Title, Header, Data
        const title = excelData.title;
        const header = excelData.headers;
        const data = excelData.data;

        // Create workbook and worksheet
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Sharing Data');

        // Add Header Row
        const headerRow = worksheet.addRow(header);
        headerRow.height = 15;

        headerRow.eachCell((cell, number) => {
            cell.font = {
                name: 'Calibri',
                family: 4,
                size: 10,
                bold: true,
                color: { argb: "000" }
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };
        });

        // Add Data and Conditional Formatting
        data.forEach((d: any) => {
            const row = worksheet.addRow(d);
            row.alignment = { vertical: 'bottom' };
            row.font = {
                name: 'Calibri',
                family: 4,
                size: 10,
                color: { argb: "000" }
            };
            row.height = 50;

            row.eachCell((cell) => {
                cell.alignment = { wrapText: true };
            });
        });

        // Set column width to 15 for columns 1 to 15
        for (let i = 1; i <= 15; i++) {
            worksheet.getColumn(i).width = 15;
        }

        worksheet.addRow([]);

        // Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            fs.saveAs(blob, `${title}.xlsx`);
        });

    }
}
