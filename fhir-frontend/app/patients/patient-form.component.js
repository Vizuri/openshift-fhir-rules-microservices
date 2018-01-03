"use strict";
/*
    This component is for the Add New Patient page
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
var http_1 = require("@angular/http");
var fhir_service_1 = require("../FHIR/fhir.service");
//Local Imports
var patient_shared_1 = require("./patient-shared");
var environment_1 = require("../environments/environment");
var PatientForm = (function () {
    function PatientForm(fb, route, router, patientShared, http, fhirService) {
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.patientShared = patientShared;
        this.http = http;
        this.fhirService = fhirService;
        //Error Handling
        this.errorMessageArray = [];
        //HTML fields that can have validation errors
        //This array has to match what is in the HTML
        this.validationFields = [
            'firstName',
            'middleName',
            'lastName',
            'dateOfBirth',
        ];
        //Array of AbstractControl objects for validation
        this.controlArray = [];
        //URL
        this.patientUrl = environment_1.environment.apiUrl_patient;
        //HTML Variables
        this.pageTitle = 'Add New Patient';
        this.pageDescription = 'Please fill out all information below:';
        this.saveButtonText = 'Submit';
    }
    //This method runs when the page is initialized
    PatientForm.prototype.ngOnInit = function () {
        var _this = this;
        //Set the default values and validators
        this.patientForm = this.fb.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
            middleName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
            gender: ['', forms_1.Validators.required],
            dateOfBirth: ['', [forms_1.Validators.required]]
        });
        //Generate the Error Message Array
        for (var i = 0; i < this.validationFields.length; i++) {
            this.errorMessageArray.push('');
        }
        //Generate the AbstractControl Array and subscribe to them
        for (var i = 0; i < this.validationFields.length; i++) {
            this.controlArray.push(this.patientForm.get(this.validationFields[i]));
            this.controlArray[i].valueChanges.subscribe(function (value) { return _this.setErrorMessages(); });
        }
    };
    //This method controls what the back button does
    PatientForm.prototype.onBack = function () {
        this.router.navigate(['/patients']);
    };
    //This method converts and posts the form data to the Spring Boot service
    PatientForm.prototype.save = function () {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.patientForm.disable();
        var uniqueId;
        //Generate a unique ID
        this.http.get(this.patientUrl).toPromise().then(function (response) {
            var idArray = [];
            var patientJsonArray;
            //Store the patients in an array
            patientJsonArray = response.json();
            //Store each patient ID in an array
            //ID is inside the Identifier object of the Patient object
            for (var i = 0; i < patientJsonArray.length; i++) {
                idArray.push(JSON.stringify(Object.values(patientJsonArray[i])[1]));
                console.log('ID Checker: ' + JSON.stringify(Object.values(patientJsonArray[i])[1]));
            }
            //Find a unique ID
            var uniqueIdCheck = false;
            while (uniqueIdCheck == false) {
                //Generate an ID
                uniqueId = (Math.floor(Math.random() * 100000000)).toString();
                uniqueIdCheck = true;
                //Check if the ID is already in use
                for (var i = 0; i < idArray.length; i++) {
                    if (uniqueId == idArray[i]) {
                        uniqueIdCheck = false;
                        break;
                    }
                }
            }
            //Create the Date object
            var birthDate = _this.patientForm.get('dateOfBirth').value;
            //Create the patient JSON
            var patient = {
                resourceType: 'Patient',
                id: uniqueId,
                name: [{
                        text: _this.patientForm.get('firstName').value + ' ' + _this.patientForm.get('middleName').value + ' ' + _this.patientForm.get('lastName').value,
                        family: _this.patientForm.get('lastName').value,
                        given: [_this.patientForm.get('firstName').value, _this.patientForm.get('middleName').value, _this.patientForm.get('lastName').value]
                    }],
                gender: _this.patientForm.get('gender').value,
                birthDate: birthDate
            };
            //Post the patient
            _this.fhirService.postFhirObject(JSON.stringify(patient), environment_1.environment.apiUrl_patient)
                .subscribe(function (res) {
                //Done
                _this.patientForm.reset();
                _this.router.navigate(['/patients/']);
            }, function (error) { return _this.errorMessage = error; });
        }).catch(function (err) {
            console.log(err);
        });
    };
    //This method sets the form error messages as needed
    PatientForm.prototype.setErrorMessages = function () {
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
    return PatientForm;
}());
PatientForm = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-form.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        router_1.ActivatedRoute,
        router_1.Router,
        patient_shared_1.PatientShared,
        http_1.Http,
        fhir_service_1.FhirService])
], PatientForm);
exports.PatientForm = PatientForm;
//# sourceMappingURL=patient-form.component.js.map