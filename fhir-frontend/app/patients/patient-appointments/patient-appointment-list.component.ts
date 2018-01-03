/*
    This component is for the appointments page
    NOTE: This component is not done and is very much a work in progress
*/

//Angular Imports
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//Local Imports
import { Slot } from '../../FHIR/Slot';
import { Schedule } from '../../FHIR/Schedule';
import { Patient } from '../../FHIR/Patient';
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-appointment-list.component.html',
    styleUrls: ['../../shared/shared.format.css']
})
export class AppointmentListComponent implements OnInit {

    pageTitle: string = 'Available Slots';
    listFilter: string;
    errorMessage: string;
    id: string

    slots: Slot[];
    schedules: Schedule[];
    patient: Patient

    sub: Subscription

    gotPatient: boolean = false

    constructor(private route: ActivatedRoute, private fhirService: FhirService) { }

    //This method runs before the page is loaded
    ngOnInit(): void {

        //Get the Patient ID
        this.sub = this.route.params.subscribe(
            params => {
                let id = params['id'];
                this.id = id;
            });

        //Get the patient
        this.fhirService.getOneFhirObject('/' + this.id, environment.apiUrl_patient)
            .subscribe(patient => {

                this.patient = patient

                this.gotPatient = true;

            },
            error => this.errorMessage = <any>error);

        //Get all Slots
        this.fhirService.getFhirObjects(environment.apiUrl_slot)
            .subscribe(slots => this.slots = slots,
            error => this.errorMessage = <any>error);

        //Get all Schedules
        this.fhirService.getFhirObjects(environment.apiUrl_schedule)
            .subscribe(schedules => this.schedules = schedules,
            error => this.errorMessage = <any>error);
    }

    //This method books an appointment for a patient
    //  id: The Patient ID
    //  slotId: the Slot ID
    bookAppointment(id: string, slotId: string): void {

        console.log('Patient ID: ' + id)
        console.log('Slot ID: ' + slotId)

        window.location.reload();
    }
}