#!/bin/bash

BootGanacheAndRunTests () {
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo
 
    (yarn run chain) & (sleep 10s && yarn run test)

    sleep 10000
  done
}

BootGanacheAndRunTests
