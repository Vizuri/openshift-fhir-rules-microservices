/*
    This component is for displaying the questionnaire response raw JSON
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

//Local Imports
import { QuestionnaireResponse } from '../../FHIR/QuestionnaireResponse';
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';


@Component({

    moduleId: module.id,
    templateUrl: '../../FHIR/fhir-details.html'
})
export class QuestionnaireResponseDetailComponent implements OnInit, OnDestroy {

    //HTML Variables
    pageTitle: string = 'Questionnaire Response Raw Json';

    //The questionnaire response to display
    fhirObject: QuestionnaireResponse;

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    pid: string
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private fhirService: FhirService,
        private _location: Location
    ) { }

    //This method runs when the page is loading
    ngOnInit(): void {

        //Get the questionnaire response and the patient IDs from the URL
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                let pid = params['pid'];
                this.id = id;
                this.pid = pid
            });

        //Get the questionnaire response
        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_questionnaireResponse)
            .subscribe(questionnaireResponse => this.fhirObject = questionnaireResponse,
            error => this.errorMessage = <any>error);
    }

    //This method runs when the user leaves the page
    ngOnDestroy() {

        this.sub.unsubscribe();
    }

    //This method controls the back button
    onBack(): void {

        this._router.navigate(['/questionnaires/' + this.pid])
    }

}
