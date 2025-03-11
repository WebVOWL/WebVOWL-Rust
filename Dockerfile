# Package project into a WAR file using Maven
FROM maven:3.6.3-openjdk-8 AS build
RUN apt-get update && apt-get install bzip2 -y
RUN mkdir -p /workspace
WORKDIR /workspace
COPY *.* /workspace/
COPY src /workspace/src
RUN mvn -B package --file pom.xml -DskipTests

# Build the final image
FROM tomcat:9-jre8-temurin
ADD bin/OWL2VOWL-*.jar /usr/local/lib/
ADD docker.sh /usr/local/entrypoint.sh
RUN apt-get update \
    && apt-get install inotify-tools -y \
    && ln -s /usr/local/lib/OWL2VOWL-*.jar /usr/local/lib/OWL2VOWL.jar 
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /workspace/target/*.war /usr/local/tomcat/webapps/ROOT.war

LABEL org.opencontainers.image.description="A faster WebVOWL"
VOLUME "/data"
EXPOSE 8080

ENTRYPOINT ["entrypoint.sh"]
