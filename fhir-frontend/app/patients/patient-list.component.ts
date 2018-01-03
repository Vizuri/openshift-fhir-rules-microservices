/*
    This component is for the page that displays the list of all the patients
*/

//Angular Imports
import { Component, OnInit } from '@angular/core';

//FHIR Imports
import { Patient } from '../FHIR/Patient';
import { FhirService } from '../FHIR/fhir.service'

//Local Imports
import { environment } from '../environments/environment';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-list.component.html',
    styleUrls: ['../shared/shared.format.css']
})
export class PatientListComponent implements OnInit {

    //HTML Variables
    patientFilter: string;
    errorMessage: string;
    patients: Patient[];

    constructor(private fhirService: FhirService) { }

    //This method controls what happens before the page is loaded
    ngOnInit(): void {

        //Get the list of patients
        this.fhirService.getFhirObjects(environment.apiUrl_patient)
            .subscribe(patients => this.patients = patients,
            error => this.errorMessage = <any>error);
    }

    //This method is called when the delete button is pressed
    //  id: The ID of the patient to be deleted
    delete(id: string): void {

        //Delete the patient
        this.fhirService.deleteOneFhirObject('/' + id, environment.apiUrl_patient).subscribe((res) => {

            //Reload when done deleting
            this.fhirService.getFhirObjects(environment.apiUrl_patient)
                .subscribe(patients => this.patients = patients,
                error => this.errorMessage = <any>error);
        })
    }
}