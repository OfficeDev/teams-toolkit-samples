#!/usr/bin/env bash

# This script requires jq and zip command, which are installed in GitHub Action virtual environments by default.
# See https://github.com/actions/virtual-environments/blob/main/images/linux/Ubuntu2004-Readme.md#installed-apt-packages

set -x

if [ -z "$1" ]; then
    echo "Must input a path for samples folder"
    exit -1
fi

SAMPLE_OUTPUT_DIR=$1
mkdir -p ${SAMPLE_OUTPUT_DIR}

SAMPLE_LIST=$(jq -r '.samples[]' ./.github/sample-list.json)

for SAMPLE in ${SAMPLE_LIST[@]}; do


    if [ ! -d ./${SAMPLE} ]; then
        echo "The folder ${SAMPLE} does not exist."
        exit -1
    fi

    cd ./${SAMPLE}
    zip -rq ${SAMPLE_OUTPUT_DIR}/${SAMPLE}.zip .
    cd -
done