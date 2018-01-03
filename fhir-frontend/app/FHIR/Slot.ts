/*
    This is a stripped down version of the Slot object in FHIR
    (https://www.hl7.org/fhir/slot.html)
*/

import { Reference } from './Reference'

export interface Slot {

    resourceType: "Slot"
    id: string
    schedule: Reference
    status: string
    start: Date
    end: Date
    comment: string
}