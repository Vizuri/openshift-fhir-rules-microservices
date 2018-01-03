"use strict";
/*
    This component is for the page that displays the list of all the patients
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
var core_1 = require("@angular/core");
var fhir_service_1 = require("../FHIR/fhir.service");
//Local Imports
var environment_1 = require("../environments/environment");
var PatientListComponent = (function () {
    function PatientListComponent(fhirService) {
        this.fhirService = fhirService;
    }
    //This method controls what happens before the page is loaded
    PatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the list of patients
        this.fhirService.getFhirObjects(environment_1.environment.apiUrl_patient)
            .subscribe(function (patients) { return _this.patients = patients; }, function (error) { return _this.errorMessage = error; });
    };
    //This method is called when the delete button is pressed
    //  id: The ID of the patient to be deleted
    PatientListComponent.prototype.delete = function (id) {
        var _this = this;
        //Delete the patient
        this.fhirService.deleteOneFhirObject('/' + id, environment_1.environment.apiUrl_patient).subscribe(function (res) {
            //Reload when done deleting
            _this.fhirService.getFhirObjects(environment_1.environment.apiUrl_patient)
                .subscribe(function (patients) { return _this.patients = patients; }, function (error) { return _this.errorMessage = error; });
        });
    };
    return PatientListComponent;
}());
PatientListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-list.component.html',
        styleUrls: ['../shared/shared.format.css']
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService])
], PatientListComponent);
exports.PatientListComponent = PatientListComponent;
//# sourceMappingURL=patient-list.component.js.map