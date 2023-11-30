#!/bin/bash

REPO_NAME="sandpit-orch-frontend-image-repository"
REPO_URL="761723964695.dkr.ecr.eu-west-2.amazonaws.com/sandpit-orch-frontend-image-repository"
IMAGE_TAG=latest

set -eu

generate_ecr_credentials() {
    echo "Generating temporary ECR credentials..."
    aws ecr get-login-password | docker login --username AWS --password-stdin "${REPO_URL}"
}

build_and_tag_docker_image() {
    echo "Building Docker image..."
    docker build --platform=linux/amd64 -t "${REPO_NAME}" .
    echo "Tagging image..."
    docker tag "${REPO_NAME}:latest" "${REPO_URL}:${IMAGE_TAG}"
}

update_ecs_template() {
    pushd "./infrastructure/sandpit/ecs"
    if grep -q "CONTAINER-IMAGE-PLACEHOLDER" template.yaml; then
        echo "Replacing \"CONTAINER-IMAGE-PLACEHOLDER\" with ECR image ref..."
        cp template.yaml template_tmp.yaml
        sed -i '' "s|CONTAINER-IMAGE-PLACEHOLDER|$REPO_URL:$IMAGE_TAG|" template_tmp.yaml
    else
        echo "ERROR: Image placeholder text \"CONTAINER-IMAGE-PLACEHOLDER\" not found"
        exit 1
    fi
    popd
}

deploy_to_ecs() {
    pushd "./infrastructure/sandpit/ecs"
    parameters=$(cat ../parameters.json | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"')
    echo ${parameters}
    echo "Deploying to ECS..."
    sam build
    sam deploy --stack-name sandpit-orch-frontend --template-file template_tmp.yaml --parameter-overrides $parameters --no-fail-on-empty-changeset --capabilities CAPABILITY_NAMED_IAM
    rm template_tmp.yaml
    popd
}

update_ecs_service() {
    echo "Updating service..."
    aws ecs update-service --cluster sandpit-orch-app-cluster --service sandpit-orch-frontend-ecs-service --force-new-deployment --no-cli-pager
}

generate_ecr_credentials
build_and_tag_docker_image
update_ecs_template
deploy_to_ecs
update_ecs_service
