/*
    This is a stripped down version of the Questionnaire object in FHIR
    (https://www.hl7.org/fhir/questionnaire.html)
*/

export interface Questionnaire {

    resourceType: 'Questionnaire',
    id: string,
    item: [{

        text: string
        linkId: string
        type: string
        item: [{
            valueString: string
        }]
    }]
}  