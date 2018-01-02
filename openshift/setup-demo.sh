oc login https://console.odds.variq-dynamo.vizuri.com:8443 -u keudy -p P@55w0rd
oc create -f https://raw.githubusercontent.com/jboss-openshift/application-templates/master/jboss-image-streams.json -n openshift
oc create -f templates/processserver64-postgresql-persistent-s2i.json -n openshift

oc new-project bpms-development
oc secret new-sshauth --ssh-privatekey=fhir-bb bitbucket-secret
oc create serviceaccount processserver-service-account 
oc policy add-role-to-user view system:serviceaccount:bpms-development:processserver-service-account 

oc create secret generic processserver-app-secret --from-file=server.keystore

oc secret add sa/processserver-service-account secret/processserver-app-secret
