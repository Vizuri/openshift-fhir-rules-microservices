/*
    This class contains a collection of methods shared across the patient components
*/

//Angular Imports
import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PatientShared {

    //This method adds a 0 to single digit to days of the month to meet JSON Date requirements
    //  date: the day of the month
    fixDate(date: string): string {

        if (Number.parseInt(date) < 10) {

            return '0' + date

        } else {

            return date
        }
    }

    //This method returns the current system date in YYYY-MM-DDTHH:MM:SS:mmmZ
    getTimestamp(): Date {

        let currentDate = new Date()

        return currentDate
    }

    //This is a custom validator for number ranges
    //  min: The minimum number allowed
    //  max: The maximum number allowed
    numberRange(min: number, max: number): ValidatorFn {

        return (c: AbstractControl): { [key: string]: boolean } | null => {

            if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {

                return { 'range': true };
            }

            return null;
        };
    }

    //This "hacky" method gets the OpenShift IP if running on OpenShift, otherwise, default to the hardcoded URLs located in enviroment.ts
    //  defaultUrl: The hardcoded URL for a specific FHIR object
    getWindowIp(defaultUrl: string): string {

        //Split the URL by '.' and store it in an array
        let windowIpSplitter: string[] = window.location.host.split('.');

        //Check for a MiniShift Address
        if (windowIpSplitter[5] == 'nip') {

            let urlSplitter: string[] = defaultUrl.split('.')

            return urlSplitter[0] + '.' + windowIpSplitter[1] + '.' + windowIpSplitter[2] + '.' + windowIpSplitter[3] + '.' + windowIpSplitter[4] + '.' + urlSplitter[5] + '.' + urlSplitter[6]

            //Otherwise, return the URL in enviroment.ts
        } else {

            return defaultUrl
        }
    }

    //These are the validation error messages
    public validationMessages = {

        required: 'Required',
        range: 'Not valid',
        maxlength: 'Must be less than 30 characters'
    }

    //This method converts a String to a Boolean
    //  boolString: The boolean in String format
    public stringToBool(boolString: string): boolean {

        if (boolString == 'true') {

            return true
        }

        return false;
    }

    //This method converts a Boolean to a String
    //  boolString: The boolean value
    public boolToString(boolString: boolean): string {

        if (boolString == true) {

            return 'true'
        }

        return 'false';
    }
}