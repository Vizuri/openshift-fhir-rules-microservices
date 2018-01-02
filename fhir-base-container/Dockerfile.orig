FROM centos:7
MAINTAINER keudy@vizuri.com

#
# Docker base image for FHIR OpenShift Deployment
#

USER root

ADD jolokia.jar /home/jboss/jolokia.jar
ADD run.sh /home/jboss/run.sh

RUN groupadd -g 1000 jboss \
     && useradd -g 1000 -u 1000 jboss \
     && yum -y upgrade \
     && INSTALL_PKGS="java-1.8.0-openjdk-devel"  \
     && yum install -y --enablerepo=centosplus $INSTALL_PKGS \
     && rpm -V $INSTALL_PKGS \
     && yum clean all -y

USER jboss
WORKDIR /home/jboss

ENV JAVA_OPTS=""
ENV APP_JAR="app.jar"
ENV SPRING_PROFILES_ACTIVE=openshift

CMD /home/jboss/run.sh /home/jboss/$APP_JAR
