REPO_NAME="sandpit-orch-frontend-image-repository"
REPO_URL="761723964695.dkr.ecr.eu-west-2.amazonaws.com/sandpit-orch-frontend-image-repository"
IMAGE_TAG=latest

set -eu
parameters=$( cat ./infrastructure/sandpit/parameters.json | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"' )

echo "Generating temporary ECR credentials..."
aws ecr get-login-password | docker login --username AWS --password-stdin "${REPO_URL}"

echo "Building image..."
docker build --platform=linux/amd64 -t "${REPO_NAME}" .
echo "Tagging image..."
docker tag "${REPO_NAME}:latest" "${REPO_URL}:${IMAGE_TAG}"
echo "Pushing image..."
docker push "${REPO_URL}:${IMAGE_TAG}"

pushd "./infrastructure/sandpit/ecs"
if grep -q "CONTAINER-IMAGE-PLACEHOLDER" template.yaml; then
    echo "Replacing \"CONTAINER-IMAGE-PLACEHOLDER\" with ECR image ref"
    cp template.yaml template_tmp.yaml
    sed -i '' "s|CONTAINER-IMAGE-PLACEHOLDER|$REPO_URL:$IMAGE_TAG|" template_tmp.yaml
else
    echo "ERROR: Image placeholder text \"CONTAINER-IMAGE-PLACEHOLDER\" not found"
    exit 1
fi
echo ${parameters}
echo "Deploying ECS"
sam build
sam deploy --stack-name sandpit-orch-frontend --template-file template_tmp.yaml --parameter-overrides $parameters --no-fail-on-empty-changeset --capabilities CAPABILITY_NAMED_IAM
echo "Updating service"
aws ecs update-service --cluster sandpit-orch-app-cluster --service sandpit-orch-frontend-ecs-service --force-new-deployment --no-cli-pager
rm template_tmp.yaml
popd