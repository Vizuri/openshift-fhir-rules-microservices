/*
    This is a stripped down version of the FamilyMemberHistory object in FHIR
    (https://www.hl7.org/fhir/familymemberhistory.html)
*/

import { CodeableConcept } from './CodeableConcept';
import { Reference } from './Reference';
import { Quantity } from './Quantity';

export interface FamilyMemberHistory {

    resourceType: 'FamilyMemberHistory'
    id: string
    patient: Reference
    date: Date
    name: string
    relationship: CodeableConcept
    gender: string
    ageAge: Quantity
    condition: [{

        code: CodeableConcept
    }]
}