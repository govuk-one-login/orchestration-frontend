PROVISION_COMMAND="../../devplatform-deploy/stack-orchestration-tool/provisioner.sh"

export AUTO_APPLY_CHANGESET=true
export SKIP_AWS_AUTHENTICATION=true
export AWS_PAGER=""

## Provision dependencies

STACK_NAME="orch-container-image-repository"
STACK="container-image-repository"
if [[ -f configuration/dev/$STACK_NAME/parameters.json ]]; then
$PROVISION_COMMAND "dev" "$STACK_NAME" "$STACK" LATEST &
fi
