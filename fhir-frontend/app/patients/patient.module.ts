/*
    This is the main module for the application
*/

//Angular Imports
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';

//Local Imports
import { PatientListComponent } from './patient-list.component';
import { PatientFilterPipe } from './patient-filter.pipe';
import { RiskAssessmentDetailComponent } from './patient-riskAssessments/riskAssessment-details.component';
import { PatientRiskAssessmentComponent } from './patient-riskAssessments/patient-riskAssessment.component';
import { PatientRecordComponent } from './patient-records/patient-record.component';
import { ObservationDetailComponent } from './patient-records/observation-details.component';
import { EditObservation } from './patient-records/patient-record-edit-observation.component'
import { SharedModule } from '../shared/shared.module'
import { PatientForm } from './patient-form.component';
import { PatientRecordForm } from './patient-records/patient-record-form.component';
import { PatientShared } from './patient-shared';
import { EditPatient } from './patient-edit.component';
import { PatientDetailComponent } from './patient-detail.component';
import { FamilyMemberHistoryDetailComponent } from './patient-records/familyMemberHistory-details.component';
import { EditFamilyMemberHistory } from './patient-records/patient-record-edit-familyMemberHistory.component'
import { QuestionnaireListComponent } from './questionnaires/questionnaire-list.component';
import { QuestionnaireResponseFormComponent } from './questionnaires/questionnaireResponse-form.component';
import { QuestionnaireResponseEditComponent } from './questionnaires/questionnaireResponse-edit.component';
import { QuestionnaireResponseDetailComponent } from './questionnaires/questionnaireResponse-details.component';
import { AppointmentListComponent } from './patient-appointments/patient-appointment-list.component'
import { FhirService } from '../FHIR/fhir.service'

@NgModule({

    declarations: [
        PatientListComponent,
        PatientFilterPipe,
        PatientRiskAssessmentComponent,
        PatientRecordComponent,
        PatientForm,
        RiskAssessmentDetailComponent,
        ObservationDetailComponent,
        PatientRecordForm,
        EditPatient,
        PatientDetailComponent,
        FamilyMemberHistoryDetailComponent,
        QuestionnaireListComponent,
        QuestionnaireListComponent,
        QuestionnaireResponseFormComponent,
        QuestionnaireResponseEditComponent,
        EditObservation,
        QuestionnaireResponseDetailComponent,
        EditFamilyMemberHistory,
        AppointmentListComponent
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'patients', component: PatientListComponent },
            { path: 'patientForm', component: PatientForm },
            { path: 'riskassessment/:pid/:id', component: RiskAssessmentDetailComponent },
            { path: 'observation/:pid/:id', component: ObservationDetailComponent },
            { path: 'familyMemberHistory/:pid/:id', component: FamilyMemberHistoryDetailComponent },
            { path: 'patientRecordForm/:id', component: PatientRecordForm },
            { path: 'edit/:id', component: EditPatient },
            { path: 'records/:id', component: PatientRecordComponent },
            { path: 'riskassessment/:id', component: PatientRiskAssessmentComponent },
            { path: 'patient/:id', component: PatientDetailComponent },
            { path: 'questionnaireResponse/:id/:pid', component: QuestionnaireResponseFormComponent },
            { path: 'editQuestionnaireResponse/:id/:pid', component: QuestionnaireResponseEditComponent },
            { path: 'editObservation/:id', component: EditObservation },
            { path: 'questionnaireResponseDetail/:id/:pid', component: QuestionnaireResponseDetailComponent },
            { path: 'editFamilyMemberHistory/:id/:hid', component: EditFamilyMemberHistory },
            { path: 'viewAvailableAppointments/:id', component: AppointmentListComponent },
        ]),
        RouterModule.forRoot([
            { path: 'questionnaires/:id', component: QuestionnaireListComponent },
        ])
    ],
    providers: [
        PatientShared,
        FhirService
    ]
})

export class PatientModule {


}