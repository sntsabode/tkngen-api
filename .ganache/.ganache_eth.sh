#!/bin/bash

for (( ; ; ))
do
  echo "Booting Ganache instances"
  echo

  node ./.ganache/.ganache.js -eqw

  sleep 10000
done
