#!/bin/bash

set -e

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. $dir/colors.cfg
filename=$(basename ${BASH_SOURCE[0]})

echo -e "${CY}The ${YL}${COMPOSE_PROJECT_NAME} ${filename} ${CY}script has been executed"


RESULT=`sqlcmd -h -1 -t 1 -S localhost -U test -P  -d shortpoetdb -Q "set nocount on; select count(*) from vcc.admin_users"`
for i in $RESULT; do
  echo $i
done

if [ $RESULT -gt 0 ]; then
  echo "Result is $RESULT"
else
  echo "No result"
fi




echo -e "${GR}Ending ${BO}test ${GR}- now"
  
# >&2 echo -e "${LB}Mssql is up - ${RD}executing command${NC}"



# exec $cmd
