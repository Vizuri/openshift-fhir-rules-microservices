/*
    This component is for the Family Member History details page
*/

//Angular Imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

//JavaScript Importd
import { Subscription } from 'rxjs/Subscription';

//Local Imports
import { FamilyMemberHistory } from '../../FHIR/FamilyMemberHistory';
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';

@Component({
    moduleId: module.id,
    templateUrl: '../../FHIR/fhir-details.html'
})
export class FamilyMemberHistoryDetailComponent implements OnInit, OnDestroy {

    //HTML Variables
    pageTitle: string = 'Family Member History Raw Json';

    //Family Member History object to display
    fhirObject: FamilyMemberHistory;

    //Error Handling
    errorMessage: string;

    //ID Handling
    id: string;
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private fhirService: FhirService,
        private _location: Location
    ) { }

    //This method runs before the page is loaded
    ngOnInit(): void {

        //Get the ID
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        //Get the FamilyMemberHistory
        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_familyMemberHistory)
            .subscribe(familyMemberHistory => this.fhirObject = familyMemberHistory,
            error => this.errorMessage = <any>error);
    }

    //This method runs when the user leaves the page
    ngOnDestroy() {

        this.sub.unsubscribe();
    }


    //This controls what the back button does
    onBack(): void {

        this._router.navigate(['/records/' + this.id.substring(this.id.length - 8, this.id.length)]);
    }

}
