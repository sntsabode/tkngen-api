#!/bin/bash

BootGanacheInstances () {
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo

    node chain-fork.js -eqw & node chain-fork.js -bqw

    sleep 10000
  done
}

BootGanacheInstances