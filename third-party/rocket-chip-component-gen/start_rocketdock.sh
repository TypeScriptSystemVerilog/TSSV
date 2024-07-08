#!/bin/bash
set -e

# Check if the number of arguments is exactly 2
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <component> <json_config>"
  exit 1
fi

# Assign arguments to variables
component=$1

scriptDir="$(dirname "$0")"

if [ ! -d "$scriptDir/$component" ]; then
  echo "Error: Component $component does not exist."
  exit 1
fi

rm -rf $scriptDir/componentgen


cd $scriptDir
ln -s $component componentgen
docker run  -it --rm -v ./componentgen:/rocketchip/src/main/scala/componentgen avonancken/rocketdock:v1
