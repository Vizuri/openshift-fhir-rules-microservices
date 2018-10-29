# https://github.com/Vizuri/openshift-fhir-rules-microservices.git
# oc adm policy add-scc-to-user privileged -z jenkins
#oc adm policy add-scc-to-user privileged system:serviceaccount:cicd:jenkins

oc new-project cicd

oc create sa cicd
oc adm policy add-cluster-role-to-user admin -z cicd

oc new-app -f openshift/templates/jenkins-persistent.yaml --name=jenkins -p MEMORY_LIMIT=1Gi -p VOLUME_CAPACITY=1Gi

##oc new-app -f openshift/templates/jenkins-persistent.yaml --name=jenkins -p MEMORY_LIMIT=1Gi -p VOLUME_CAPACITY=1Gi

##oc new-app --template jenkins-persistent --name=jenkins -p MEMORY_LIMIT=1Gi -p VOLUME_CAPACITY=1Gi

oc new-app -f openshift/templates/nexus3-template.yaml  --param=NEXUS_VERSION=3.12.1 --param=MAX_MEMORY=50Gi

#oc delete dc,svc,route,pvc sonarqube
#oc delete dc,svc,route,pvc,secret sonardb

oc new-app --template postgresql-persistent --name=sonardb -p DATABASE_SERVICE_NAME=sonardb -p POSTGRESQL_USER=sonar -p POSTGRESQL_PASSWORD=sonar -p POSTGRESQL_DATABASE=sonar

oc new-app -f openshift/templates/sonarqube-template.yaml -p SONARQUBE_JDBC_USERNAME=sonar -p SONARQUBE_JDBC_PASSWORD=sonar -p SONARQUBE_JDBC_URL=jdbc:postgresql://sonardb/sonar

