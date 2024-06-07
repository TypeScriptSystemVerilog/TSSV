# #!/bin/bash

# # Shell script to run Docker container with GTKWave

# # Set the environment variable for display
# DISPLAY_HOST="host.docker.internal:0"

# # Set the volume to be mounted
# LOCAL_VOLUME="/Users/bennettva/"
# CONTAINER_VOLUME="/Users/bennettva"

# # Set the Docker image and command to run
# DOCKER_IMAGE="hdlc/gtkwave"
# DOCKER_COMMAND="/usr/local/bin/gtkwave /Users/bennettva/TSSV/verilatorTB/Vtb_lpFIR.vcd"

# # Run the Docker container with the specified options
# docker run --rm -e DISPLAY=$DISPLAY_HOST -v $LOCAL_VOLUME:$CONTAINER_VOLUME $DOCKER_IMAGE $DOCKER_COMMAND

# new code

#!/bin/bash

# Shell script to run Docker container with GTKWave

# Check if a file argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path_to_vcd_file>"
    exit 1
fi

# Get the VCD file path from the argument
VCD_FILE=$1

# Ensure the VCD file exists
if [ ! -f "$VCD_FILE" ]; then
    echo "Error: File $VCD_FILE does not exist."
    exit 1
fi

# Set the environment variable for display
DISPLAY_HOST="host.docker.internal:0"

# Get the directory of the VCD file to mount
LOCAL_DIR=$(dirname "$VCD_FILE")

# Set the Docker image
DOCKER_IMAGE="hdlc/gtkwave"

# Run the Docker container with the specified options
docker run --rm -e DISPLAY=$DISPLAY_HOST -v $LOCAL_DIR:$LOCAL_DIR $DOCKER_IMAGE /usr/local/bin/gtkwave $VCD_FILE
