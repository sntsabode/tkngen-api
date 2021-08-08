#!/bin/bash

BootGanacheInstances () {
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo

    node .ganache.js -eqw & node .ganache.js -bqw

    sleep 10000
  done
}

BootGanacheInstances
