/*
    This component is for the list of a patient's records
*/

//Angular Imports
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//FHIR Imports
import { Patient } from '../../FHIR/Patient';
import { Observation } from '../../FHIR/Observation';
import { FamilyMemberHistory } from '../../FHIR/FamilyMemberHistory';

//Local Imports
import { PatientShared } from '../patient-shared'
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-record-form.component.html'

})
export class PatientRecordForm implements OnInit {

    //Form Objects
    patientRecordForm: FormGroup;

    //Error Message Array
    errorMessageArray: string[] = []

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
        'name',                         //7
        'age',                          //8
        'heightFeet',                   //9
        'heightInches',                 //10
        'weight'                        //11
    ];

    //Array of AbstractControl objects for validation
    controlArray: AbstractControl[] = [];

    //ID Handling
    patientId: string

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private patientShared: PatientShared,
        private fhirService: FhirService) {


    }

    //This method runs when the page is initialized
    ngOnInit(): void {

        //Get the patient ID from the URL
        let sub: Subscription
        sub = this.route.params.subscribe(
            params => {
                let id = params['id'];
                this.patientId = id;
            });

        //Set the default values
        this.patientRecordForm = this.fb.group({

            recordType: ['', Validators.required],

            //Observation
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

            //Family Member History
            name: '',
            relationship: '',
            gender: '',
            age: '',
            heartAttack: false,
            angina: false,
            diabetes: false

        })

        //Generate the Error Message Array
        for (var i = 0; i < this.validationFields.length; i++) {

            this.errorMessageArray.push('');
        }

        //Generate the AbstractControl Array and subscribe to them
        for (var i = 0; i < this.validationFields.length; i++) {

            this.controlArray.push(this.patientRecordForm.get(this.validationFields[i]));
            this.controlArray[i].valueChanges.subscribe(value => this.setErrorMessages());
        }

        //This watches the record type box to chnage the form based on what the user wants
        //i.e. Observation, Family Member History, etc.
        this.patientRecordForm.get('recordType').valueChanges.subscribe(value => this.setRecordTypeValidators(value));
    }

    //This method controls what the back button does
    onBack(): void {

        this.router.navigate(['/records/' + this.patientId]);
    }

    //This method converts and posts the form data to the Spring Boot service
    save(): void {

        //Disable the form to prevent duplicate posts
        this.patientRecordForm.disable()

        //Observation
        if (this.patientRecordForm.get('recordType').value == 'observation') {

            //Calculate height in inches
            let heightInInches: number = (this.patientRecordForm.get('heightFeet').value * 12) + this.patientRecordForm.get('heightInches').value

            //Calulate BMI
            let bmi: number = (this.patientRecordForm.get('weight').value * 0.45) / ((heightInInches * 0.025) ^ 2)

            //Create the Observation JSON
            let observation: Observation = {

                resourceType: 'Observation',
                id: 'Observation_' + this.patientId,
                subject: { reference: this.patientId },
                issued: this.patientShared.getTimestamp(),
                component: [

                    { code: { coding: { code: '8480-6' }, text: 'Systolic Blood Pressure' }, valueQuantity: { value: this.patientRecordForm.get('systolicBloodPressure').value }, unit: 'mmHg' },
                    { code: { coding: { code: '8462-4' }, text: 'Diastolic Blood Pressure' }, valueQuantity: { value: this.patientRecordForm.get('diastolicBloodPressure').value }, unit: 'mmHg' },
                    { code: { coding: { code: '2093-3' }, text: 'Total Cholesterol' }, valueQuantity: { value: this.patientRecordForm.get('totalCholesterol').value }, unit: 'mddL' },
                    { code: { coding: { code: '2085-9' }, text: 'HDL Cholesterol' }, valueQuantity: { value: this.patientRecordForm.get('hdlCholesterol').value }, unit: 'mddL' },
                    { code: { coding: { code: '13457-7' }, text: 'LDL Cholesterol' }, valueQuantity: { value: this.patientRecordForm.get('ldlCholesterol').value }, unit: 'mddL' },
                    { code: { coding: { code: '2571-8' }, text: 'Triglycerides' }, valueQuantity: { value: this.patientRecordForm.get('triglycerides').value }, unit: 'mddL' },
                    { code: { coding: { code: '56086-2' }, text: 'Waist Circumference' }, valueQuantity: { value: this.patientRecordForm.get('waistCircumference').value }, unit: 'in' },
                    { code: { coding: { code: '39156-5' }, text: 'BMI' }, valueQuantity: { value: bmi }, unit: 'kg/m2' },
                    { code: { coding: { code: '3141-9' }, text: 'Height in Inches' }, valueQuantity: { value: heightInInches }, unit: 'in' },
                    { code: { coding: { code: '8302-9' }, text: 'Weight in Pounds' }, valueQuantity: { value: this.patientRecordForm.get('weight').value }, unit: 'lbs' },
                ]
            }

            //Post the Observation JSON
            this.fhirService.postFhirObject(JSON.stringify(observation), environment.apiUrl_observation).subscribe(observation => {

                this.patientRecordForm.reset();
                this.router.navigate(['/records/' + this.patientId]);
            })

            //Family Member History
        } else if (this.patientRecordForm.get('recordType').value == 'familyMemberHistory') {

            //Create the JSON
            let familyMemberHistory: FamilyMemberHistory = {

                resourceType: 'FamilyMemberHistory',
                id: ('FamilyMemberHistory_' + this.patientRecordForm.get('name').value + '_' + this.patientId).replace(' ', '_'),
                patient: { reference: this.patientId },
                date: this.patientShared.getTimestamp(),
                name: this.patientRecordForm.get('name').value,
                relationship: { coding: { code: '' }, text: this.patientRecordForm.get('relationship').value },
                gender: this.patientRecordForm.get('gender').value,
                ageAge: { value: this.patientRecordForm.get('age').value },
                condition: [

                    { code: { coding: { code: this.patientRecordForm.get('heartAttack').value }, text: 'Heart Attack' } },
                    { code: { coding: { code: this.patientRecordForm.get('angina').value }, text: 'Angina' } },
                    { code: { coding: { code: this.patientRecordForm.get('diabetes').value }, text: 'Diabetes' } }
                ]

            }

            //Post the JSON
            this.fhirService.postFhirObject(JSON.stringify(familyMemberHistory), environment.apiUrl_familyMemberHistory).subscribe(familyMemberHistory => {

                this.patientRecordForm.reset();
                this.router.navigate(['/records/' + this.patientId]);
            })
        }

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

    //This method clears all validators from the form
    clearValidators(): void {

        for (var i = 0; i < this.validationFields.length; i++) {

            const control = this.patientRecordForm.get(this.validationFields[i]).setValidators([]);
        }
    }

    //This method updates the validators in the form
    updateValidators(): void {

        for (var i = 0; i < this.validationFields.length; i++) {

            const control = this.patientRecordForm.get(this.validationFields[i]).updateValueAndValidity();
        }
    }

    //This method sets the validators of the medical record the user wanted
    //  notifyVia: The record type the user selected
    setRecordTypeValidators(notifyVia: string): void {

        this.clearValidators();

        if (notifyVia == 'observation') {

            this.patientRecordForm.get('totalCholesterol').setValidators([Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('hdlCholesterol').setValidators([Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('ldlCholesterol').setValidators([Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('systolicBloodPressure').setValidators([Validators.required, this.patientShared.numberRange(0, 250)]);
            this.patientRecordForm.get('diastolicBloodPressure').setValidators([Validators.required, this.patientShared.numberRange(0, 250)]);
            this.patientRecordForm.get('triglycerides').setValidators([Validators.required, this.patientShared.numberRange(0, 1000)]);
            this.patientRecordForm.get('waistCircumference').setValidators([Validators.required, this.patientShared.numberRange(0, 150)]);
            this.patientRecordForm.get('heightFeet').setValidators([Validators.required, this.patientShared.numberRange(1, 9)]);
            this.patientRecordForm.get('heightInches').setValidators([Validators.required, this.patientShared.numberRange(1, 11)]);
            this.patientRecordForm.get('weight').setValidators([Validators.required, this.patientShared.numberRange(4, 1500)]);

        } else if (notifyVia == 'familyMemberHistory') {

            this.patientRecordForm.get('name').setValidators([Validators.required, Validators.maxLength(30)]);
            this.patientRecordForm.get('relationship').setValidators([Validators.required]);
            this.patientRecordForm.get('gender').setValidators([Validators.required]);
            this.patientRecordForm.get('age').setValidators([Validators.required, this.patientShared.numberRange(0, 130)]);
        }

        this.updateValidators();
    }
}