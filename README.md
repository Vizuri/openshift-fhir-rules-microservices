# Business Rules in a Microservice Architecture

## Overview

This project provides the Microservice code in support of the Webinar "Business Rules in a Microservice Architecture".  

You can view the Webinar at http://bit.ly/2F1BhVF.

The source code for the the Business Rules can be located at https://github.com/Vizuri/openshift-fhir-rules-rules.

The code implements a Medical Use Case providing Risk Assesments for Patients.  Standard HL7 FHIR interfaces are utilized.  The HAPI FHIR (http://hapifhir.io/) implementation of the FHIR standard is utilized to provide Java classes to support FHIR. 

Please contact us at https://www.vizuri.com/company/contact-us if you have any questions about this code or would like future information on OpenShift or BRMS.

This project is Open Source, licensed under the Apache Software License 2.0.
<BR>Copyright 2018 Vizuri, a business division of AEM Corporation

## Architecture

The code in this project utilizes the RedHat OpenShift Container Platform and the RedHat BRMS Rules Platform to demonstrate how to leverage the benefits of a Rules Management platform in a Microservice Architecture.

### Setup

The code in this example can be deployed on any OpenShift Environment.  A minimal of 4 Cores and 8GB or RAM must be available to 
OpenShift Platform.

Clone the code in this repository and run the deploy-openshift.sh script.  This will create a project in your OpenShift evironment 
and deploy all the Microservices Necessary to deploy the code.  This may take up to 20 minutes to complete.

Once all the services are deployed, you can run the User Interface with the following URL:

http://fhir-frontend-fhir-development.<OCP_WILDCARD_DNS> 
