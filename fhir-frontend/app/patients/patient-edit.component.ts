/*
    This component is for the edit patient page
*/

//Angular Imports
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//FHIR Imports
import { Patient } from '../FHIR/Patient';

//Local Imports
import { PatientShared } from './patient-shared'
import { FhirService } from '../FHIR/fhir.service'
import { environment } from '../environments/environment';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-form.component.html'
})
export class EditPatient implements OnInit {

    //Form Objects
    patientForm: FormGroup;

    //Error Handling
    errorMessageArray: string[] = []
    errorMessage: string

    //HTML fields that can have validation errors
    //This array has to match what is in the HTML
    validationFields: string[] = [

        'firstName',                //0
        'middleName',               //1
        'lastName',                 //2
        'dateOfBirth',              //3
    ];

    //Array of AbstractControl objects for validation
    controlArray: AbstractControl[] = [];

    //URL
    private patientUrl = environment.apiUrl_patient;

    //ID Variables
    patientId: string
    sub: Subscription

    //HTML Variables
    pageTitle: string = 'Edit Patient';
    pageDescription: string = 'Editing Patient Information';
    saveButtonText: string = 'Save';

    constructor(protected fhirService: FhirService,
        protected fb: FormBuilder,
        protected route: ActivatedRoute,
        protected router: Router,
        protected patientShared: PatientShared) {

    }

    //This method runs when the page is initialized
    ngOnInit(): void {

        //Populate with default values so the HTML page can load
        this.patientForm = this.fb.group({

            firstName: '',
            middleName: '',
            lastName: '',
            gender: '',
            dateOfBirth: ''

        });

        //Get the patient ID
        this.sub = this.route.params.subscribe(
            params => {
                let id = params['id'];
                this.patientId = id;
            });

        //Get the patient to edit
        this.fhirService.getOneFhirObject('/' + this.patientId, environment.apiUrl_patient)
            .subscribe(patient => {

                //Populate the form with the current values and set the validators
                this.patientForm = this.fb.group({

                    firstName: [patient.name[0].given[0], [Validators.required, Validators.maxLength(30)]],
                    middleName: [patient.name[0].given[1], [Validators.required, Validators.maxLength(30)]],
                    lastName: [patient.name[0].family, [Validators.required, Validators.maxLength(30)]],
                    gender: [patient.gender, Validators.required],
                    dateOfBirth: [patient.birthDate, [Validators.required]]

                });

                //Generate the Error Message Array
                for (var i = 0; i < this.validationFields.length; i++) {

                    this.errorMessageArray.push('');
                }

                //Generate the AbstractControl Array and subscribe to them
                for (var i = 0; i < this.validationFields.length; i++) {

                    this.controlArray.push(this.patientForm.get(this.validationFields[i]));
                    this.controlArray[i].valueChanges.subscribe(value => this.setErrorMessages());
                }

            },
            error => this.errorMessage = <any>error);
    }

    //This method controls what the back button does
    onBack(): void {

        this.patientForm.reset();
        this.router.navigate(['/patients']);
    }

    //This method converts and posts the form data to the Spring Boot service
    save(): void {

        //Disable the form to prevent duplicate posts
        this.patientForm.disable()

        //Grab the ID
        let uniqueId: string;
        uniqueId = this.patientId

        //Convert some data
        let birthDate: Date = this.patientForm.get('dateOfBirth').value

        //Create the JSON
        let patient: Patient = {

            resourceType: 'Patient',
            id: uniqueId,

            name: [{
                text: this.patientForm.get('firstName').value + ' ' + this.patientForm.get('middleName').value + ' ' + this.patientForm.get('lastName').value,
                family: this.patientForm.get('lastName').value,
                given: [this.patientForm.get('firstName').value, this.patientForm.get('middleName').value, this.patientForm.get('lastName').value]
            }],

            gender: this.patientForm.get('gender').value,
            birthDate: birthDate
        }

        //POST new patient to the database
        this.fhirService.updateFhirObject('/' + this.patientId, JSON.stringify(patient), environment.apiUrl_patient).subscribe((res) => {

            //Done
            this.patientForm.reset();
            this.router.navigate(['/patients']);
        })
    }

    //This method sets the form error messages as needed
    setErrorMessages(): void {

        for (var i = 0; i < this.errorMessageArray.length; i++) {

            if ((this.controlArray[i].touched || this.controlArray[i].dirty) && this.controlArray[i].errors) {

                this.errorMessageArray[i] = Object.keys(this.controlArray[i].errors).map(key => this.patientShared.validationMessages[key]).join(' ');

            } else {

                this.errorMessageArray[i] = '';
            }
        }
    }
}