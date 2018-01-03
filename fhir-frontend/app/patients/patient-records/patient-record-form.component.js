"use strict";
/*
    This component is for the list of a patient's records
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
//Angular Imports
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
//Local Imports
var patient_shared_1 = require("../patient-shared");
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
var PatientRecordForm = (function () {
    function PatientRecordForm(fb, route, router, patientShared, fhirService) {
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.patientShared = patientShared;
        this.fhirService = fhirService;
        //Error Message Array
        this.errorMessageArray = [];
        //HTML fields that can have validation errors
        //This array has to match what is in the HTML
        this.validationFields = [
            'systolicBloodPressure',
            'diastolicBloodPressure',
            'totalCholesterol',
            'hdlCholesterol',
            'ldlCholesterol',
            'triglycerides',
            'waistCircumference',
            'name',
            'age',
            'heightFeet',
            'heightInches',
            'weight' //11
        ];
        //Array of AbstractControl objects for validation
        this.controlArray = [];
    }
    //This method runs when the page is initialized
    PatientRecordForm.prototype.ngOnInit = function () {
        var _this = this;
        //Get the patient ID from the URL
        var sub;
        sub = this.route.params.subscribe(function (params) {
            var id = params['id'];
            _this.patientId = id;
        });
        //Set the default values
        this.patientRecordForm = this.fb.group({
            recordType: ['', forms_1.Validators.required],
            //Observation
            totalCholesterol: null,
            hdlCholesterol: null,
            ldlCholesterol: null,
            systolicBloodPressure: null,
            diastolicBloodPressure: null,
            triglycerides: null,
            waistCircumference: null,
            heightFeet: null,
            heightInches: null,
            weight: null,
            //Family Member History
            name: '',
            relationship: '',
            gender: '',
            age: '',
            heartAttack: false,
            angina: false,
            diabetes: false
        });
        //Generate the Error Message Array
        for (var i = 0; i < this.validationFields.length; i++) {
            this.errorMessageArray.push('');
        }
        //Generate the AbstractControl Array and subscribe to them
        for (var i = 0; i < this.validationFields.length; i++) {
            this.controlArray.push(this.patientRecordForm.get(this.validationFields[i]));
            this.controlArray[i].valueChanges.subscribe(function (value) { return _this.setErrorMessages(); });
        }
        //This watches the record type box to chnage the form based on what the user wants
        //i.e. Observation, Family Member History, etc.
        this.patientRecordForm.get('recordType').valueChanges.subscribe(function (value) { return _this.setRecordTypeValidators(value); });
    };
    //This method controls what the back button does
    PatientRecordForm.prototype.onBack = function () {
        this.router.navigate(['/records/' + this.patientId]);
    };
    //This method converts and posts the form data to the Spring Boot service
    PatientRecordForm.prototype.save = function () {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.patientRecordForm.disable();
        //Observation
        if (this.patientRecordForm.get('recordType').value == 'observation') {
            //Calculate height in inches
            var heightInInches = (this.patientRecordForm.get('heightFeet').value * 12) + this.patientRecordForm.get('heightInches').value;
            //Calulate BMI
            var bmi = (this.patientRecordForm.get('weight').value * 0.45) / ((heightInInches * 0.025) ^ 2);
            //Create the Observation JSON
            var observation = {
                resourceType: 'Observation',
                id: 'Observation_' + this.patientId,
                subject: { reference: this.patientId },
                issued: this.patientShared.getTimestamp(),
                component: [
                    { code: { coding: { code: '8480-6' }, text: 'Systolic Blood Pressure' }, valueQuantity: { value: this.patientRecordForm.get('systolicBloodPressure').value }, unit: 'mmHg' },
                    { code: { coding: { code: '8462-4' }, text: 'Diastolic Blood Pressure' }, valueQuantity: { value: this.patientRecordForm.get('diastolicBloodPressure').value }, unit: 'mmHg' },
                    { code: { coding: { code: '2093-3' }, text: 'Total Cholesterol' }, valueQuantity: { value: this.patientRecordForm.get('totalCholesterol').value }, unit: 'mddL' },
                    { code: { coding: { code: '2085-9' }, text: 'HDL Cholesterol' }, valueQuantity: { value: this.patientRecordForm.get('hdlCholesterol').value }, unit: 'mddL' },
                    { code: { coding: { code: '13457-7' }, text: 'LDL Cholesterol' }, valueQuantity: { value: this.patientRecordForm.get('ldlCholesterol').value }, unit: 'mddL' },
                    { code: { coding: { code: '2571-8' }, text: 'Triglycerides' }, valueQuantity: { value: this.patientRecordForm.get('triglycerides').value }, unit: 'mddL' },
                    { code: { coding: { code: '56086-2' }, text: 'Waist Circumference' }, valueQuantity: { value: this.patientRecordForm.get('waistCircumference').value }, unit: 'in' },
                    { code: { coding: { code: '39156-5' }, text: 'BMI' }, valueQuantity: { value: bmi }, unit: 'kg/m2' },
                    { code: { coding: { code: '3141-9' }, text: 'Height in Inches' }, valueQuantity: { value: heightInInches }, unit: 'in' },
                    { code: { coding: { code: '8302-9' }, text: 'Weight in Pounds' }, valueQuantity: { value: this.patientRecordForm.get('weight').value }, unit: 'lbs' },
                ]
            };
            //Post the Observation JSON
            this.fhirService.postFhirObject(JSON.stringify(observation), environment_1.environment.apiUrl_observation).subscribe(function (observation) {
                _this.patientRecordForm.reset();
                _this.router.navigate(['/records/' + _this.patientId]);
            });
            //Family Member History
        }
        else if (this.patientRecordForm.get('recordType').value == 'familyMemberHistory') {
            //Create the JSON
            var familyMemberHistory = {
                resourceType: 'FamilyMemberHistory',
                id: ('FamilyMemberHistory_' + this.patientRecordForm.get('name').value + '_' + this.patientId).replace(' ', '_'),
                patient: { reference: this.patientId },
                date: this.patientShared.getTimestamp(),
                name: this.patientRecordForm.get('name').value,
                relationship: { coding: { code: '' }, text: this.patientRecordForm.get('relationship').value },
                gender: this.patientRecordForm.get('gender').value,
                ageAge: { value: this.patientRecordForm.get('age').value },
                condition: [
                    { code: { coding: { code: this.patientRecordForm.get('heartAttack').value }, text: 'Heart Attack' } },
                    { code: { coding: { code: this.patientRecordForm.get('angina').value }, text: 'Angina' } },
                    { code: { coding: { code: this.patientRecordForm.get('diabetes').value }, text: 'Diabetes' } }
                ]
            };
            //Post the JSON
            this.fhirService.postFhirObject(JSON.stringify(familyMemberHistory), environment_1.environment.apiUrl_familyMemberHistory).subscribe(function (familyMemberHistory) {
                _this.patientRecordForm.reset();
                _this.router.navigate(['/records/' + _this.patientId]);
            });
        }
    };
    //This method sets the form error messages as needed
    PatientRecordForm.prototype.setErrorMessages = function () {
        var _this = this;
        for (var i = 0; i < this.errorMessageArray.length; i++) {
            if ((this.controlArray[i].touched || this.controlArray[i].dirty) && this.controlArray[i].errors) {
                this.errorMessageArray[i] = Object.keys(this.controlArray[i].errors).map(function (key) { return _this.patientShared.validationMessages[key]; }).join(' ');
            }
            else {
                this.errorMessageArray[i] = '';
            }
        }
    };
    //This method clears all validators from the form
    PatientRecordForm.prototype.clearValidators = function () {
        for (var i = 0; i < this.validationFields.length; i++) {
            var control = this.patientRecordForm.get(this.validationFields[i]).setValidators([]);
        }
    };
    //This method updates the validators in the form
    PatientRecordForm.prototype.updateValidators = function () {
        for (var i = 0; i < this.validationFields.length; i++) {
            var control = this.patientRecordForm.get(this.validationFields[i]).updateValueAndValidity();
        }
    };
    //This method sets the validators of the medical record the user wanted
    //  notifyVia: The record type the user selected
    PatientRecordForm.prototype.setRecordTypeValidators = function (notifyVia) {
        this.clearValidators();
        if (notifyVia == 'observation') {
            this.patientRecordForm.get('totalCholesterol').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('hdlCholesterol').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('ldlCholesterol').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('systolicBloodPressure').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 250)]);
            this.patientRecordForm.get('diastolicBloodPressure').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 250)]);
            this.patientRecordForm.get('triglycerides').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('waistCircumference').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 150)]);
            this.patientRecordForm.get('heightFeet').setValidators([forms_1.Validators.required, this.patientShared.numberRange(1, 9)]);
            this.patientRecordForm.get('heightInches').setValidators([forms_1.Validators.required, this.patientShared.numberRange(1, 11)]);
            this.patientRecordForm.get('weight').setValidators([forms_1.Validators.required, this.patientShared.numberRange(4, 1500)]);
        }
        else if (notifyVia == 'familyMemberHistory') {
            this.patientRecordForm.get('name').setValidators([forms_1.Validators.required, forms_1.Validators.maxLength(30)]);
            this.patientRecordForm.get('relationship').setValidators([forms_1.Validators.required]);
            this.patientRecordForm.get('gender').setValidators([forms_1.Validators.required]);
            this.patientRecordForm.get('age').setValidators([forms_1.Validators.required, this.patientShared.numberRange(0, 130)]);
        }
        this.updateValidators();
    };
    return PatientRecordForm;
}());
PatientRecordForm = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-record-form.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        router_1.ActivatedRoute,
        router_1.Router,
        patient_shared_1.PatientShared,
        fhir_service_1.FhirService])
], PatientRecordForm);
exports.PatientRecordForm = PatientRecordForm;
//# sourceMappingURL=patient-record-form.component.js.map