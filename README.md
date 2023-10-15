<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## About project

This is a project to build an API system for managing tasks among team members, encompassing APIs for user registration, login authentication, and task creation. Users can create tasks and assign them to other members who can participate in those tasks with roles such as Owner, Editor, and Viewer. Each role will have different permissions for interacting with the tasks

## Techs, frameworks

- [Nodejs](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [Nestjs](https://docs.nestjs.com/)
- [Graphql](https://graphql.org/)
- [Mysql](https://hub.docker.com/_/mysql)

## Build from the source

### Prerequisites:

- [Install docker desktop](https://docs.docker.com/get-docker/)

### Steps to run from source:

1. Clone this repo
2. Open repo with terminal or cmd

3. Start environment with Docker Compose

```bash
npm run start-docker-dev
```

4. Migration database

```bash
docker exec -it training_phuongvt_nodejs-app-1 sh
```

```bash
npm run migration:up
```

5. Starts GraphQL server at: <http://localhost:3000/graphql>

## Feature and example

<details>
    <summary> Create new user</summary>
    <pre>mutation {createUser(userData: {
     userName: "userName",
     password: "password",
     name: "name",
     email:"email@gm.uit.edu"
   }) {
     data{
     userId
     name
     userName
     email
   }
  }
}</pre>
</details>

<details>
    <summary> Login</summary>
    <pre>mutation {
     login(userData: {
       userName: "userName",
       password: "password",
  }) {
    data{
      auth{
        accessToken
        refreshToken
      }
      user{
        userId
        userName
        name
        email
      }
    }
  }
}</pre>
</details>
<details>
    <summary> Refresh token</summary>
    <pre>{
  getAccessToken(
    refreshToken:"Refresh_token"
  ) {
   auth{
    accessToken
    refreshToken
  }
  }
}</pre>
</details>

<details>
    <summary> Create new task</summary>
    <pre>mutation {
  createTask(taskData:{
    title: "Sample Task 2"
    description: "This is a sample task"
    priority: High
    start: "2023-01-10" 
    end: "2023-02-20"   
  }) {
    data {
      taskId
      title
      priority
      status
    }
  }
}
</pre>
</details>

<details>
    <summary> Assign task</summary>
    <pre>mutation assignTask($AssignTaskInput:AssignTaskInput! ){
  assignTask(assignData: $AssignTaskInput) {
   data{
    task{
    taskId
    title
    description
    priority
    status
    start
    end
  }
    members{
      userId
      name
      roleCode
    }
  }
  }
}
</pre>
</details>

## Test

```bash
#1 Excute container
docker exec -it training_phuongvt_nodejs-app-1 sh
```

```bash
#1.1 e2e tests
$ npm run test
```

## Migration

```bash
#1 Excute container
docker exec -it training_phuongvt_nodejs-app-1 sh
```

```bash
#1.1 Generate a migration
MIGRATIONNAME=<migration name> npm run migration:generate
```

```bash
#1.2 Run migration
npm run migration:up
```

```bash
#1.3 Revert migration
npm run migration:down
```
