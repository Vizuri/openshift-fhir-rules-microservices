/*
    This component is for the Observation details page
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

//Local Imports
import { Observation } from '../../FHIR/Observation';
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';


@Component({
    moduleId: module.id,
    templateUrl: '../../FHIR/fhir-details.html'
})
export class ObservationDetailComponent implements OnInit, OnDestroy {

    //HTML Variables
    pageTitle: string = 'Observation Raw Json';

    //Observation object to display
    fhirObject: Observation;

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    sub: Subscription;

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
        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_observation)
            .subscribe(observation => this.fhirObject = observation,
            error => this.errorMessage = <any>error);
    }

    //This method runs when the user leaves the page
    ngOnDestroy() {

        this.sub.unsubscribe();
    }

    //This method controls the back button
    onBack(): void {

        this._router.navigate(['/records/' + this.id.substring(12, this.id.length)]);
    }

}
