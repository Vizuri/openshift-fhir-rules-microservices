"use strict";
/*
    This component is for editing Family Member History records
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
var EditFamilyMemberHistory = (function () {
    function EditFamilyMemberHistory(fhirService, fb, route, router, patientShared) {
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
            'name',
            'age' //1
        ];
        //Array of AbstractControl objects for validation
        this.controlArray = [];
    }
    //This method runs when the page is initialized
    EditFamilyMemberHistory.prototype.ngOnInit = function () {
        var _this = this;
        //Set the default values so the page can load
        this.familyMemberHistoryEditForm = this.fb.group({
            name: '',
            relationship: '',
            gender: '',
            age: '',
            heartAttack: false,
            angina: false,
            diabetes: false
        });
        //Get the patient ID
        this.patientIdSub = this.route.params.subscribe(function (params) {
            var id = params['id'];
            _this.patientId = id;
        });
        //Get the Family Member History ID
        this.historyIdSub = this.route.params.subscribe(function (params) {
            var id = params['hid'];
            _this.familyMemberHistoryId = id;
        });
        //Get the Family Member History object to edit
        this.fhirService.getOneFhirObject('/' + this.familyMemberHistoryId, environment_1.environment.apiUrl_familyMemberHistory)
            .subscribe(function (familyMemberHistory) {
            //Get the original name in case of name change
            _this.originalName = familyMemberHistory.name;
            //Populate the form with the current values and set the validators
            var heartAttackBool = _this.patientShared.stringToBool(familyMemberHistory.condition[0].code.coding[0].code);
            var anginaBool = _this.patientShared.stringToBool(familyMemberHistory.condition[1].code.coding[0].code);
            var diabetesBool = _this.patientShared.stringToBool(familyMemberHistory.condition[2].code.coding[0].code);
            _this.familyMemberHistoryEditForm = _this.fb.group({
                name: [familyMemberHistory.name, [forms_1.Validators.required, forms_1.Validators.maxLength(30)]],
                relationship: [familyMemberHistory.relationship.text, [forms_1.Validators.required]],
                gender: [familyMemberHistory.gender, [forms_1.Validators.required]],
                age: [familyMemberHistory.ageAge.value, [forms_1.Validators.required, _this.patientShared.numberRange(0, 130)]],
                heartAttack: [heartAttackBool],
                angina: [anginaBool],
                diabetes: [diabetesBool]
            });
            //Generate the Error Message Array
            for (var i = 0; i < _this.validationFields.length; i++) {
                _this.errorMessageArray.push('');
            }
            //Generate the AbstractControl Array and subscribe to them
            for (var i = 0; i < _this.validationFields.length; i++) {
                _this.controlArray.push(_this.familyMemberHistoryEditForm.get(_this.validationFields[i]));
                _this.controlArray[i].valueChanges.subscribe(function (value) { return _this.setErrorMessages(); });
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    //This method controls what the back button does
    EditFamilyMemberHistory.prototype.onBack = function () {
        this.familyMemberHistoryEditForm.reset();
        this.router.navigate(['/records/' + this.patientId]);
    };
    //This method converts and posts the form data to the Spring Boot service
    EditFamilyMemberHistory.prototype.save = function () {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.familyMemberHistoryEditForm.disable();
        //Grab the ID
        var uniqueId;
        uniqueId = this.patientId;
        //Create the JSON
        var familyMemberHistory = {
            resourceType: 'FamilyMemberHistory',
            id: ('FamilyMemberHistory_' + this.familyMemberHistoryEditForm.get('name').value + '_' + this.patientId).replace(' ', '_'),
            patient: { reference: this.patientId },
            date: this.patientShared.getTimestamp(),
            name: this.familyMemberHistoryEditForm.get('name').value,
            relationship: { coding: { code: '' }, text: this.familyMemberHistoryEditForm.get('relationship').value },
            gender: this.familyMemberHistoryEditForm.get('gender').value,
            ageAge: { value: this.familyMemberHistoryEditForm.get('age').value },
            condition: [
                { code: { coding: { code: this.familyMemberHistoryEditForm.get('heartAttack').value }, text: 'Heart Attack' } },
                { code: { coding: { code: this.familyMemberHistoryEditForm.get('angina').value }, text: 'Angina' } },
                { code: { coding: { code: this.familyMemberHistoryEditForm.get('diabetes').value }, text: 'Diabetes' } }
            ]
        };
        //Check for name change to see if we need to change the ID
        if (this.originalName != this.familyMemberHistoryEditForm.get('name').value) {
            //Delete record with old ID
            this.fhirService.deleteOneFhirObject(('/FamilyMemberHistory_' + this.originalName + '_' + this.patientId).replace(' ', '_'), environment_1.environment.apiUrl_familyMemberHistory)
                .subscribe(function (res) {
                //Post a new record with the new ID
                _this.fhirService.postFhirObject(JSON.stringify(familyMemberHistory), environment_1.environment.apiUrl_familyMemberHistory).subscribe(function (familyMemberHistory) {
                    _this.familyMemberHistoryEditForm.reset();
                    _this.router.navigate(['/records/' + _this.patientId]);
                });
            });
        }
        else {
            //Update family member history
            this.fhirService.updateFhirObject(('/FamilyMemberHistory_'
                + this.familyMemberHistoryEditForm.get('name').value
                + '_'
                + this.patientId).replace(' ', '_'), JSON.stringify(familyMemberHistory), environment_1.environment.apiUrl_familyMemberHistory).subscribe(function (familyMemberHistory) {
                _this.familyMemberHistoryEditForm.reset();
                _this.router.navigate(['/records/' + _this.patientId]);
            });
        }
    };
    //This method sets the form error messages as needed
    EditFamilyMemberHistory.prototype.setErrorMessages = function () {
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
    return EditFamilyMemberHistory;
}());
EditFamilyMemberHistory = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-record-edit-familyMemberHistory.component.html'
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService, forms_1.FormBuilder, router_1.ActivatedRoute, router_1.Router, patient_shared_1.PatientShared])
], EditFamilyMemberHistory);
exports.EditFamilyMemberHistory = EditFamilyMemberHistory;
//# sourceMappingURL=patient-record-edit-familyMemberHistory.component.js.map