/*
    This is a stripped down version of the HumanName object in FHIR
    (https://www.hl7.org/fhir/datatypes.html#HumanName)
*/

export interface HumanName {

    text: string,
    family: string,
    given: string[]
}