### Setup

Clone the repo https://github.com/alphagov/di-devplatform-deploy in a directory next to this repo.

Copy each of the configuration/<env>/vpc/parameters.json.templates files to parameters.json 

### Required CLIs

To run this tool you will need the below CLI's

* aws cli for management of Cloudformation stacks
* jq for formatting and conversion
* aws sso for authentication