"use strict";
/*
    This component is for the appointments page
    NOTE: This component is not done and is very much a work in progress
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
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
var AppointmentListComponent = (function () {
    function AppointmentListComponent(route, fhirService) {
        this.route = route;
        this.fhirService = fhirService;
        this.pageTitle = 'Available Slots';
        this.gotPatient = false;
    }
    //This method runs before the page is loaded
    AppointmentListComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the Patient ID
        this.sub = this.route.params.subscribe(function (params) {
            var id = params['id'];
            _this.id = id;
        });
        //Get the patient
        this.fhirService.getOneFhirObject('/' + this.id, environment_1.environment.apiUrl_patient)
            .subscribe(function (patient) {
            _this.patient = patient;
            _this.gotPatient = true;
        }, function (error) { return _this.errorMessage = error; });
        //Get all Slots
        this.fhirService.getFhirObjects(environment_1.environment.apiUrl_slot)
            .subscribe(function (slots) { return _this.slots = slots; }, function (error) { return _this.errorMessage = error; });
        //Get all Schedules
        this.fhirService.getFhirObjects(environment_1.environment.apiUrl_schedule)
            .subscribe(function (schedules) { return _this.schedules = schedules; }, function (error) { return _this.errorMessage = error; });
    };
    //This method books an appointment for a patient
    //  id: The Patient ID
    //  slotId: the Slot ID
    AppointmentListComponent.prototype.bookAppointment = function (id, slotId) {
        console.log('Patient ID: ' + id);
        console.log('Slot ID: ' + slotId);
        window.location.reload();
    };
    return AppointmentListComponent;
}());
AppointmentListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'patient-appointment-list.component.html',
        styleUrls: ['../../shared/shared.format.css']
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, fhir_service_1.FhirService])
], AppointmentListComponent);
exports.AppointmentListComponent = AppointmentListComponent;
//# sourceMappingURL=patient-appointment-list.component.js.map