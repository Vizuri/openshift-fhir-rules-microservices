#!/bin/bash

name=$1

printf "Running Integration API Script $name\n\n"

curl -v -X POST -u admin:admin123 --header "Content-Type: text/plain" "http://nexus3-ci.192.168.61.115.xip.io/service/siesta/rest/v1/script/$1/run"
