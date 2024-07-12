#!/bin/bash
set -e

# Check if the number of arguments is exactly 2
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <component> <json_config>"
  exit 1
fi

# Assign arguments to variables
component=$1
json_config=$2

scriptDir="$(dirname "$0")"

if [ ! -d "$scriptDir/$component" ]; then
  echo "Error: Component $component does not exist."
  exit 1
fi

if [ ! -f "$json_config" ]; then
  echo "Error: Configuration file $json_config does not exist or is not a regular file."
  exit 1
fi

rm -rf $scriptDir/componentgen
cp -r $scriptDir/$component $scriptDir/componentgen

cp $json_config $scriptDir/componentgen/componentgenConfig.json

user_id=$(id -u)
group_id=$(id -g)
echo "#!/bin/bash" > $scriptDir/componentgen/run.sh 
echo "make -f src/main/scala/componentgen/Makefile verilog" >> $scriptDir/componentgen/run.sh 
echo "chown -R $user_id:$group_id /rocketchip/src/main/scala/componentgen/compile.dest" >> $scriptDir/componentgen/run.sh
chmod +x $scriptDir/componentgen/run.sh

cd $scriptDir
docker run --rm -v ./componentgen:/rocketchip/src/main/scala/componentgen avonancken/rocketdock:v1 /rocketchip/src/main/scala/componentgen/run.sh 
echo "Generated componenet path: $scriptDir/componentgen/compile.dest"
