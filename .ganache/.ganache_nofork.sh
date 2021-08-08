#!/bin/bash

for (( ; ; ))
do
  echo "Booting Ganache instances"
  echo

  node ./.ganache/.ganache.js -eqw --no_fork & node ./.ganache/.ganache.js -bqw --no_fork

  sleep 10000
done
