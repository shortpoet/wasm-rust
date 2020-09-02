# set shell options
set -Eeu
set -o pipefail
shopt -s execfail

# az=`where az.cmd`

# $dir for imports
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# config / env
registry_env_file=$dir/registry.env
# shellcheck source=$dir/registry.env
. $registry_env_file
# shellcheck source=$dir/colors.cfg
. $dir/colors.cfg
# shellcheck source=$dir/log.sh
. $dir/log.sh

# local vars
filename=$(basename ${BASH_SOURCE[0]})
filename=`echo $filename | awk -F\. '{print $1}'`
log=$dir/logs/$filename-$TARGET

service_env_file=$1
# shellcheck source=$1
. "$service_env_file"
# set redirection

exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>$log 2>&1

# header
echo "=================================================================================" >&3
log "${CY}The ${YL}${COMPOSE_PROJECT_NAME} ${filename} ${CY}script has been executed${NC}"


if [[ $CONTAINER == *"server"* ]]; then
  log "Creating firewall rule${YL}$FIREWALL_RULE${NC} for ip ${LB}$IP${NC} in $DB_SERVER"

  az sql server firewall-rule create \
  -g $DB_RG \
  -s $DB_SERVER \
  -n $FIREWALL_RULE \
  --start-ip-address $IP \
  --end-ip-address $IP
fi



exit
