#!/bin/bash

if [ $# -eq 0 ]
then
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo

    node ./.ganache/.ganache.js -bw --no_fork

    sleep 10000
  done
fi

if [ $1 == "--fork" ]
then
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo

    node ./.ganache/.ganache.js -bw

    sleep 10000
  done
fi

if [ $1 == "--no_fork" ]
then
  for (( ; ; ))
  do
    echo "Booting Ganache instances"
    echo

    node ./.ganache/.ganache.js -bw --no_fork

    sleep 10000
  done
fi
