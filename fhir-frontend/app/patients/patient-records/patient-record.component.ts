/*
    This component is for the patient's record list page
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//Local Imports
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';
import { Patient } from '../../FHIR/Patient';
import { Observation } from '../../FHIR/Observation';
import { QuestionnaireResponse } from '../../FHIR/QuestionnaireResponse';
import { FamilyMemberHistory } from '../../FHIR/FamilyMemberHistory';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-record.component.html',
    styleUrls: ['../../shared/shared.format.css']
})
export class PatientRecordComponent {

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    private sub: Subscription;

    //FHIR Objects
    patient: Patient;
    observations: Observation[];
    familyMemberHistory: FamilyMemberHistory[];
    questionnaireResponses: QuestionnaireResponse[];


    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private fhirService: FhirService
    ) { }

    //This method runs before the page is loaded
    ngOnInit(): void {

        //Get the ID
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        //Get the Observation
        this.fhirService.getFhirObjectParam("subject", this.id, environment.apiUrl_observation)
            .subscribe(observations => this.observations = observations,
            error => this.errorMessage = <any>error);

        //Get the list of Family Member Histories
        this.fhirService.getFhirObjectParam("patient", this.id, environment.apiUrl_familyMemberHistory)
            .subscribe(familyMemberHistory => this.familyMemberHistory = familyMemberHistory,
            error => this.errorMessage = <any>error);

        //Get the Patient
        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_patient)
            .subscribe(patient => this.patient = patient,
            error => this.errorMessage = <any>error);
    }

    //This method runs when the user leaves the page
    ngOnDestroy() {

        this.sub.unsubscribe();
    }

    //This method controls the back button
    onBack(): void {

        this._router.navigate(['/patients']);
    }

    //This method deletes the Observation from the patient records
    //  id: The Obervation ID
    deleteObservation(id: string): void {

        this.fhirService.deleteOneFhirObject('/Observation_' + id, environment.apiUrl_observation).subscribe((res) => {

            //Reload when done
            this.fhirService.getFhirObjectParam("subject", this.id, environment.apiUrl_observation)
                .subscribe(observations => this.observations = observations,
                error => this.errorMessage = <any>error);
        })
    }

    //This method deletes a Family Member History from the patient records
    //  id: The Family Member History ID
    deleteFamilyMemberHistory(id: string): void {

        this.fhirService.deleteOneFhirObject('/' + id, environment.apiUrl_familyMemberHistory).subscribe((res) => {

            //Reload when done
            this.fhirService.getFhirObjectParam("patient", this.id, environment.apiUrl_familyMemberHistory)
                .subscribe(familyMemberHistory => this.familyMemberHistory = familyMemberHistory,
                error => this.errorMessage = <any>error);
        })
    }
}