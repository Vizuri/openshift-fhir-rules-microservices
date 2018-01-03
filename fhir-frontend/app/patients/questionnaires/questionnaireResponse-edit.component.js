"use strict";
/*
    This component is for editing a questionnaire response
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
var patient_shared_1 = require("../patient-shared");
//JS function to remove unused data
function clean(key, value) {
    return (value == (null || "")) ? undefined : value;
}
var QuestionnaireResponseEditComponent = (function () {
    function QuestionnaireResponseEditComponent(_route, _router, fhirService, _fb, patientShared) {
        this._route = _route;
        this._router = _router;
        this.fhirService = fhirService;
        this._fb = _fb;
        this.patientShared = patientShared;
        //HTML Variables
        this.pageTitle = 'Edit Questionnaire Form';
        this.instructions = 'Editing Questionnaire Response';
        this.saveText = 'Save';
    }
    //This method runs before the page is loaded
    QuestionnaireResponseEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Set the default values so the page can load
        this.questionnaireResponseForm = this._fb.group({
            resourceType: '',
            id: '',
            subject: '',
            item: this._fb.array([])
        });
        //Get the questionnaire and patient IDs from the URL
        this.sub = this._route.params.subscribe(function (params) {
            var id = params['id'];
            var pid = params['pid'];
            _this.pid = pid;
            _this.id = id;
            //Get the questionnaire JSON
            _this.fhirService.getOneFhirObject('/' + _this.id.substring(9, _this.id.length), environment_1.environment.apiUrl_questionnaire)
                .subscribe(function (questionnaire) {
                _this.questionnaire = questionnaire;
                //Get the questionnaire response JSON
                _this.fhirService.getOneFhirObject('/' + _this.id, environment_1.environment.apiUrl_questionnaireResponse).subscribe(function (res) {
                    _this.questionnaireResponse = res;
                    //Setup the questionnaire response form
                    _this.questionnaireResponseForm = _this._fb.group({
                        resourceType: ["QuestionnaireResponse"],
                        id: [_this.id],
                        subject: _this._fb.group({
                            reference: [_this.pid],
                            display: []
                        }),
                        item: _this._fb.array([])
                    });
                    //Start adding questionnaire items
                    _this.addItem(res.item.length - 1);
                    //Tell the HTML page that it is safe to load
                    //This prevents undefined errors
                    _this.gotData = true;
                });
            });
        });
    };
    //This method creates a new item for the form from the questionnaire object
    //  i: The questionnaire item index
    QuestionnaireResponseEditComponent.prototype.initItem = function (i) {
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
    QuestionnaireResponseEditComponent.prototype.initAnswer = function (i) {
        //Return the correct answer type needed
        if (this.questionnaire.item[i] != undefined) {
            if (this.questionnaire.item[i].type === 'choice') {
                return this._fb.group({
                    valueString: [this.questionnaireResponse.item[i].answer[0].valueString, [forms_1.Validators.required]],
                });
            }
            else if (this.questionnaire.item[i].type === 'boolean') {
                var stringBool = this.patientShared.boolToString(this.questionnaireResponse.item[i].answer[0].valueBoolean);
                return this._fb.group({
                    valueBoolean: [stringBool, [forms_1.Validators.required]],
                });
            }
            else if (this.questionnaire.item[i].type === 'quantity') {
                return this._fb.group({
                    valueQuantity: [this.questionnaireResponse.item[i].answer[0].valueQuantity.value, [forms_1.Validators.required]],
                });
            }
        }
    };
    //This method adds the item to the form
    //  numQuestions: The number of questions on the questionnaire
    QuestionnaireResponseEditComponent.prototype.addItem = function (numQuestions) {
        for (var i = 0; i <= numQuestions; i++) {
            var control = this.questionnaireResponseForm.controls['item'];
            control.push(this.initItem(i));
        }
    };
    //This method runs when the user leaves the page
    QuestionnaireResponseEditComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    //This method controls the back button
    QuestionnaireResponseEditComponent.prototype.onBack = function () {
        this._router.navigate(['/questionnaires/' + this.pid]);
    };
    //This method saves the new questionnaire response
    //  questionnaireResponseForm: The form the user filled out
    QuestionnaireResponseEditComponent.prototype.save = function (questionnaireResponseForm) {
        var _this = this;
        //Disable the form to prevent duplicate posts
        this.questionnaireResponseForm.disable();
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
        this.fhirService.postFhirObject(JSON.stringify(this.questionnaireResponseForm.value, clean), environment_1.environment.apiUrl_questionnaireResponse)
            .subscribe(function (questionnaireResponse) { _this.questionnaireResponseList = questionnaireResponse; _this._router.navigate(['/questionnaires/' + _this.pid]); }, function (error) { return _this.errorMessage = error; });
    };
    return QuestionnaireResponseEditComponent;
}());
QuestionnaireResponseEditComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'questionnaireResponse-form.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        fhir_service_1.FhirService,
        forms_1.FormBuilder,
        patient_shared_1.PatientShared])
], QuestionnaireResponseEditComponent);
exports.QuestionnaireResponseEditComponent = QuestionnaireResponseEditComponent;
//# sourceMappingURL=questionnaireResponse-edit.component.js.map