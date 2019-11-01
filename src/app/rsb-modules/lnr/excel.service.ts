import { Injectable } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
@Injectable()
export class ExcelService {

  constructor() { }
    /**
         @Desc exporting data to CSV file
         @Param file name , headers list data array
         @return save SCV file to downloads
     */
    exportToCSV(fileName:any,header:any,data:any){
            let options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true,
                showTitle: true,
                useBom: true,
                headers:header
            };
            new Angular2Csv(data,fileName,options);

    }

}
