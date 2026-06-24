FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN groupadd -r apar && useradd -r -g apar apar
COPY --from=build /app/target/apar-simple-1.0.0.jar app.jar
RUN chown -R apar:apar /app
USER apar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
