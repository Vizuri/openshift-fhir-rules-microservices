"use strict";
/*
    This component is for the patient's risk assessment page
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
var common_1 = require("@angular/common");
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
var PatientRiskAssessmentComponent = (function () {
    function PatientRiskAssessmentComponent(_route, _router, fhirService, _location) {
        this._route = _route;
        this._router = _router;
        this.fhirService = fhirService;
        this._location = _location;
        //HTML Variables
        this.runningRiskAssessment = false;
    }
    //This method runs before the page is loaded
    PatientRiskAssessmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the patient ID from the URL
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this.id = id;
        });
        //get all risk assessmments for a given patient 
        this.fhirService.getFhirObjectParam("subject", "Patient/" + this.id, environment_1.environment.apiUrl_riskAssessment)
            .subscribe(function (riskAssessments) { return _this.riskAssessments = riskAssessments; }, function (error) { return _this.errorMessage = error; });
        //get a single patient by id         
        this.fhirService.getOneFhirObject('/' + this.id, environment_1.environment.apiUrl_patient)
            .subscribe(function (patient) { return _this.patient = patient; }, function (error) { return _this.errorMessage = error; });
    };
    //This method runs when the user leaves the page
    PatientRiskAssessmentComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    //This method controls the back button
    PatientRiskAssessmentComponent.prototype.onBack = function () {
        this._router.navigate(['/patients']);
    };
    //This method runs a risk assessment
    //  rule: The risk assessment rules to run
    //  id: The patient ID
    PatientRiskAssessmentComponent.prototype.runRisk = function (rule, id) {
        var _this = this;
        this.runningRiskAssessment = true;
        this.fhirService.postFhirObject('', environment_1.environment.apiUrl_riskAssessment + '/' + rule + '/' + id)
            .subscribe(function (riskAssessments) {
            _this.riskOutput = riskAssessments;
            _this.fhirService.getFhirObjectParam("subject", "Patient/" + _this.id, environment_1.environment.apiUrl_riskAssessment)
                .subscribe(function (riskAssessments) {
                _this.riskAssessments = riskAssessments;
                _this.runningRiskAssessment = false;
            }, function (error) { return _this.errorMessage = error; });
        }, function (error) { return _this.errorMessage = error; });
    };
    return PatientRiskAssessmentComponent;
}());
PatientRiskAssessmentComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-riskAssessment.component.html',
        styleUrls: ['../../shared/shared.format.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        fhir_service_1.FhirService,
        common_1.Location])
], PatientRiskAssessmentComponent);
exports.PatientRiskAssessmentComponent = PatientRiskAssessmentComponent;
//# sourceMappingURL=patient-riskAssessment.component.js.map