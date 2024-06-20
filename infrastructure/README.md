## Setup

Clone the repo https://github.com/alphagov/di-devplatform-deploy in a directory next to this repo.

Install required CLIs:

* `aws-cli` for management of CloudFormation stacks
* `jq` for formatting and conversion

## How to use

Login into AWS with SSO on the browser. Choose an account, and select _Access Keys_. 

Run `aws configure sso` and enter the start URL and region from AWS on your browser. 

Set the resulting profile as an environment variable, by running `export AWS_PROFILE=<profile>`.

Run `./provision_all.sh <environment>`, replacing `<environment>` with `dev` or `build`.



## Provisioning dev ECR

The dev ECR resource needs to be provisioned separately, because the dev environment is in the same account as other environments, which causes naming conflicts.

To provision the dev ECR, run `./provision_dev.sh` (after running `./provision_all.sh dev`). This is temporary workaround until dev exists in its own AWS account.

## Updating stack parameters

Stack parameters can be updated in /_configuration/\<environment>/\<pipeline>/parameters.json_.
