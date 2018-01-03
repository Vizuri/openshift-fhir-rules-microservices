"use strict";
/*
    This component is for listing the available questionnaires and the patient's responses
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
var http_1 = require("@angular/http");
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
var QuestionnaireListComponent = (function () {
    function QuestionnaireListComponent(fhirService, _router, _route, _http) {
        this.fhirService = fhirService;
        this._router = _router;
        this._route = _route;
        this._http = _http;
        //HTML Variables
        this.pageTitle = 'Questionnaires';
    }
    //This method runs when the page is loading
    QuestionnaireListComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the patient ID from the URL
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this.id = id;
        });
        //Get the available questionnaires
        this.fhirService.getFhirObjects(environment_1.environment.apiUrl_questionnaire)
            .subscribe(function (questionnaires) { return _this.questionnaires = questionnaires; }, function (error) { return _this.errorMessage = error; });
        //Get the patient's questionnaire responses
        this.fhirService.getFhirObjectParam("subject", this.id, environment_1.environment.apiUrl_questionnaireResponse)
            .subscribe(function (questionnaireResponses) { return _this.questionnaireResponses = questionnaireResponses; }, function (error) { return _this.errorMessage = error; });
        //Get the patient
        this.fhirService.getOneFhirObject('/' + this.id, environment_1.environment.apiUrl_patient)
            .subscribe(function (patient) { _this.patient = patient; _this.gotPatientData = true; }, function (error) { return _this.errorMessage = error; });
    };
    //This method controls the back button
    QuestionnaireListComponent.prototype.onBack = function () {
        this._router.navigate(['/patients']);
    };
    //This method deletes a questionnaire response
    //  id: The questionnaire response ID
    QuestionnaireListComponent.prototype.delete = function (id) {
        var _this = this;
        this.fhirService.deleteOneFhirObject('/' + id, environment_1.environment.apiUrl_questionnaireResponse).subscribe(function (res) {
            //Reload when done
            _this.fhirService.getFhirObjectParam("subject", _this.id, environment_1.environment.apiUrl_questionnaireResponse)
                .subscribe(function (questionnaireResponses) { return _this.questionnaireResponses = questionnaireResponses; }, function (error) { return _this.errorMessage = error; });
        });
    };
    return QuestionnaireListComponent;
}());
QuestionnaireListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'questionnaire-list.component.html',
        styleUrls: ['../../shared/shared.format.css']
    }),
    __metadata("design:paramtypes", [fhir_service_1.FhirService,
        router_1.Router,
        router_1.ActivatedRoute,
        http_1.Http])
], QuestionnaireListComponent);
exports.QuestionnaireListComponent = QuestionnaireListComponent;
//# sourceMappingURL=questionnaire-list.component.js.map