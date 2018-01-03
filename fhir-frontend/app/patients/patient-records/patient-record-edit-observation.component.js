"use strict";
/*
    This component is for editing a patient's Observation record
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
var patient_shared_1 = require("./../patient-shared");
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
var EditObservation = (function () {
    function EditObservation(fhirService, fb, route, router, patientShared) {
        this.fhirService = fhirService;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.patientShared = patientShared;
        //Error Handling
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
            'heightFeet',
            'heightInches',
            'weight' //9
        ];
        //Array of AbstractControl objects for validation
        this.controlArray = [];
    }
    //This method runs when the page is initialized
    EditObservation.prototype.ngOnInit = function () {
        var _this = this;
        //Set the default values so the page can load
        this.observationEditForm = this.fb.group({
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
        });
        //Get the patient ID
        this.patientIdSub = this.route.params.subscribe(function (params) {
            var id = params['id'];
            _this.patientId = id;
        });
        //Get the Observation to edit
        this.fhirService.getFhirObjectParam('subject', this.patientId, environment_1.environment.apiUrl_observation)
            .subscribe(function (observation) {
            //Populate the form with the current values and set the validators
            _this.observationEditForm = _this.fb.group({
                totalCholesterol: [observation[0].component[2].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 1000)]],
                hdlCholesterol: [observation[0].component[3].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 1000)]],
                ldlCholesterol: [observation[0].component[4].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 1000)]],
                systolicBloodPressure: [observation[0].component[0].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 250)]],
                diastolicBloodPressure: [observation[0].component[1].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 250)]],
                triglycerides: [observation[0].component[5].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 1000)]],
                waistCircumference: [observation[0].component[6].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 150)]],
                heightFeet: [Math.floor(observation[0].component[8].valueQuantity.value / 12), [forms_1.Validators.required, _this.patientShared.numberRange(1, 9)]],
                heightInches: [observation[0].component[8].valueQuantity.value - (Math.floor(observation[0].component[8].valueQuantity.value / 12) * 12), [forms_1.Validators.required, _this.patientShared.numberRange(1, 11)]],
                weight: [observation[0].component[9].valueQuantity.value, [forms_1.Validators.required, _this.patientShared.numberRange(4, 1500)]]
            });
            //Generate the Error Message Array
            for (var i = 0; i < _this.validationFields.length; i++) {
                _this.errorMessageArray.push('');
            }
            //Generate the AbstractControl Array and subscribe to them
            for (var i = 0; i < _this.validationFields.length; i++) {
                _this.controlArray.push(_this.observationEditForm.get(_this.validationFields[i]));
                _this.controlArray[i].valueChanges.subscribe(function (value) { return _this.setErrorMessages(); });
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    //This method controls what the back button does
    EditObservation.prototype.onBack = function () {
        this.observationEditForm.reset();
        this.router.navigate(['/records/' + this.patientId]);
    };
    //This method converts and posts the form data to the Spring Boot service
    EditObservation.prototype.save = function () {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.observationEditForm.disable();
        //Grab the ID
        var uniqueId;
        uniqueId = this.patientId;
        //Calculate height in inches
        var heightInInches = (this.observationEditForm.get('heightFeet').value * 12) + this.observationEditForm.get('heightInches').value;
        //Calulate BMI
        var bmi = (this.observationEditForm.get('weight').value * 0.45) / ((heightInInches * 0.025) ^ 2);
        //Create the JSON
        var observation = {
            resourceType: 'Observation',
            id: 'Observation_' + this.patientId,
            subject: { reference: this.patientId },
            issued: this.patientShared.getTimestamp(),
            component: [
                { code: { coding: { code: '8480-6' }, text: 'Systolic Blood Pressure' }, valueQuantity: { value: this.observationEditForm.get('systolicBloodPressure').value }, unit: 'mmHg' },
                { code: { coding: { code: '8462-4' }, text: 'Diastolic Blood Pressure' }, valueQuantity: { value: this.observationEditForm.get('diastolicBloodPressure').value }, unit: 'mmHg' },
                { code: { coding: { code: '2093-3' }, text: 'Total Cholesterol' }, valueQuantity: { value: this.observationEditForm.get('totalCholesterol').value }, unit: 'mddL' },
                { code: { coding: { code: '2085-9' }, text: 'HDL Cholesterol' }, valueQuantity: { value: this.observationEditForm.get('hdlCholesterol').value }, unit: 'mddL' },
                { code: { coding: { code: '13457-7' }, text: 'LDL Cholesterol' }, valueQuantity: { value: this.observationEditForm.get('ldlCholesterol').value }, unit: 'mddL' },
                { code: { coding: { code: '2571-8' }, text: 'Triglycerides' }, valueQuantity: { value: this.observationEditForm.get('triglycerides').value }, unit: 'mddL' },
                { code: { coding: { code: '56086-2' }, text: 'Waist Circumference' }, valueQuantity: { value: this.observationEditForm.get('waistCircumference').value }, unit: 'in' },
                { code: { coding: { code: '39156-5' }, text: 'BMI' }, valueQuantity: { value: bmi }, unit: 'kg/m2' },
                { code: { coding: { code: '3141-9' }, text: 'Height in Inches' }, valueQuantity: { value: heightInInches }, unit: 'in' },
                { code: { coding: { code: '8302-9' }, text: 'Weight in Pounds' }, valueQuantity: { value: this.observationEditForm.get('weight').value }, unit: 'lbs' },
            ]
        };
        //Update the observation
        this.fhirService.updateFhirObject('/Observation_' + this.patientId, JSON.stringify(observation), environment_1.environment.apiUrl_observation)
            .subscribe(function (observation) {
            _this.observationEditForm.reset();
            _this.router.navigate(['/records/' + _this.patientId]);
        });
    };
    //This method sets the form error messages as needed
    EditObservation.prototype.setErrorMessages = function () {
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
    return EditObservation;
}());
EditObservation = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-record-edit-observation.component.html'
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService, forms_1.FormBuilder, router_1.ActivatedRoute, router_1.Router, patient_shared_1.PatientShared])
], EditObservation);
exports.EditObservation = EditObservation;
//# sourceMappingURL=patient-record-edit-observation.component.js.map