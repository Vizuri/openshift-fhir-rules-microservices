oc new-project demo-fhir-dev

oc create secret generic quay-registry \
    --from-file=.dockerconfigjson=quay-config.json \
    --type=kubernetes.io/dockerconfigjson

oc secrets link default quay-registry --for=pull
oc new-app --template=mongodb-persistent --param=DATABASE_SERVICE_NAME=fhirdb --param=MONGODB_USER=fhir --param=MONGODB_PASSWORD=fhir --param=MONGODB_DATABASE=fhir

oc new-project demo-fhir-test

oc create secret generic quay-registry \
    --from-file=.dockerconfigjson=quay-config.json \
    --type=kubernetes.io/dockerconfigjson

oc secrets link default quay-registry --for=pull
oc new-app --template=mongodb-persistent --param=DATABASE_SERVICE_NAME=fhirdb --param=MONGODB_USER=fhir --param=MONGODB_PASSWORD=fhir --param=MONGODB_DATABASE=fhir

oc new-project demo-fhir-prod

oc create secret generic quay-registry \
    --from-file=.dockerconfigjson=quay-config.json \
    --type=kubernetes.io/dockerconfigjson

oc secrets link default quay-registry --for=pull
oc new-app --template=mongodb-persistent --param=DATABASE_SERVICE_NAME=fhirdb --param=MONGODB_USER=fhir --param=MONGODB_PASSWORD=fhir --param=MONGODB_DATABASE=fhir

