#!/bin/bash

dir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
PARENT=$(dirname $dir)
source "$PARENT/.env"
source "$PARENT/colors.cfg"
filename=$(basename ${BASH_SOURCE})

echo -e "${CY}The ${YL}${COMPOSE_PROJECT_NAME} ${filename} ${CY}script has been executed"

docker-compose run --no-deps --rm -it -v ${PWD}/server:/usr/src/app -p 5000:5000 --env-file ./.env ${COMPOSE_PROJECT_NAME}.server:ubuntu bash "$@"
