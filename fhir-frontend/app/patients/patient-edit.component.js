"use strict";
/*
    This component is for the edit patient page
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
var patient_shared_1 = require("./patient-shared");
var fhir_service_1 = require("../FHIR/fhir.service");
var environment_1 = require("../environments/environment");
var EditPatient = (function () {
    function EditPatient(fhirService, fb, route, router, patientShared) {
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
        this.pageTitle = 'Edit Patient';
        this.pageDescription = 'Editing Patient Information';
        this.saveButtonText = 'Save';
    }
    //This method runs when the page is initialized
    EditPatient.prototype.ngOnInit = function () {
        var _this = this;
        //Populate with default values so the HTML page can load
        this.patientForm = this.fb.group({
            firstName: '',
            middleName: '',
            lastName: '',
            gender: '',
            dateOfBirth: ''
        });
        //Get the patient ID
        this.sub = this.route.params.subscribe(function (params) {
            var id = params['id'];
            _this.patientId = id;
        });
        //Get the patient to edit
        this.fhirService.getOneFhirObject('/' + this.patientId, environment_1.environment.apiUrl_patient)
            .subscribe(function (patient) {
            //Populate the form with the current values and set the validators
            _this.patientForm = _this.fb.group({
                firstName: [patient.name[0].given[0], [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
                middleName: [patient.name[0].given[1], [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
                lastName: [patient.name[0].family, [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
                gender: [patient.gender, forms_1.Validators.required],
                dateOfBirth: [patient.birthDate, [forms_1.Validators.required]]
            });
            //Generate the Error Message Array
            for (var i = 0; i < _this.validationFields.length; i++) {
                _this.errorMessageArray.push('');
            }
            //Generate the AbstractControl Array and subscribe to them
            for (var i = 0; i < _this.validationFields.length; i++) {
                _this.controlArray.push(_this.patientForm.get(_this.validationFields[i]));
                _this.controlArray[i].valueChanges.subscribe(function (value) { return _this.setErrorMessages(); });
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    //This method controls what the back button does
    EditPatient.prototype.onBack = function () {
        this.patientForm.reset();
        this.router.navigate(['/patients']);
    };
    //This method converts and posts the form data to the Spring Boot service
    EditPatient.prototype.save = function () {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.patientForm.disable();
        //Grab the ID
        var uniqueId;
        uniqueId = this.patientId;
        //Convert some data
        var birthDate = this.patientForm.get('dateOfBirth').value;
        //Create the JSON
        var patient = {
            resourceType: 'Patient',
            id: uniqueId,
            name: [{
                    text: this.patientForm.get('firstName').value + ' ' + this.patientForm.get('middleName').value + ' ' + this.patientForm.get('lastName').value,
                    family: this.patientForm.get('lastName').value,
                    given: [this.patientForm.get('firstName').value, this.patientForm.get('middleName').value, this.patientForm.get('lastName').value]
                }],
            gender: this.patientForm.get('gender').value,
            birthDate: birthDate
        };
        //POST new patient to the database
        this.fhirService.updateFhirObject('/' + this.patientId, JSON.stringify(patient), environment_1.environment.apiUrl_patient).subscribe(function (res) {
            //Done
            _this.patientForm.reset();
            _this.router.navigate(['/patients']);
        });
    };
    //This method sets the form error messages as needed
    EditPatient.prototype.setErrorMessages = function () {
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
    return EditPatient;
}());
EditPatient = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-form.component.html'
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService,
        forms_1.FormBuilder,
        router_1.ActivatedRoute,
        router_1.Router,
        patient_shared_1.PatientShared])
], EditPatient);
exports.EditPatient = EditPatient;
//# sourceMappingURL=patient-edit.component.js.map