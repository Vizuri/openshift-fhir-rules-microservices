"use strict";
/*
    This component is for the patient details (raw json) page
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
var fhir_service_1 = require("../FHIR/fhir.service");
var environment_1 = require("../environments/environment");
var PatientDetailComponent = (function () {
    function PatientDetailComponent(_route, _router, fhirService) {
        this._route = _route;
        this._router = _router;
        this.fhirService = fhirService;
        //HTML Variables
        this.pageTitle = 'Patient Raw Json';
    }
    //This method runs before the page is loaded
    PatientDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the patient ID
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this.id = id;
        });
        //Get the patient using the ID to search for the patient
        this.fhirService.getOneFhirObject('/' + this.id, environment_1.environment.apiUrl_patient)
            .subscribe(function (patient) { return _this.patient = patient; }, function (error) { return _this.errorMessage = error; });
    };
    //This method runs when the user leaves the page
    PatientDetailComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    //This method controls the back button
    PatientDetailComponent.prototype.onBack = function () {
        this._router.navigate(['/patients']);
    };
    return PatientDetailComponent;
}());
PatientDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-detail.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        fhir_service_1.FhirService])
], PatientDetailComponent);
exports.PatientDetailComponent = PatientDetailComponent;
//# sourceMappingURL=patient-detail.component.js.map