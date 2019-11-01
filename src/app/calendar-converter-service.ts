import {Injectable} from "@angular/core";
import * as moment from 'jalali-moment';
import {ECalendarValue, IDatePickerConfig} from 'ng2-jalali-date-picker';
@Injectable()
export class CalendarConverterService {



    convertFromJalaliToGregorian(inputDate) {
        console.log("iiiiiiiiiiiiiiii",inputDate);
        moment.locale('en');
        var m = moment(inputDate, 'jYYYY-jMM-jDD');
        if (m.isValid()){
            let output=m.format('YYYY-MM-DD');
            let UTCDate = new Date(output);
            console.log("dateStr",output);
            console.log("date",UTCDate);
            return output;
        }
    }

    convertFromGregorianToJalaliString(inputDate) {
console.log("inpuuuuuuuuuuuuut",inputDate);
        moment.locale('en'); // set fa locale for all new moment instances
        var m1 = moment(inputDate, "YYYY-MM-DD");

        if (m1.isValid()){
            let output = m1.format("jYYYY-jMM-jDD");
            let jalaliDate = new Date(output);
            console.log("reeeeeeeeeeeeeeeeeeFormat",output);
            return output;

        }
    }
    convertDateFormat(date){
        let year=date.toString().substr(6,4);
        let month=date.toString().substr(3,2);
        let day=date.toString().substr(0,2);
        return year+'-'+month+'-'+day;
    }
    public jalaliConfigExtension: IDatePickerConfig = {
        firstDayOfWeek: 'sa',
        monthFormat: 'MMMM YY',
        weekDayFormat: 'dd',
        dayBtnFormat: 'D',
        monthBtnFormat: 'MMMM',
        locale: 'fa'
    };
    public gregorianSystemDefaults: IDatePickerConfig = {
        firstDayOfWeek: 'su',
        monthFormat: 'MMM, YYYY',
        disableKeypress: false,
        allowMultiSelect: false,
        closeOnSelect: undefined,
        closeOnSelectDelay: 100,
        openOnFocus: true,
        openOnClick: true,
        onOpenDelay: 0,
        weekDayFormat: 'ddd',
        appendTo: document.body,
        showNearMonthDays: true,
        showWeekNumbers: false,
        enableMonthSelector: true,
        yearFormat: 'YYYY',
        showGoToCurrent: true,
        dayBtnFormat: 'DD',
        monthBtnFormat: 'MMM',
        hours12Format: 'hh',
        hours24Format: 'HH',
        meridiemFormat: 'A',
        minutesFormat: 'mm',
        minutesInterval: 1,
        secondsFormat: 'ss',
        secondsInterval: 1,
        showSeconds: false,
        showTwentyFourHours: false,
        timeSeparator: ':',
        multipleYearsNavigateBy: 10,
        showMultipleYearsNavigation: false,
        locale: 'en',
        hideInputContainer: false,
        returnedValueType: ECalendarValue.String,

    };

}
