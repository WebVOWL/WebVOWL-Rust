# Package project into a WAR file using Maven
FROM maven:3.6.3-openjdk-8-slim AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY *.* /workspace/
COPY src /workspace/src
RUN mvn -B package --file pom.xml -DskipTests

# Use tomcat java 8 temurin as base image for building the final image
FROM tomcat:9-jre8-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /workspace/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

# Run default server
CMD ["catalina.sh", "run"]
