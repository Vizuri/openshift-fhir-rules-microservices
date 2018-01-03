/*
    This component is for viewing the raw RiskAssessment object
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

//Local Imports
import { RiskAssessment } from '../../FHIR/RiskAssessment';
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';


@Component({
    moduleId: module.id,
    templateUrl: '../../FHIR/fhir-details.html'
})
export class RiskAssessmentDetailComponent implements OnInit, OnDestroy {

    //HTML Variables
    pageTitle: string = 'Risk Assessment';

    //Risk Assessment to display
    fhirObject: RiskAssessment[];

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: String;
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private fhirService: FhirService,
        private _location: Location
    ) { }

    //This method runs before the page is loaded
    ngOnInit(): void {

        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_riskAssessment)
            .subscribe(riskAssessment => this.fhirObject = riskAssessment,
            error => this.errorMessage = <any>error);
    }

    //This method runs when the user leaves the page
    ngOnDestroy() {

        this.sub.unsubscribe();
    }

    //This method controls the back button
    onBack(): void {

        this._router.navigate(['/riskassessment/' + this.id.substring(0, 8)])
    }

}
