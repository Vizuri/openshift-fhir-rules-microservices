IMAGE_NAME=docker-registry.192.168.99.102.xip.io/fhir-development/patient-service:latest

mvn clean package

oc login -u developer -p developer
docker login -p `oc whoami -t` -e unused -u unused docker-registry.192.168.99.102.xip.io

docker build -t ${IMAGE_NAME} .
docker push ${IMAGE_NAME}
