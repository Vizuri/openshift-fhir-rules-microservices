/*
    This lists the default OpenShift URLs. These values are only used when the 
  UI is running outside of OpenShift and can't get the OpenShift IP address.
  e.x. locahost:3000
*/

//Get the URL suffix
var urlSuffix = window.location.host.indexOf('localhost') !== -1 ? '.192.168.99.100.nip.io' : window.location.host.match(/(\..+?)$/)[1];

//A list of the service URLs
export const environment = {

    apiUrl_patient: 'http://fhir-patient-service-fhir-development' + urlSuffix + '/patient',
    apiUrl_observation: 'http://fhir-observation-service-fhir-development' + urlSuffix + '/observation',
    apiUrl_questionnaire: 'http://fhir-questionnaire-service-fhir-development' + urlSuffix + '/questionnaire',
    apiUrl_questionnaireResponse: 'http://fhir-questionnaireresponse-service-fhir-development' + urlSuffix + '/questionnaireResponse',
    apiUrl_riskAssessment: 'http://fhir-riskassessment-service-fhir-development' + urlSuffix + '/riskAssessment',
    apiUrl_familyMemberHistory: 'http://fhir-familymemberhistory-service-fhir-development' + urlSuffix + '/familymemberhistory',
    apiUrl_schedule: 'http://fhir-schedule-service-fhir-development' + urlSuffix + '/schedule',
    apiUrl_slot: 'http://fhir-slot-service-fhir-development' + urlSuffix + '/slot'
};