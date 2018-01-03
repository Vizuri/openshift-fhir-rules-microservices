/*
    This component is for editing Family Member History records
*/

//Angular Imports
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//FHIR Imports
import { FamilyMemberHistory } from '../../FHIR/FamilyMemberHistory';

//Local Imports
import { PatientShared } from './../patient-shared'
import { FhirService } from '../../FHIR/fhir.service'
import { environment } from '../../environments/environment';

//JavaScript Imports
import { Subscription } from 'rxjs/Subscription';

@Component({

    moduleId: module.id,
    templateUrl: 'patient-record-edit-familyMemberHistory.component.html'
})
export class EditFamilyMemberHistory implements OnInit {

    //Form Objects
    familyMemberHistoryEditForm: FormGroup;

    //Error Handling
    errorMessageArray: string[] = []
    errorMessage: string

    //HTML fields that can have validation errors
    //This array has to match what is in the HTML
    validationFields: string[] = [

        'name',                         //0
        'age'                           //1
    ];

    //Array of AbstractControl objects for validation
    controlArray: AbstractControl[] = [];

    //ID Handling
    patientId: string
    familyMemberHistoryId: string
    patientIdSub: Subscription
    historyIdSub: Subscription

    //The name of the family member when the form is loaded. This is
    //  so we can change the ID if needed
    originalName: string

    constructor(private fhirService: FhirService, protected fb: FormBuilder, public route: ActivatedRoute, protected router: Router, protected patientShared: PatientShared) {

    }

    //This method runs when the page is initialized
    ngOnInit(): void {

        //Set the default values so the page can load
        this.familyMemberHistoryEditForm = this.fb.group({

            name: '',
            relationship: '',
            gender: '',
            age: '',
            heartAttack: false,
            angina: false,
            diabetes: false

        });

        //Get the patient ID
        this.patientIdSub = this.route.params.subscribe(
            params => {
                let id = params['id'];
                this.patientId = id;
            });

        //Get the Family Member History ID
        this.historyIdSub = this.route.params.subscribe(
            params => {
                let id = params['hid'];
                this.familyMemberHistoryId = id;
            });

        //Get the Family Member History object to edit
        this.fhirService.getOneFhirObject('/' + this.familyMemberHistoryId, environment.apiUrl_familyMemberHistory)
            .subscribe(familyMemberHistory => {

                //Get the original name in case of name change
                this.originalName = familyMemberHistory.name

                //Populate the form with the current values and set the validators
                let heartAttackBool: boolean = this.patientShared.stringToBool(familyMemberHistory.condition[0].code.coding[0].code)
                let anginaBool: boolean = this.patientShared.stringToBool(familyMemberHistory.condition[1].code.coding[0].code)
                let diabetesBool: boolean = this.patientShared.stringToBool(familyMemberHistory.condition[2].code.coding[0].code)

                this.familyMemberHistoryEditForm = this.fb.group({

                    name: [familyMemberHistory.name, [Validators.required, Validators.maxLength(30)]],
                    relationship: [familyMemberHistory.relationship.text, [Validators.required]],
                    gender: [familyMemberHistory.gender, [Validators.required]],
                    age: [familyMemberHistory.ageAge.value, [Validators.required, this.patientShared.numberRange(0, 130)]],
                    heartAttack: [heartAttackBool],
                    angina: [anginaBool],
                    diabetes: [diabetesBool]

                });

                //Generate the Error Message Array
                for (var i = 0; i < this.validationFields.length; i++) {

                    this.errorMessageArray.push('');
                }

                //Generate the AbstractControl Array and subscribe to them
                for (var i = 0; i < this.validationFields.length; i++) {

                    this.controlArray.push(this.familyMemberHistoryEditForm.get(this.validationFields[i]));
                    this.controlArray[i].valueChanges.subscribe(value => this.setErrorMessages());
                }

            },
            error => this.errorMessage = <any>error);
    }

    //This method controls what the back button does
    onBack(): void {

        this.familyMemberHistoryEditForm.reset();
        this.router.navigate(['/records/' + this.patientId]);
    }

    //This method converts and posts the form data to the Spring Boot service
    save(): void {

        //Disable the form to prevent duplicate posts
        this.familyMemberHistoryEditForm.disable();

        //Grab the ID
        let uniqueId: string;
        uniqueId = this.patientId

        //Create the JSON
        let familyMemberHistory: FamilyMemberHistory = {

            resourceType: 'FamilyMemberHistory',
            id: ('FamilyMemberHistory_' + this.familyMemberHistoryEditForm.get('name').value + '_' + this.patientId).replace(' ', '_'),
            patient: { reference: this.patientId },
            date: this.patientShared.getTimestamp(),
            name: this.familyMemberHistoryEditForm.get('name').value,
            relationship: { coding: { code: '' }, text: this.familyMemberHistoryEditForm.get('relationship').value },
            gender: this.familyMemberHistoryEditForm.get('gender').value,
            ageAge: { value: this.familyMemberHistoryEditForm.get('age').value },
            condition: [

                { code: { coding: { code: this.familyMemberHistoryEditForm.get('heartAttack').value }, text: 'Heart Attack' } },
                { code: { coding: { code: this.familyMemberHistoryEditForm.get('angina').value }, text: 'Angina' } },
                { code: { coding: { code: this.familyMemberHistoryEditForm.get('diabetes').value }, text: 'Diabetes' } }
            ]

        }

        //Check for name change to see if we need to change the ID
        if (this.originalName != this.familyMemberHistoryEditForm.get('name').value) {

            //Delete record with old ID
            this.fhirService.deleteOneFhirObject(('/FamilyMemberHistory_' + this.originalName + '_' + this.patientId).replace(' ', '_'), environment.apiUrl_familyMemberHistory)
                .subscribe((res) => {

                    //Post a new record with the new ID
                    this.fhirService.postFhirObject(JSON.stringify(familyMemberHistory), environment.apiUrl_familyMemberHistory).subscribe(familyMemberHistory => {

                        this.familyMemberHistoryEditForm.reset();
                        this.router.navigate(['/records/' + this.patientId]);
                    })
                })

        } else {

            //Update family member history
            this.fhirService.updateFhirObject(('/FamilyMemberHistory_'
                + this.familyMemberHistoryEditForm.get('name').value
                + '_'
                + this.patientId).replace(' ', '_'), JSON.stringify(familyMemberHistory), environment.apiUrl_familyMemberHistory).subscribe(familyMemberHistory => {

                    this.familyMemberHistoryEditForm.reset();
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
}