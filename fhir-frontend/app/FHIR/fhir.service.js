"use strict";
/*
    This is the CRUD class. It communicates with the FHIR services by using HTTP GET, POST, DELETE, and PUT
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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
//JavaScript Imports
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
//Local Imports
var patient_shared_1 = require("../patients/patient-shared");
var FhirService = (function () {
    function FhirService(_http, patientShared) {
        this._http = _http;
        this.patientShared = patientShared;
    }
    //This method gets all FHIR objects from an endpoint
    //  url: The URL of the endpoint
    FhirService.prototype.getFhirObjects = function (url) {
        return this._http.get(this.patientShared.getWindowIp(url))
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    //This method gets all FHIR objects with a matching parameter from an endpoint
    //  search: The FHIR object's parameter name to search for
    //  param: The FHIR object's parameter value to search for
    //  url: The URL of the endpoint
    FhirService.prototype.getFhirObjectParam = function (search, param, url) {
        var params = new http_1.URLSearchParams();
        params.set(search.toString(), param.toString());
        return this._http.get(this.patientShared.getWindowIp(url), { search: params })
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    //This method gets a single FHIR object from an endpoint by matching the ID
    //  id: The ID of the FHIR object
    //  url: The URL of the endpoint
    FhirService.prototype.getOneFhirObject = function (id, url) {
        return this._http.get(this.patientShared.getWindowIp(url) + id)
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    //This method deletes a FHIR object from an endpoint by matching the ID
    //  id: The ID of the FHIR object
    //  url: The URL of the endpoint
    FhirService.prototype.deleteOneFhirObject = function (id, url) {
        return this._http.delete(this.patientShared.getWindowIp(url) + id);
    };
    //This method posts a new FHIR object to an endpoint
    //  id: The ID of the FHIR object
    //  jsonData: The FHIR object to post in a JSON String
    //  url: The URL of the endpoint
    FhirService.prototype.postFhirObject = function (jsonData, url) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(this.patientShared.getWindowIp(url), jsonData, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    //This method updates a FHIR object on the endpoint
    //  id: The ID of the FHIR object
    //  jsonData: The FHIR object to post in a JSON String
    //  url: The URL of the endpoint
    FhirService.prototype.updateFhirObject = function (id, jsonData, url) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.put(this.patientShared.getWindowIp(url) + id, jsonData, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    //This method handles any errors that happen
    //  error: The endpoint's response
    FhirService.prototype.handleError = function (error) {
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    return FhirService;
}());
FhirService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, patient_shared_1.PatientShared])
], FhirService);
exports.FhirService = FhirService;
//# sourceMappingURL=fhir.service.js.map