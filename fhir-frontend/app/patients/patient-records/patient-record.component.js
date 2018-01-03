"use strict";
/*
    This component is for the patient's record list page
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
var router_1 = require("@angular/router");
//Local Imports
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
var PatientRecordComponent = (function () {
    function PatientRecordComponent(_route, _router, fhirService) {
        this._route = _route;
        this._router = _router;
        this.fhirService = fhirService;
    }
    //This method runs before the page is loaded
    PatientRecordComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the ID
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this.id = id;
        });
        //Get the Observation
        this.fhirService.getFhirObjectParam("subject", this.id, environment_1.environment.apiUrl_observation)
            .subscribe(function (observations) { return _this.observations = observations; }, function (error) { return _this.errorMessage = error; });
        //Get the list of Family Member Histories
        this.fhirService.getFhirObjectParam("patient", this.id, environment_1.environment.apiUrl_familyMemberHistory)
            .subscribe(function (familyMemberHistory) { return _this.familyMemberHistory = familyMemberHistory; }, function (error) { return _this.errorMessage = error; });
        //Get the Patient
        this.fhirService.getOneFhirObject('/' + this.id, environment_1.environment.apiUrl_patient)
            .subscribe(function (patient) { return _this.patient = patient; }, function (error) { return _this.errorMessage = error; });
    };
    //This method runs when the user leaves the page
    PatientRecordComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    //This method controls the back button
    PatientRecordComponent.prototype.onBack = function () {
        this._router.navigate(['/patients']);
    };
    //This method deletes the Observation from the patient records
    //  id: The Obervation ID
    PatientRecordComponent.prototype.deleteObservation = function (id) {
        var _this = this;
        this.fhirService.deleteOneFhirObject('/Observation_' + id, environment_1.environment.apiUrl_observation).subscribe(function (res) {
            //Reload when done
            _this.fhirService.getFhirObjectParam("subject", _this.id, environment_1.environment.apiUrl_observation)
                .subscribe(function (observations) { return _this.observations = observations; }, function (error) { return _this.errorMessage = error; });
        });
    };
    //This method deletes a Family Member History from the patient records
    //  id: The Family Member History ID
    PatientRecordComponent.prototype.deleteFamilyMemberHistory = function (id) {
        var _this = this;
        this.fhirService.deleteOneFhirObject('/' + id, environment_1.environment.apiUrl_familyMemberHistory).subscribe(function (res) {
            //Reload when done
            _this.fhirService.getFhirObjectParam("patient", _this.id, environment_1.environment.apiUrl_familyMemberHistory)
                .subscribe(function (familyMemberHistory) { return _this.familyMemberHistory = familyMemberHistory; }, function (error) { return _this.errorMessage = error; });
        });
    };
    return PatientRecordComponent;
}());
PatientRecordComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-record.component.html',
        styleUrls: ['../../shared/shared.format.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        fhir_service_1.FhirService])
], PatientRecordComponent);
exports.PatientRecordComponent = PatientRecordComponent;
//# sourceMappingURL=patient-record.component.js.map