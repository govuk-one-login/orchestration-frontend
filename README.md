# orchestration-frontend

## Requirements

You will need the AWS CLI. You can install it via:

```
brew install awscli
```

Deployment is done via AWS SAM.
You can install it via:

```
brew install aws-sam-cli --build-from-source
```

## Running the app

### Set the environment variables

Create a copy of the .env.sample file and rename it .env

### Running in Docker

You can run the app in Docker using:

```shell script
./startup.sh
```

### Running app locally:

#### Build

> To build the app

```shell script
npm install && npm run build
```

#### Start

> To start the app

```shell script
npm run build && npm run start
```

---

## Deploying to Sandpit

It is assumed that the account provisioning stack has already been run and that the persistent resources are present:

- ECR

Sandpit can be deployed using:

```shell script
./deploy-sandpit.sh
```

## Linting

### Scripts

> To run linting

```shell script
npm run lint
```

> To run prettier

```shell script
npm run pretty
```

> To setup pre-commit hook

```shell script
npm run prepare
```
