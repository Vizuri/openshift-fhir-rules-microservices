/*
    This component is for the patient details (raw json) page
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

//Local Imports
import { FhirService } from '../FHIR/fhir.service';
import { Patient } from '../FHIR/Patient';
import { environment } from '../environments/environment';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-detail.component.html'
})
export class PatientDetailComponent implements OnInit, OnDestroy {

    //HTML Variables
    pageTitle: string = 'Patient Raw Json';

    //Patient to display
    patient: Patient;

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private fhirService: FhirService) { }

    //This method runs before the page is loaded
    ngOnInit(): void {

        //Get the patient ID
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        //Get the patient using the ID to search for the patient
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

}
