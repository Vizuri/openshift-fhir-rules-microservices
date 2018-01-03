/*
    This component is for the patient's risk assessment page
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

//Local Imports
import { Observation } from '../../FHIR/Observation';
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';
import { RiskAssessment } from '../../FHIR/RiskAssessment';
import { Patient } from '../../FHIR/Patient'

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id,
    templateUrl: 'patient-riskAssessment.component.html',
    styleUrls: ['../../shared/shared.format.css']
})
export class PatientRiskAssessmentComponent implements OnInit, OnDestroy {

    //HTML Variables
    runningRiskAssessment: boolean = false;

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    private sub: Subscription;

    //FHIR Objects
    patient: Patient;
    riskAssessments: RiskAssessment[];
    riskOutput: RiskAssessment[];

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private fhirService: FhirService,
        private _location: Location
    ) { }

    //This method runs before the page is loaded
    ngOnInit(): void {

        //Get the patient ID from the URL
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        //get all risk assessmments for a given patient 
        this.fhirService.getFhirObjectParam("subject", "Patient/" + this.id, environment.apiUrl_riskAssessment)
            .subscribe(riskAssessments => this.riskAssessments = riskAssessments,
            error => this.errorMessage = <any>error);

        //get a single patient by id         
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

    //This method runs a risk assessment
    //  rule: The risk assessment rules to run
    //  id: The patient ID
    runRisk(rule: string, id: string): void {

        this.runningRiskAssessment = true;

        this.fhirService.postFhirObject('', environment.apiUrl_riskAssessment + '/' + rule + '/' + id)
            .subscribe(riskAssessments => {

                this.riskOutput = riskAssessments;

                this.fhirService.getFhirObjectParam("subject", "Patient/" + this.id, environment.apiUrl_riskAssessment)
                    .subscribe(riskAssessments => {

                        this.riskAssessments = riskAssessments

                        this.runningRiskAssessment = false;

                    },
                    error => this.errorMessage = <any>error);
            },
            error => this.errorMessage = <any>error);

    }
}