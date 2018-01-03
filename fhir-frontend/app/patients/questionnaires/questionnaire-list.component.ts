/*
    This component is for listing the available questionnaires and the patient's responses
*/

//Angular Imports
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';

//Local Imports
import { Questionnaire } from '../../FHIR/Questionnaire';
import { QuestionnaireResponse } from '../../FHIR/QuestionnaireResponse';
import { Patient } from '../../FHIR/Patient'
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'questionnaire-list.component.html',
    styleUrls: ['../../shared/shared.format.css']
})
export class QuestionnaireListComponent implements OnInit {

    //HTML Variables
    pageTitle: string = 'Questionnaires';

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    sub: Subscription;

    //Flags
    gotPatientData: boolean

    //FHIR Objects
    questionnaires: Questionnaire[];
    questionnaireResponses: QuestionnaireResponse[];
    patient: Patient

    constructor(private fhirService: FhirService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _http: Http) {

    }

    //This method runs when the page is loading
    ngOnInit(): void {

        //Get the patient ID from the URL
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        //Get the available questionnaires
        this.fhirService.getFhirObjects(environment.apiUrl_questionnaire)
            .subscribe(questionnaires => this.questionnaires = questionnaires,
            error => this.errorMessage = <any>error);

        //Get the patient's questionnaire responses
        this.fhirService.getFhirObjectParam("subject", this.id, environment.apiUrl_questionnaireResponse)
            .subscribe(questionnaireResponses => this.questionnaireResponses = questionnaireResponses,
            error => this.errorMessage = <any>error);

        //Get the patient
        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_patient)
            .subscribe(patient => { this.patient = patient; this.gotPatientData = true },
            error => this.errorMessage = <any>error);
    }

    //This method controls the back button
    onBack(): void {

        this._router.navigate(['/patients']);
    }

    //This method deletes a questionnaire response
    //  id: The questionnaire response ID
    delete(id: string): void {

        this.fhirService.deleteOneFhirObject('/' + id, environment.apiUrl_questionnaireResponse).subscribe((res) => {

            //Reload when done
            this.fhirService.getFhirObjectParam("subject", this.id, environment.apiUrl_questionnaireResponse)
                .subscribe(questionnaireResponses => this.questionnaireResponses = questionnaireResponses,
                error => this.errorMessage = <any>error);
        })
    }
}