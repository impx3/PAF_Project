**Skill-Sharing & Learning Platform**

Designing and implementing a full-stack Skill-Sharing & Learning Platform that enables users to share and track their learning progress across various skills.

Backend implementation involves developing a RESTful API using Spring Boot, ensuring scalability, security, and adherence to REST principles and implementing OAuth 2.0 authentication for secure login

Frontend implementation involves building a React web application with an intuitive UI/UX, enabling users to create posts, update learning progress, and interact through likes and comments

🔹 Key Features:

✔ Skill-sharing posts with multimedia support
✔ Structured learning plans with progress tracking
✔ Social engagement (likes, comments, following users)
✔ Real-time notifications for interactions
✔ Secure authentication with OAuth 2.0


# Installation

## Backend

- Create an `application.properties` file inside `backend/src/main/resources/`

- Add this content to that `application.properties`

``` properties

spring.application.name=backend

# DB Configurations
spring.datasource.url=jdbc:mysql://localhost:3306/<<YOUR-DB-NAME>>?useSSL=false&serverTimezone=UTC
spring.datasource.username=<<YOUR-DB-USERNAME>>
spring.datasource.password=<<YOUR-DB-PASSWORD>>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- Rename the `<<YOUR-DB-USERNAME>>` , `<<YOUR-DB-USERNAME>>` ,` <<YOUR-DB-PASSWORD>>` with your actual database configurations.

- Now you are good to go!