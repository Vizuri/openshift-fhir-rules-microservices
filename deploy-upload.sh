SERVICE_GIT_URL=https://github.com/Vizuri/openshift-fhir-rules-microservices.git
RULES_GIT_URL=https://github.com/Vizuri/openshift-fhir-rules-rules.git
PROJECT=fhir-development
#OCP_WILDCARD_DNS=192.168.99.100.nip.io
OCP_WILDCARD_DNS=apps.ocpdemo.kee.vizuri.com
#OCP_WILDCARD_DNS=54.84.189.66.xip.io

oc new-app --file=openshift/templates/springboot-pipeline.yaml -p APP_NAME=fhir-patient-upload-service -p GIT_SOURCE_URL=${SERVICE_GIT_URL} -p GIT_SOURCE_REF=master -p CONTEXT_DIR=fhir-patient-upload-service -e OCP_WILDCARD_DNS=${OCP_WILDCARD_DNS}

oc start-build fhir-patient-upload-service --follow=true


