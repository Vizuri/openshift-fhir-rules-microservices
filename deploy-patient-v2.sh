SERVICE_GIT_URL=https://github.com/Vizuri/openshift-fhir-rules-microservices.git
RULES_GIT_URL=https://github.com/Vizuri/openshift-fhir-rules-rules.git
PROJECT=fhir-development
#OCP_WILDCARD_DNS=192.168.99.100.nip.io
OCP_WILDCARD_DNS=apps.ocpdemo.kee.vizuri.com
#OCP_WILDCARD_DNS=54.84.189.66.xip.io

oc new-app --file=openshift/templates/springboot-pipeline.yaml -p APP_NAME=fhir-patient-service-v2 -p GIT_SOURCE_URL=${SERVICE_GIT_URL} -p GIT_SOURCE_REF=master -p CONTEXT_DIR=fhir-patient-service

oc start-build fhir-patient-service-v2 --follow=true


