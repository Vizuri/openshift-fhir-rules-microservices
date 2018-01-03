"use strict";
/*
    This component is for the questionnaire form
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
var fhir_service_1 = require("../../FHIR/fhir.service");
var environment_1 = require("../../environments/environment");
//JS function to remove unused data
function clean(key, value) {
    return (value == (null || "")) ? undefined : value;
}
var QuestionnaireResponseFormComponent = (function () {
    function QuestionnaireResponseFormComponent(_route, _router, fhirService, _fb) {
        this._route = _route;
        this._router = _router;
        this.fhirService = fhirService;
        this._fb = _fb;
        //HTML Variables
        this.pageTitle = 'Questionnaire Form';
        this.instructions = 'Please fill out the questionnaire below';
        this.saveText = 'Submit';
    }
    //This method runs before the page is loaded
    QuestionnaireResponseFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Get the questionnaire and patient IDs from the URL
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            var pid = params['pid'];
            _this.pid = pid;
            _this.id = id;
            //Get the questionnaire JSON
            _this.fhirService.getOneFhirObject('/' + _this.id, environment_1.environment.apiUrl_questionnaire)
                .subscribe(function (questionnaire) {
                _this.questionnaire = questionnaire;
                //Setup the questionnaire response form
                _this.questionnaireResponseForm = _this._fb.group({
                    resourceType: ["QuestionnaireResponse"],
                    id: [_this.pid + '_' + _this.id],
                    subject: _this._fb.group({
                        reference: [_this.pid],
                        display: []
                    }),
                    item: _this._fb.array([])
                });
                //Start adding questionnaire items
                _this.addItem(_this.questionnaire.item.length - 1);
                //Tell the HTML page that it is safe to load
                //This prevents undefined errors
                _this.gotData = true;
            }, function (error) { return _this.errorMessage = error; });
        });
    };
    //This method creates a new item for the form from the questionnaire object
    //  i: The questionnaire item index
    QuestionnaireResponseFormComponent.prototype.initItem = function (i) {
        return this._fb.group({
            linkId: this.questionnaire.item[i].linkId,
            text: this.questionnaire.item[i].text,
            answer: this._fb.array([
                this.initAnswer(i)
            ])
        });
    };
    //This method creates a new answer object
    //  i: The questionnaire item index
    QuestionnaireResponseFormComponent.prototype.initAnswer = function (i) {
        //Return the correct answer type needed
        if (this.questionnaire.item[i] != undefined) {
            if (this.questionnaire.item[i].type === 'choice') {
                return this._fb.group({
                    valueString: ['', [forms_1.Validators.required]],
                });
            }
            else if (this.questionnaire.item[i].type === 'boolean') {
                return this._fb.group({
                    valueBoolean: ['', [forms_1.Validators.required]],
                });
            }
            else if (this.questionnaire.item[i].type === 'quantity') {
                return this._fb.group({
                    valueQuantity: ['', [forms_1.Validators.required]],
                });
            }
            else {
                return this._fb.group({
                    valueString: [''],
                    valueBoolean: [''],
                    valueQuantity: [''],
                    valueDate: ['']
                });
            }
        }
    };
    //This method adds the item to the form
    //  numQuestions: The number of questions on the questionnaire
    QuestionnaireResponseFormComponent.prototype.addItem = function (numQuestions) {
        for (var i = 0; i <= numQuestions; i++) {
            var control = this.questionnaireResponseForm.controls['item'];
            control.push(this.initItem(i));
        }
    };
    //This method runs when the user leaves the page
    QuestionnaireResponseFormComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    //This method controls the back button
    QuestionnaireResponseFormComponent.prototype.onBack = function () {
        this._router.navigate(['/questionnaires/' + this.pid]);
    };
    //This method saves the new questionnaire response
    //  questionnaireResponseForm: The form the user filled out
    QuestionnaireResponseFormComponent.prototype.save = function (questionnaireResponseForm) {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.questionnaireResponseForm.disable();
        //insert the question text into the answers 
        for (var i = 0; i < this.questionnaire.item.length; i++) {
            questionnaireResponseForm.value.item[i].text = this.questionnaire.item[i].text;
        }
        //Convert valueQuantity into Quantity objects
        for (var r = 0; r < this.questionnaire.item.length; r++) {
            if (questionnaireResponseForm.value.item[r].answer[0].valueQuantity != undefined) {
                if (questionnaireResponseForm.value.item[r].answer[0].valueQuantity == 0) {
                    questionnaireResponseForm.value.item[r].answer[0].valueQuantity = { value: '0' };
                }
                else {
                    questionnaireResponseForm.value.item[r].answer[0].valueQuantity = { value: questionnaireResponseForm.value.item[r].answer[0].valueQuantity };
                }
            }
        }
        //post the questionnaire response
        this.fhirService.postFhirObject(JSON.stringify(questionnaireResponseForm.value, clean), environment_1.environment.apiUrl_questionnaireResponse)
            .subscribe(function (questionnaireResponse) { _this.questionnaireResponse = questionnaireResponse; _this._router.navigate(['/questionnaires/' + _this.pid]); }, function (error) { return _this.errorMessage = error; });
    };
    return QuestionnaireResponseFormComponent;
}());
QuestionnaireResponseFormComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'questionnaireResponse-form.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        fhir_service_1.FhirService,
        forms_1.FormBuilder])
], QuestionnaireResponseFormComponent);
exports.QuestionnaireResponseFormComponent = QuestionnaireResponseFormComponent;
//# sourceMappingURL=questionnaireResponse-form.component.js.map