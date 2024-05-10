AWS_ACCOUNT=${1}

PROVISION_COMMAND="../../devplatform-deploy/stack-orchestration-tool/provisioner.sh"

export AUTO_APPLY_CHANGESET=true
export SKIP_AWS_AUTHENTICATION=true
export AWS_PAGER=""

## Provision dependencies
for dir in configuration/"$AWS_ACCOUNT"/*/; do
  STACK=$(basename "$dir")
  if [[ $STACK != "$AWS_ACCOUNT-orch-fe-pipeline" && $STACK != "orch-container-image-repository" &&  -f configuration/$AWS_ACCOUNT/$STACK/parameters.json ]]; then
    $PROVISION_COMMAND "$AWS_ACCOUNT" "$STACK" "$STACK" LATEST &
  fi
done

## Provision secure pipelines
$PROVISION_COMMAND "$AWS_ACCOUNT" "$AWS_ACCOUNT"-orch-fe-pipeline sam-deploy-pipeline LATEST