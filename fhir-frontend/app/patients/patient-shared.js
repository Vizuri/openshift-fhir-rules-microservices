"use strict";
/*
    This class contains a collection of methods shared across the patient components
*/
Object.defineProperty(exports, "__esModule", { value: true });
var PatientShared = (function () {
    function PatientShared() {
        //These are the validation error messages
        this.validationMessages = {
            required: 'Required',
            range: 'Not valid',
            maxlength: 'Must be less than 30 characters'
        };
    }
    //This method adds a 0 to single digit to days of the month to meet JSON Date requirements
    //  date: the day of the month
    PatientShared.prototype.fixDate = function (date) {
        if (Number.parseInt(date) < 10) {
            return '0' + date;
        }
        else {
            return date;
        }
    };
    //This method returns the current system date in YYYY-MM-DDTHH:MM:SS:mmmZ
    PatientShared.prototype.getTimestamp = function () {
        var currentDate = new Date();
        return currentDate;
    };
    //This is a custom validator for number ranges
    //  min: The minimum number allowed
    //  max: The maximum number allowed
    PatientShared.prototype.numberRange = function (min, max) {
        return function (c) {
            if (c.value && (isNaN(c.value) || c.value < min || c.value > max)) {
                return { 'range': true };
            }
            return null;
        };
    };
    //This "hacky" method gets the OpenShift IP if running on OpenShift, otherwise, default to the hardcoded URLs located in enviroment.ts
    //  defaultUrl: The hardcoded URL for a specific FHIR object
    PatientShared.prototype.getWindowIp = function (defaultUrl) {
        //Split the URL by '.' and store it in an array
        var windowIpSplitter = window.location.host.split('.');
        //Check for a MiniShift Address
        if (windowIpSplitter[5] == 'nip') {
            var urlSplitter = defaultUrl.split('.');
            return urlSplitter[0] + '.' + windowIpSplitter[1] + '.' + windowIpSplitter[2] + '.' + windowIpSplitter[3] + '.' + windowIpSplitter[4] + '.' + urlSplitter[5] + '.' + urlSplitter[6];
            //Otherwise, return the URL in enviroment.ts
        }
        else {
            return defaultUrl;
        }
    };
    //This method converts a String to a Boolean
    //  boolString: The boolean in String format
    PatientShared.prototype.stringToBool = function (boolString) {
        if (boolString == 'true') {
            return true;
        }
        return false;
    };
    //This method converts a Boolean to a String
    //  boolString: The boolean value
    PatientShared.prototype.boolToString = function (boolString) {
        if (boolString == true) {
            return 'true';
        }
        return 'false';
    };
    return PatientShared;
}());
exports.PatientShared = PatientShared;
//# sourceMappingURL=patient-shared.js.map