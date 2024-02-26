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

### Set the analytics environment variables

Add environment variables to your .env file:

UNIVERSAL_ANALYTICS_GTM_CONTAINER_ID="GTM-XXXXXXX"
GOOGLE_ANALYTICS_4_GTM_CONTAINER_ID="GTM-XXXXXXX"
GA4_DISABLED="false"
UA_DISABLED="true"
ANALYTICS_COOKIE_DOMAIN="localhost"

### Running in Docker

You can run the app in Docker using:

```shell script
./startup.sh
```

### Running app locally:

_Please ensure you are using the correct node version locally (Found in Dockerfile)_

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

Ensure you are logged into an AWS account via SSO before deploying

Sandpit can be deployed using:

```shell script
./deploy-sandpit.sh
```

## Formatting & Linting

### Scripts:

> To check:

```shell script
npm run check; # Check all
npm run check:pretty; # Check prettier
npm run check:lint; # Check linting
```

> To fix formatting/linting:

```shell script
npm run fix; # Fix all
npm run fix:pretty; # Fix prettier
npm run fix:lint; # Fix linting
```

> To setup pre-commit hook

```shell script
npm run prepare
```

## GitHub Secrets:

Deployment relies on several secrets stored in GitHub:

| Secret                    | Description                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ARTIFACT_BUCKET_NAME      | This is the bucket that the SAM template will be pushed to.                                                                    |
| ECR_REGISTRY              | This is the address of the ECR registry.                                                                                       |
| GH_ACTIONS_ROLE_ARN       | This is the role GitHub actions assumes with permission to push to the artifact bucket (defined by the previsioning pipeline). |
| SAM_APP_VALIDATE_ROLE_ARN | This is the role GitHub actions assumes with permission to validate the SAM template (defined by the previsioning pipeline).   |
| SONAR_TOKEN               | This is used to trigger SonarCloud.                                                                                            |
