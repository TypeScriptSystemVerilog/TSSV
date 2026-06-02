#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path_to_vcd_file>"
    exit 1
fi

VCD_FILE=$1

if [ ! -f "$VCD_FILE" ]; then
    echo "Error: File $VCD_FILE does not exist."
    exit 1
fi

gtkwave "$VCD_FILE"
