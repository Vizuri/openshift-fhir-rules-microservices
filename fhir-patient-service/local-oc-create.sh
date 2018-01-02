SERVICE_NAME=patient-service

oc login -u developer -p developer
oc project fhir-development
oc new-app --template=springboot --param=APP_NAME=${SERVICE_NAME} --param=IMAGE_NAME=${SERVICE_NAME} --param=IMAGE_TAG=latest
oc env --from=secret/fhirdb --prefix=MONGO_ dc/${SERVICE_NAME}
oc set env dc/${SERVICE_NAME}  \
   MONGO_DATABASE_HOST=fhirdb \
   MONGO_DATABASE_PORT=27017
