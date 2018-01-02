WORKDIR=`pwd`/../local/WORK

oc login -u system:admin

#oc set env dc/docker-registry -n default \
#    KUBERNETES_SERVICE_HOST=192.168.99.102 \
#    KUBERNETES_SERVICE_PORT=8443
#oc set env dc/router -n default \
#    KUBERNETES_SERVICE_HOST=192.168.99.102 \
#    KUBERNETES_SERVICE_PORT=8443

oc adm ca create-server-cert \
    --signer-cert=${WORKDIR}/config/master/ca.crt \
    --signer-key=${WORKDIR}/config/master/ca.key \
    --signer-serial=${WORKDIR}/config/master/ca.serial.txt \
    --hostnames='docker-registry.192.168.99.102.nip.io,docker-registry.default.svc.cluster.local,172.30.1.1,172.17.0.1' \
    --cert=${WORKDIR}/config/master/registry.crt \
    --key=${WORKDIR}/config/master/registry.key

oc secrets new registry-secret -n default \
    ${WORKDIR}/config/master/registry.crt \
    ${WORKDIR}/config/master/registry.key

oc secrets link registry -n default registry-secret
oc secrets link default -n default  registry-secret

oc volume dc/docker-registry -n default --add --type=secret \
    --secret-name=registry-secret -m /etc/secrets

oc set env dc/docker-registry -n default \
    REGISTRY_HTTP_TLS_CERTIFICATE=/etc/secrets/registry.crt \
    REGISTRY_HTTP_TLS_KEY=/etc/secrets/registry.key

oc patch dc/docker-registry -n default -p '{"spec": {"template": {"spec": {"containers":[{
    "name":"registry",
    "livenessProbe":  {"httpGet": {"scheme":"HTTPS"}}
  }]}}}}'

oc patch dc/docker-registry -n default -p '{"spec": {"template": {"spec": {"containers":[{
    "name":"registry",
    "readinessProbe":  {"httpGet": {"scheme":"HTTPS"}}
  }]}}}}'

oc create route -n default passthrough --service=docker-registry --hostname=docker-registry.192.168.99.102.nip.io

oc new-app -n default --file=registry-console-template.yaml \
    -p OPENSHIFT_OAUTH_PROVIDER_URL="https://192.168.99.102:8443" \
    -p REGISTRY_HOST=$(oc get route docker-registry -n default --template='{{ .spec.host }}') \
    -p COCKPIT_KUBE_URL='https://registry-console.192.168.99.102.nip.io'

oc create route passthrough --service registry-console -n default --hostname=registry-console.192.168.99.102.nip.io

oc policy add-role-to-user -n default admin developer
oc policy add-role-to-user -n logging admin developer
oc policy add-role-to-user -n openshift-infra admin developer

