/*
    This is a stripped down version of the Patient object in FHIR
    (https://www.hl7.org/fhir/patient.html)
*/

import { HumanName } from './HumanName';

export interface Patient {

    resourceType: 'Patient',
    id: string,
    name: [HumanName],
    gender: string,
    birthDate: Date
}