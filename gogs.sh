oc new-project gogs
oc new-app -f http://bit.ly/openshift-gogs-persistent-template --param=HOSTNAME=gogs.apps.aws-ocp-02.kee.vizuri.com
