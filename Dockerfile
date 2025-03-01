FROM postgres:latest

COPY PQC.sql /docker-entrypoint-initdb.d/
