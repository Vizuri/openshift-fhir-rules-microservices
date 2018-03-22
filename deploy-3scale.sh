DOMAIN=54.157.217.95.xip.io

DB_SERVICES="backend-redis system-memcache system-mysql system-redis zync-database"
BACKEND_SERVICES="backend-listener backend-worker"
SYSTEM_APP_SERVICE="system-app"
REST_OF_SERVICES="system-resque backend-cron system-sphinx system-sidekiq apicast-staging apicast-production apicast-wildcard-router zync"

checkStatus() {
  echo in checkStatus of dc:  $1;
  STATUS=`oc get dc $1 | tail -n +2 | awk '{print $4}'`
  N=0
  until [ $STATUS -gt 0 ]
  do
     N=$[$N+1]
     echo "Waiting for $1 to start $N. Retrying ..."
     if [ $N -ge 20 ] ; then
        echo "$1 is not started, Check your OpenShift Configuration"
        break;
     fi
     sleep 10s;
     STATUS=`oc get dc $1 | tail -n +2 | awk '{print $4}'`
  done
}

resumeServices() {
  for x in $@
  do 
    echo Resuming dc:  $x;
    sleep 2; 
    oc rollout resume dc/$x; 
  done
  
  
  for x in $@
  do 
    echo Checking Status of dc:  $x;
    checkStatus $x
  done
}

oc new-project 3scale-amp --display-name="3scale-amp" --description="3scale AMP component"
oc new-app -f openshift/templates/3scale-amp-2.1.yml --param ADMIN_PASSWORD=admin --param TENANT_NAME=3scale --param WILDCARD_DOMAIN=${DOMAIN}

resumeServices $DB_SERVICES
resumeServices $BACKEND_SERVICES
resumeServices $SYSTEM_APP_SERVICE
resumeServices $REST_OF_SERVICES
