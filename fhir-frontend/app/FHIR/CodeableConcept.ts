/*
    This is a stripped down version of the CodeableConcept object in FHIR
    (https://www.hl7.org/fhir/datatypes.html#CodeableConcept)
*/

import { Coding } from './Coding'

export class CodeableConcept {

    coding: Coding
    text: string
}