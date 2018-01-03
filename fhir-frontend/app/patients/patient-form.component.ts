/*
    This component is for the Add New Patient page
*/

//Angular Imports
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';

//FHIR Imports
import { Patient } from '../FHIR/Patient';
import { FhirService } from '../FHIR/fhir.service'

//Local Imports
import { PatientShared } from './patient-shared';
import { environment } from '../environments/environment';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-form.component.html'
})
export class PatientForm implements OnInit {

    //Form Objects
    patientForm: FormGroup;

    //Error Handling
    errorMessageArray: string[] = []
    errorMessage: string;

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

    //HTML Variables
    pageTitle: string = 'Add New Patient';
    pageDescription: string = 'Please fill out all information below:';
    saveButtonText: string = 'Submit';

    constructor(protected fb: FormBuilder,
        protected route: ActivatedRoute,
        protected router: Router,
        protected patientShared: PatientShared,
        protected http: Http,
        private fhirService: FhirService) {

    }

    //This method runs when the page is initialized
    ngOnInit(): void {

        //Set the default values and validators
        this.patientForm = this.fb.group({

            firstName: ['', [Validators.required, Validators.maxLength(30)]],
            middleName: ['', [Validators.required, Validators.maxLength(30)]],
            lastName: ['', [Validators.required, Validators.maxLength(30)]],
            gender: ['', Validators.required],
            dateOfBirth: ['', [Validators.required]]

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
    }

    //This method controls what the back button does
    onBack(): void {

        this.router.navigate(['/patients']);
    }

    //This method converts and posts the form data to the Spring Boot service
    save(): void {

        //Disable the form to prevent duplicate posts
        this.patientForm.disable()

        let uniqueId: string;

        //Generate a unique ID
        this.http.get(this.patientUrl).toPromise().then(response => {

            let idArray: string[] = []
            let patientJsonArray: JSON[]

            //Store the patients in an array
            patientJsonArray = response.json()

            //Store each patient ID in an array
            //ID is inside the Identifier object of the Patient object
            for (var i = 0; i < patientJsonArray.length; i++) {

                idArray.push(JSON.stringify(Object.values(patientJsonArray[i])[1]));
                console.log('ID Checker: ' + JSON.stringify(Object.values(patientJsonArray[i])[1]));
            }

            //Find a unique ID
            let uniqueIdCheck = false;
            while (uniqueIdCheck == false) {

                //Generate an ID
                uniqueId = (Math.floor(Math.random() * 100000000)).toString();
                uniqueIdCheck = true;

                //Check if the ID is already in use
                for (var i = 0; i < idArray.length; i++) {

                    if (uniqueId == idArray[i]) {

                        uniqueIdCheck = false;
                        break;
                    }
                }
            }

            //Create the Date object
            let birthDate: Date = this.patientForm.get('dateOfBirth').value

            //Create the patient JSON
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

            //Post the patient
            this.fhirService.postFhirObject(JSON.stringify(patient), environment.apiUrl_patient)
                .subscribe(res => {

                    //Done
                    this.patientForm.reset();
                    this.router.navigate(['/patients/']);
                },
                error => this.errorMessage = <any>error);

        }).catch(err => {

            console.log(err);
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