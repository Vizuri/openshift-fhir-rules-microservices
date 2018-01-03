/*
    This is a stripped down version of the Observation object in FHIR
    (https://www.hl7.org/fhir/observation.html)
*/

import { CodeableConcept } from './CodeableConcept';
import { Quantity } from './Quantity'
import { Reference } from './Reference'

export interface Observation {

    resourceType: 'Observation',
    id: string,
    subject: Reference,
    issued: Date,
    component: [{

        code: CodeableConcept,
        valueQuantity: Quantity,
        unit: string
    }]
}