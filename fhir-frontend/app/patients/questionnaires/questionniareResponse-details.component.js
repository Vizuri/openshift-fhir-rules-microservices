"use strict";
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
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var questionnaireResponse_service_1 = require("../questionnaires/questionnaireResponse.service");
var common_1 = require("@angular/common");
var QuestionnaireResponseDetailComponent = (function () {
    function QuestionnaireResponseDetailComponent(_route, _router, _questionnaireResponseService, _location) {
        this._route = _route;
        this._router = _router;
        this._questionnaireResponseService = _questionnaireResponseService;
        this._location = _location;
        this.pageTitle = 'Questionnaire Response Raw Json';
    }
    QuestionnaireResponseDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this.id = id;
        });
        this._questionnaireResponseService.getOneQuestionnaireResponse('/' + this.id)
            .subscribe(function (questionnaireResponse) { return _this.questionnaireResponse = questionnaireResponse; }, function (error) { return _this.errorMessage = error; });
    };
    QuestionnaireResponseDetailComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    QuestionnaireResponseDetailComponent.prototype.onBack = function () {
        this._location.back();
        //this._router.navigate('riskassessment/123');
    };
    return QuestionnaireResponseDetailComponent;
}());
QuestionnaireResponseDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'questionnaireResponse-details.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        questionnaireResponse_service_1.QuestionnaireResponseService,
        common_1.Location])
], QuestionnaireResponseDetailComponent);
exports.QuestionnaireResponseDetailComponent = QuestionnaireResponseDetailComponent;
//# sourceMappingURL=questionniareResponse-details.component.js.map