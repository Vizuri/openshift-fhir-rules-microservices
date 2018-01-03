"use strict";
/*
    This is the main module for the application
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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
//Local Imports
var patient_list_component_1 = require("./patient-list.component");
var patient_filter_pipe_1 = require("./patient-filter.pipe");
var riskAssessment_details_component_1 = require("./patient-riskAssessments/riskAssessment-details.component");
var patient_riskAssessment_component_1 = require("./patient-riskAssessments/patient-riskAssessment.component");
var patient_record_component_1 = require("./patient-records/patient-record.component");
var observation_details_component_1 = require("./patient-records/observation-details.component");
var patient_record_edit_observation_component_1 = require("./patient-records/patient-record-edit-observation.component");
var shared_module_1 = require("../shared/shared.module");
var patient_form_component_1 = require("./patient-form.component");
var patient_record_form_component_1 = require("./patient-records/patient-record-form.component");
var patient_shared_1 = require("./patient-shared");
var patient_edit_component_1 = require("./patient-edit.component");
var patient_detail_component_1 = require("./patient-detail.component");
var familyMemberHistory_details_component_1 = require("./patient-records/familyMemberHistory-details.component");
var patient_record_edit_familyMemberHistory_component_1 = require("./patient-records/patient-record-edit-familyMemberHistory.component");
var questionnaire_list_component_1 = require("./questionnaires/questionnaire-list.component");
var questionnaireResponse_form_component_1 = require("./questionnaires/questionnaireResponse-form.component");
var questionnaireResponse_edit_component_1 = require("./questionnaires/questionnaireResponse-edit.component");
var questionnaireResponse_details_component_1 = require("./questionnaires/questionnaireResponse-details.component");
var patient_appointment_list_component_1 = require("./patient-appointments/patient-appointment-list.component");
var fhir_service_1 = require("../FHIR/fhir.service");
var PatientModule = (function () {
    function PatientModule() {
    }
    return PatientModule;
}());
PatientModule = __decorate([
    core_1.NgModule({
        declarations: [
            patient_list_component_1.PatientListComponent,
            patient_filter_pipe_1.PatientFilterPipe,
            patient_riskAssessment_component_1.PatientRiskAssessmentComponent,
            patient_record_component_1.PatientRecordComponent,
            patient_form_component_1.PatientForm,
            riskAssessment_details_component_1.RiskAssessmentDetailComponent,
            observation_details_component_1.ObservationDetailComponent,
            patient_record_form_component_1.PatientRecordForm,
            patient_edit_component_1.EditPatient,
            patient_detail_component_1.PatientDetailComponent,
            familyMemberHistory_details_component_1.FamilyMemberHistoryDetailComponent,
            questionnaire_list_component_1.QuestionnaireListComponent,
            questionnaire_list_component_1.QuestionnaireListComponent,
            questionnaireResponse_form_component_1.QuestionnaireResponseFormComponent,
            questionnaireResponse_edit_component_1.QuestionnaireResponseEditComponent,
            patient_record_edit_observation_component_1.EditObservation,
            questionnaireResponse_details_component_1.QuestionnaireResponseDetailComponent,
            patient_record_edit_familyMemberHistory_component_1.EditFamilyMemberHistory,
            patient_appointment_list_component_1.AppointmentListComponent
        ],
        imports: [
            shared_module_1.SharedModule,
            forms_1.ReactiveFormsModule,
            router_1.RouterModule.forChild([
                { path: 'patients', component: patient_list_component_1.PatientListComponent },
                { path: 'patientForm', component: patient_form_component_1.PatientForm },
                { path: 'riskassessment/:pid/:id', component: riskAssessment_details_component_1.RiskAssessmentDetailComponent },
                { path: 'observation/:pid/:id', component: observation_details_component_1.ObservationDetailComponent },
                { path: 'familyMemberHistory/:pid/:id', component: familyMemberHistory_details_component_1.FamilyMemberHistoryDetailComponent },
                { path: 'patientRecordForm/:id', component: patient_record_form_component_1.PatientRecordForm },
                { path: 'edit/:id', component: patient_edit_component_1.EditPatient },
                { path: 'records/:id', component: patient_record_component_1.PatientRecordComponent },
                { path: 'riskassessment/:id', component: patient_riskAssessment_component_1.PatientRiskAssessmentComponent },
                { path: 'patient/:id', component: patient_detail_component_1.PatientDetailComponent },
                { path: 'questionnaireResponse/:id/:pid', component: questionnaireResponse_form_component_1.QuestionnaireResponseFormComponent },
                { path: 'editQuestionnaireResponse/:id/:pid', component: questionnaireResponse_edit_component_1.QuestionnaireResponseEditComponent },
                { path: 'editObservation/:id', component: patient_record_edit_observation_component_1.EditObservation },
                { path: 'questionnaireResponseDetail/:id/:pid', component: questionnaireResponse_details_component_1.QuestionnaireResponseDetailComponent },
                { path: 'editFamilyMemberHistory/:id/:hid', component: patient_record_edit_familyMemberHistory_component_1.EditFamilyMemberHistory },
                { path: 'viewAvailableAppointments/:id', component: patient_appointment_list_component_1.AppointmentListComponent },
            ]),
            router_1.RouterModule.forRoot([
                { path: 'questionnaires/:id', component: questionnaire_list_component_1.QuestionnaireListComponent },
            ])
        ],
        providers: [
            patient_shared_1.PatientShared,
            fhir_service_1.FhirService
        ]
    })
], PatientModule);
exports.PatientModule = PatientModule;
//# sourceMappingURL=patient.module.js.map