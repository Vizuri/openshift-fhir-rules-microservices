#!/bin/bash

jsonFile=$1

printf "Creating Integration API Script from $jsonFile\n\n"

curl -v -u admin:admin123 --header "Content-Type: application/json" 'http://nexus3-ci.192.168.61.115.xip.io/service/siesta/rest/v1/script/' -d @$jsonFile

