#!/bin/bash

BootGanacheAndRunTests () {
  for (( ; ; ))
  do
    echo "Running Tests"
    echo
 
    (yarn run chain) & (sleep 10s && yarn run tests)

    sleep 10000
  done
}

BootGanacheAndRunTests
