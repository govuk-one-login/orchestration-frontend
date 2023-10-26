set -eu
docker compose build

pushd "./stack-orchestration/sandpit/ecr"
parameters=$( cat ./parameters.json | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"' )

sam build
sam deploy --stack-name OrchECRRepository --template-file template.yaml --parameter-overrides $parameters
