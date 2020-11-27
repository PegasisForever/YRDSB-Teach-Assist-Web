#!/bin/bash

docker run -it --rm -u 1000 --network host -v $(pwd):/host -e SASS_PATH=./node_modules -e GENERATE_SOURCEMAP=false node:14 bash -c "cd /host && npm install && ./node_modules/.bin/react-scripts build"
