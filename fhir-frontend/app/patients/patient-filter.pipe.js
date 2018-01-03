"use strict";
/*
    This pipe filter out patients in order to search for them in the UI
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Angular Imports
var core_1 = require("@angular/core");
var PatientFilterPipe = (function () {
    function PatientFilterPipe() {
    }
    PatientFilterPipe.prototype.transform = function (value, filterBy) {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter(function (patient) {
            return (patient.name[0].family.toLocaleLowerCase().indexOf(filterBy) !== -1)
                || (patient.id.toLocaleLowerCase().indexOf(filterBy) !== -1)
                || (patient.name[0].text.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }) : value;
    };
    return PatientFilterPipe;
}());
PatientFilterPipe = __decorate([
    core_1.Pipe({
        name: 'patientFilter'
    })
], PatientFilterPipe);
exports.PatientFilterPipe = PatientFilterPipe;
//# sourceMappingURL=patient-filter.pipe.js.map