import { Injectable } from '@angular/core';
@Injectable()
export class ConvertJsonToCsvService {
    downloadCSVFile(data, filename= 'data') {
        const csvData = this.ConvertToCSV(data, ['OrderID',  'CIN', 'CustmerID', 'InvoiceNo', 'InvoiceDate',
        'OrderDate', 'PAN', 'ServiceTax', 'BillTo', 'ShipTo', 'SoldBy', 'GST', 'Terms', 'BalanceDue', 'TotalAmount', 'VAT' ]);

        const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        const dwldLink = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
            dwldLink.setAttribute('target', '_blank');
        }
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', filename + '.csv');
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }

    ConvertToCSV(objArray, headerList) {
         const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;

         let str = '';
         let row = 'S.No,';

         // tslint:disable-next-line: forin
         for (const index in headerList) {
             row += headerList[index] + ',';
         }

         row = row.slice(0, -1);
         str += row + '\r\n';

         for (let i = 0; i < array.length; i++) {
             let line = (i + 1) + '';
             // tslint:disable-next-line: forin
             for (const index in headerList) {
                const head = headerList[index];
                const jsonObject = JSON.parse(array[i]);

                let content = jsonObject[head];
                if (content === undefined) {
                    content = ' ';
                }
                line += ',' + content;
             }
             str += line + '\r\n';
         }
         return str;
     }
}
