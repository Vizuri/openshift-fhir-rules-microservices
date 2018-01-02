#FROM registry.access.redhat.com/rhel7.4
FROM centos:7
MAINTAINER keudy@vizuri.com

#
# Docker base image for FHIR OpenShift Deployment
#

USER root

ENV APP_ROOT=/opt/app-root 

RUN yum-config-manager --enable centos:7 && \
     yum -y install java-1.8.0-openjdk-devel  \
     && yum clean all -y \
     && mkdir ${APP_ROOT} ${APP_ROOT}/bin

COPY jolokia.jar ${APP_ROOT}
COPY run ${APP_ROOT}/bin

ENV PATH=$PATH:${APP_ROOT}/bin

RUN chmod -R ug+xrw ${APP_ROOT} && chmod -R o-xrw ${APP_ROOT}

USER 1001
WORKDIR ${APP_ROOT}

ENV JAVA_OPTS=""
ENV APP_JAR="app.jar"
ENV SPRING_PROFILES_ACTIVE=openshift

CMD run $APP_JAR
