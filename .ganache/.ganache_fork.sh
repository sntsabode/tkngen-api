#!/bin/bash

for (( ; ; ))
do
  echo "Booting Ganache instances"
  echo

  node ./.ganache/.ganache.js -eqw & node ./.ganache/.ganache.js -bqw

  sleep 10000
done
