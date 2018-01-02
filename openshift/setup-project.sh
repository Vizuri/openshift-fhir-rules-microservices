#oc create -f templates/docker-container-pipeline.yaml
#oc create -f templates/maven-pipeline.yaml
#oc create -f templates/springboot-pipeline.yaml
#oc create -f templates/decisionserver64-basic-s2i.json
#oc create -f templates/nodejs-pipeline.yaml
####### oc create -f https://raw.githubusercontent.com/jboss-openshift/application-templates/master/jboss-image-streams.json

###### oc new-project fhir-development
#oc secret new-sshauth --ssh-privatekey=fhir-bb bitbucket-secret

oc new-app --template=mongodb-persistent --param=DATABASE_SERVICE_NAME=fhirdb --param=MONGODB_USER=fhir --param=MONGODB_DATABASE=fhir

#oc new-app -f templates/jenkins-template.yaml -p APP_NAME=fhir-jenkins -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-jenkins-container.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc start-build -w fhir-jenkins
#oc new-app --template jenkins-persistent --name=jenkins -p JENKINS_IMAGE_STREAM_TAG=fhir-jenkins:latest -p NAMESPACE=fhir-development

##### oc new-app --docker-image=sonatype/nexus3 --name=nexus

#oc secrets new-dockercfg rh-registry --docker-server=registry.connect.redhat.com --docker-username=keudy@vizuri.com --docker-password=M@dison30 --docker-email=keudy@vizuri.com

#oc secrets new-dockercfg rh-registry-sso --docker-server=sso.redhat.com --docker-username=keudy@vizuri.com --docker-password=M@dison30 --docker-email=keudy@vizuri.com


#oc secrets link default rh-registry --for=pull
#oc secrets link builder rh-registry --for=pull
#oc secrets link default rh-registry-sso --for=pull
#oc secrets link builder rh-registry-sso --for=pull

#oc new-app -f templates/nexus-template.yaml
#oc new-app -f templates/nexus3-persistent-template.yaml -p VOLUME_CAPACITY=25Gi

oc new-app  --file=templates/maven-pipeline.yaml -p APP_NAME=fhir-parent -p GIT_SOURCE_URL=https://github.com/Vizuri/openshift-fhir-rules-microservices.git -p GIT_SOURCE_REF=master -p CONTEXT_DIR=fhir-parent

oc new-app --file=templates/maven-pipeline.yaml -p APP_NAME=fhir-base -p GIT_SOURCE_URL=https://github.com/Vizuri/openshift-fhir-rules-microservices.git -p GIT_SOURCE_REF=master -p CONTEXT_DIR=fhir-base

#oc new-app --template=docker-container-pipeline -p APP_NAME=fhir-base-container -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-base-container.git -p GIT_SOURCE_REF=master -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-patient-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-patient-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-observation-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-observation-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-riskassessment-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-riskassessment-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-questionnaire-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-questionnaire-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-questionnaireresponse-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-questionnaireresponse-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-familymemberhistory-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-familymemberhistory-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-slot-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-slot-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app --template=springboot-pipeline -p APP_NAME=fhir-schedule-service -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-schedule-service.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

#oc new-app -f templates/decisionserver64-pipeline.yaml -p KIE_CONTAINER_DEPLOYMENT='fhir-framinghamRules=com.vizuri.fhir:fhir-framinghamRules:1.0-SNAPSHOT' -p KIE_SERVER_USER=kieserver -p KIE_SERVER_PASSWORD=kieserver1!  -p APPLICATION_NAME=framingham -p SOURCE_REPOSITORY_URL=git@bitbucket.org:vizuri/fhir-rules.git -p SOURCE_REPOSITORY_REF=master -p SOURCE_REPOSITORY_SECRET=bitbucket-secret -p CONTEXT_DIR=fhir-framinghamRules -e CONTAINER_HEAP_PERCENT=.70

#oc new-app -f templates/decisionserver64-pipeline.yaml -p KIE_CONTAINER_DEPLOYMENT='fhir-heartdisease-rules=com.vizuri.fhir:fhir-heartdisease-rules:1.0-SNAPSHOT' -p KIE_SERVER_USER=kieserver -p KIE_SERVER_PASSWORD=kieserver1!  -p APPLICATION_NAME=heart-rules -p SOURCE_REPOSITORY_URL=git@bitbucket.org:vizuri/fhir-rules.git -p SOURCE_REPOSITORY_REF=master -p SOURCE_REPOSITORY_SECRET=bitbucket-secret -p CONTEXT_DIR=fhir-heartdisease -e CONTAINER_HEAP_PERCENT=.70

#oc new-app -f templates/decisionserver64-pipeline.yaml -p KIE_CONTAINER_DEPLOYMENT='fhir-diabetes=com.vizuri.fhir:fhir-diabetes:1.0-SNAPSHOT' -p KIE_SERVER_USER=kieserver -p KIE_SERVER_PASSWORD=kieserver1!  -p APPLICATION_NAME=diabetes-rules -p SOURCE_REPOSITORY_URL=git@bitbucket.org:vizuri/fhir-rules.git -p SOURCE_REPOSITORY_REF=master -p SOURCE_REPOSITORY_SECRET=bitbucket-secret -p CONTEXT_DIR=fhir-diabetes -e CONTAINER_HEAP_PERCENT=.70

#oc new-app -f templates/decisionserver64-pipeline.yaml -p KIE_CONTAINER_DEPLOYMENT='fhir-schedule-rules=com.vizuri.fhir:fhir-schedule-rules:1.0-SNAPSHOT' -p KIE_SERVER_USER=kieserver -p KIE_SERVER_PASSWORD=kieserver1!  -p APPLICATION_NAME=schedule-rules -p SOURCE_REPOSITORY_URL=git@bitbucket.org:vizuri/fhir-rules.git -p SOURCE_REPOSITORY_REF=master -p SOURCE_REPOSITORY_SECRET=bitbucket-secret -p CONTEXT_DIR=fhir-schudule-rules -e CONTAINER_HEAP_PERCENT=.70

#oc new-app -f templates/nodejs-pipeline.yaml -p APP_NAME=fhir-frontend -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-frontEnd.git -p GIT_SOURCE_REF=developer -p GIT_SOURCE_SECRET=bitbucket-secret

oc start-build -w fhir-parent
oc start-build -w fhir-base
#oc start-build -w fhir-base-container
#oc start-build -w fhir-patient-service
#oc start-build -w fhir-observation-service
#oc start-build -w fhir-riskassessment-service
#oc start-build -w fhir-questionnaire-service
#oc start-build -w fhir-questionnaireresponse-service
#oc start-build -w fhir-familymemberhistory-service
#oc start-build -w fhir-slot-service
#oc start-build -w fhir-schedule-service
#oc start-build -w framingham
#oc start-build -w heart-rules
#oc start-build -w diabetes-rules
#oc start-build -w schedule-rules
#oc start-build -w fhir-frontend
