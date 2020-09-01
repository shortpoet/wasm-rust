#!/bin/bash

set -Eeu
set -o pipefail
shopt -s execfail

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# shellcheck source=$dir/registry.env
. $dir/registry.env
# shellcheck source=$dir/colors.cfg
. $dir/colors.cfg
# shellcheck source=$dir/log.sh
. $dir/log.sh

filename=$(basename "${BASH_SOURCE[0]}")
filename=$(echo "$filename" | awk -F\. '{print $1}')
logfile="$dir/logs/$filename-${TARGET:?'Set this in env file'}"
# this is argument to indicate which image to use
service_env_file=$1
# shellcheck source=$1
. $service_env_file

image=$(echo "$SOURCE" | grep -oP '.*?(?=\:)')
# uncomment to make fail due to double ':'
# image=$source

# if no verstion tag will default to ':latest'
version=$TAG
# shellcheck disable=SC2154
target=$GCR_FULL/$PROJECT_ID/$image:$version

if [ -f "$logfile" ]; then
  cp "$logfile" "$logfile.bak"
fi

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
# exec 2>&1>"$# logfile"
#  ^-- SC2069: To redirect stdout+stderr, 2>&1 must be last (or use '{ cmd > file; } 2>&1' to clarify).
exec 1>"$logfile" 2>&1

echo "=================================================================================" >&3
log "${CY}The ${YL}${COMPOSE_PROJECT_NAME} ${filename} ${CY}script has been executed${NC}"

# apply tag
log "${GR}Apply tag to image $SOURCE with version $version${NC}"

# https://stackoverflow.com/questions/41716616/get-exit-codes-of-a-pipe-when-output-is-assigned-to-variable-command-substituti/44314883#44314883
# save retval of pipe
TEST="$( docker tag "$SOURCE" "$target" 2>&1; printf :%s "${PIPESTATUS[*]}" )"
declare -a PIPESTATUS2=( "${TEST##*:}" )  # make array w/ content after final colon
#                        ^-- SC2206: Quote to prevent word splitting/globbing, or split robustly with mapfile or read -a.
if [[ -n "${TEST%:*}" ]]; then          # if there was original output
  TEST="${TEST%:*}"                     # remove trailing results from $TEST
  TEST="${TEST%$'\n'}"                  # remove trailing \n like plain $(…)
else
  TEST=""                               # no original output -> empty string
fi

# exit if fail
log "$TEST"
if [ "${PIPESTATUS2[*]}" -eq 1 ]; then
  exit;
fi

log "${PP}Push $target to gcr ${GCR_FULL}${NC}"

TEST="$( docker push "$target" 2>&1; printf :%s "${PIPESTATUS[*]}" )"
declare -a PIPESTATUS2=( "${TEST##*:}" )  # make array w/ content after final colon
if [[ -n "${TEST%:*}" ]]; then          # if there was original output
  TEST="${TEST%:*}"                     # remove trailing results from $TEST
  TEST="${TEST%$'\n'}"                  # remove trailing \n like plain $(…)
else
  TEST=""                               # no original output -> empty string
fi

log "$TEST"
if [ "${PIPESTATUS2[*]}" -eq 1 ]; then
  exit;
fi

log "${PP}Remove $target from local docker${NC}"

TEST="$( docker rmi "$target" 2>&1; printf :%s "${PIPESTATUS[*]}" )"
declare -a PIPESTATUS2=( "${TEST##*:}" )  # make array w/ content after final colon
if [[ -n "${TEST%:*}" ]]; then          # if there was original output
  TEST="${TEST%:*}"                     # remove trailing results from $TEST
  TEST="${TEST%$'\n'}"                  # remove trailing \n like plain $(…)
else
  TEST=""                               # no original output -> empty string
fi

log "$TEST"
if [ "${PIPESTATUS2[*]}" -eq 1 ]; then
  exit;
fi

exit



