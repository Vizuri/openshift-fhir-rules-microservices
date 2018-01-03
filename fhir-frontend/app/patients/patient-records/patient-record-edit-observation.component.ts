/*
    This component is for editing a patient's Observation record
*/

//Angular Imports
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//FHIR Imports
import { Observation } from '../../FHIR/Observation';

//Local Imports
import { PatientShared } from './../patient-shared'
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-record-edit-observation.component.html'
})
export class EditObservation implements OnInit {

    //Form Objects
    observationEditForm: FormGroup;

    //Error Handling
    errorMessageArray: string[] = []
    errorMessage: string

    //HTML fields that can have validation errors
    //This array has to match what is in the HTML
    validationFields: string[] = [

        'systolicBloodPressure',        //0
        'diastolicBloodPressure',       //1
        'totalCholesterol',             //2
        'hdlCholesterol',               //3
        'ldlCholesterol',               //4
        'triglycerides',                //5
        'waistCircumference',           //6
        'heightFeet',                   //7
        'heightInches',                 //8
        'weight'                        //9
    ];

    //Array of AbstractControl objects for validation
    controlArray: AbstractControl[] = [];

    //ID Handling
    patientId: string
    patientIdSub: Subscription

    //Observation object to edit
    observation: Observation

    constructor(private fhirService: FhirService, protected fb: FormBuilder, public route: ActivatedRoute, protected router: Router, protected patientShared: PatientShared) {

    }

    //This method runs when the page is initialized
    ngOnInit(): void {

        //Set the default values so the page can load
        this.observationEditForm = this.fb.group({

            totalCholesterol: null,
            hdlCholesterol: null,
            ldlCholesterol: null,
            systolicBloodPressure: null,
            diastolicBloodPressure: null,
            triglycerides: null,
            waistCircumference: null,
            heightFeet: null,
            heightInches: null,
            weight: null,

        });

        //Get the patient ID
        this.patientIdSub = this.route.params.subscribe(
            params => {
                let id = params['id'];
                this.patientId = id;
            });

        //Get the Observation to edit
        this.fhirService.getFhirObjectParam('subject', this.patientId, environment.apiUrl_observation)
            .subscribe(observation => {

                //Populate the form with the current values and set the validators
                this.observationEditForm = this.fb.group({

                    totalCholesterol: [observation[0].component[2].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 1000)]],
                    hdlCholesterol: [observation[0].component[3].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 1000)]],
                    ldlCholesterol: [observation[0].component[4].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 1000)]],
                    systolicBloodPressure: [observation[0].component[0].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 250)]],
                    diastolicBloodPressure: [observation[0].component[1].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 250)]],
                    triglycerides: [observation[0].component[5].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 1000)]],
                    waistCircumference: [observation[0].component[6].valueQuantity.value, [Validators.required, this.patientShared.numberRange(0, 150)]],
                    heightFeet: [Math.floor(observation[0].component[8].valueQuantity.value / 12), [Validators.required, this.patientShared.numberRange(1, 9)]],
                    heightInches: [observation[0].component[8].valueQuantity.value - (Math.floor(observation[0].component[8].valueQuantity.value / 12) * 12), [Validators.required, this.patientShared.numberRange(1, 11)]],
                    weight: [observation[0].component[9].valueQuantity.value, [Validators.required, this.patientShared.numberRange(4, 1500)]]

                });

                //Generate the Error Message Array
                for (var i = 0; i < this.validationFields.length; i++) {

                    this.errorMessageArray.push('');
                }

                //Generate the AbstractControl Array and subscribe to them
                for (var i = 0; i < this.validationFields.length; i++) {

                    this.controlArray.push(this.observationEditForm.get(this.validationFields[i]));
                    this.controlArray[i].valueChanges.subscribe(value => this.setErrorMessages());
                }

            },
            error => this.errorMessage = <any>error);
    }

    //This method controls what the back button does
    onBack(): void {

        this.observationEditForm.reset();
        this.router.navigate(['/records/' + this.patientId]);
    }

    //This method converts and posts the form data to the Spring Boot service
    save(): void {

        //Disable the form to prevent duplicate posts
        this.observationEditForm.disable();

        //Grab the ID
        let uniqueId: string;
        uniqueId = this.patientId

        //Calculate height in inches
        let heightInInches: number = (this.observationEditForm.get('heightFeet').value * 12) + this.observationEditForm.get('heightInches').value

        //Calulate BMI
        let bmi: number = (this.observationEditForm.get('weight').value * 0.45) / ((heightInInches * 0.025) ^ 2)

        //Create the JSON
        let observation: Observation = {

            resourceType: 'Observation',
            id: 'Observation_' + this.patientId,
            subject: { reference: this.patientId },
            issued: this.patientShared.getTimestamp(),
            component: [

                { code: { coding: { code: '8480-6' }, text: 'Systolic Blood Pressure' }, valueQuantity: { value: this.observationEditForm.get('systolicBloodPressure').value }, unit: 'mmHg' },
                { code: { coding: { code: '8462-4' }, text: 'Diastolic Blood Pressure' }, valueQuantity: { value: this.observationEditForm.get('diastolicBloodPressure').value }, unit: 'mmHg' },
                { code: { coding: { code: '2093-3' }, text: 'Total Cholesterol' }, valueQuantity: { value: this.observationEditForm.get('totalCholesterol').value }, unit: 'mddL' },
                { code: { coding: { code: '2085-9' }, text: 'HDL Cholesterol' }, valueQuantity: { value: this.observationEditForm.get('hdlCholesterol').value }, unit: 'mddL' },
                { code: { coding: { code: '13457-7' }, text: 'LDL Cholesterol' }, valueQuantity: { value: this.observationEditForm.get('ldlCholesterol').value }, unit: 'mddL' },
                { code: { coding: { code: '2571-8' }, text: 'Triglycerides' }, valueQuantity: { value: this.observationEditForm.get('triglycerides').value }, unit: 'mddL' },
                { code: { coding: { code: '56086-2' }, text: 'Waist Circumference' }, valueQuantity: { value: this.observationEditForm.get('waistCircumference').value }, unit: 'in' },
                { code: { coding: { code: '39156-5' }, text: 'BMI' }, valueQuantity: { value: bmi }, unit: 'kg/m2' },
                { code: { coding: { code: '3141-9' }, text: 'Height in Inches' }, valueQuantity: { value: heightInInches }, unit: 'in' },
                { code: { coding: { code: '8302-9' }, text: 'Weight in Pounds' }, valueQuantity: { value: this.observationEditForm.get('weight').value }, unit: 'lbs' },
            ]
        }

        //Update the observation
        this.fhirService.updateFhirObject('/Observation_' + this.patientId, JSON.stringify(observation), environment.apiUrl_observation)
            .subscribe(observation => {

                this.observationEditForm.reset();
                this.router.navigate(['/records/' + this.patientId]);
            }
            )
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