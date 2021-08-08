#!/bin/bash

BootGanacheInstances () {
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo

    node chain-fork.js -eqw --no_fork & node chain-fork.js -bqw --no_fork

    sleep 10000
  done
}

BootGanacheInstances