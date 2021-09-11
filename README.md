# [Exercise Tracker](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker)

This was put together for the Back End Development and APIs course on [FCC](https://www.freecodecamp.org/learn/back-end-development-and-apis/). The aim was to create a web application for exercise tracking.

View at:

[![run on replit](https://replit.com/badge/github/@Mormonorman/FCC-Exercise-Tracker)](https://replit.com/@Mormonorman/FCC-Exercise-Tracker?v=1)

## Built With
 * NodeJS
 * Express
 * MongoDB
 * Mongoose ODM
 * Docker

## Local testing with docker
As the project reads and writes to a database, I have extended the project by adding docker/containers, so testing can be done locally.

1. Clone

> git clone https://github.com/normanrichardson/FCC-Exercise-Tracker.git

> cd FCC-Exercise-Tracker

2. Execute docker-compose

> docker-compose up

> Go to localhost:3000