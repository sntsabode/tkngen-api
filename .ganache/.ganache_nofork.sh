#!/bin/bash

for (( ; ; ))
do
  echo "Booting Ganache instances"
  echo

  node .ganache.js -eqw --no_fork & node .ganache.js -bqw --no_fork

  sleep 10000
done
