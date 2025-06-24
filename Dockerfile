#Create MySQL Image for JSP Tutorial Application
FROM mysql:latest
COPY ./sqlfiles/migrate-v001.sql /docker-entrypoint-initdb.d
EXPOSE 3306
