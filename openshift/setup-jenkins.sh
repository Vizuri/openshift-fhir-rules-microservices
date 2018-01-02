oc secret new-sshauth --ssh-privatekey=fhir-bb bitbucket-secret
oc new-app -f templates/jenkins-template.yaml -p APP_NAME=fhir-jenkins -p GIT_SOURCE_URL=ssh://git@bitbucket.org/vizuri/fhir-jenkins-container.git -p GIT_SOURCE_REF=develop -p GIT_SOURCE_SECRET=bitbucket-secret

oc start-build -w fhir-jenkins
oc new-app --template jenkins-persistent --name=jenkins -p JENKINS_IMAGE_STREAM_TAG=fhir-jenkins:latest -p NAMESPACE=fhir-development
