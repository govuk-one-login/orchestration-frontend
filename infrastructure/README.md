### Setup

Clone the repo https://github.com/alphagov/di-devplatform-deploy in a directory next to this repo.

### Required CLIs

To run this tool you will need the below CLI's

* aws cli for management of Cloudformation stacks
* jq for formatting and conversion

## How to use

Login into AWS with SSO on the browser. Choose an account, and select `Command line or programmatic access`. In your
terminal, run `aws configure sso` and enter the start URL and region from AWS on your browser. This will create a
profile that you can set as an environment variable, by running `export AWS_PROFILE=<profile>`.

After this you can then run the below, replacing `<environment>`with one
of `dev`, `build`:

```shell
./provision_all.sh <environment>
```

## Provisioning Dev

When provisioning the dev resources there are some that need to be done manually. This is due to the dev environment being in
the same account as other environments. As a temporary way to deploy provisioned resources the `provision_dev.sh` script should be run in addition to the `provision_all.sh` script. The `provision_dev.sh` script is needed to deploy a `dev` ECR as the stack needs to be uniquely named.

```shell
./provision_dev.sh
```

## How to update

To update the parameters used for our stacks, please update the parameters in
the `configuration/[ENVIRONMENT]/[PIPELINE]/parameters.json` files.
