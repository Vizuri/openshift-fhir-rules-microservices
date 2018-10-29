PROJECT=fhir-development

oc new-project $PROJECT

oc new-app --template=mongodb-persistent --param=DATABASE_SERVICE_NAME=fhirdb --param=MONGODB_USER=fhir --param=MONGODB_DATABASE=fhir

