#!/bin/bash

if [ $# -gt 1 ]
then
  echo "Too many arguments."
  echo "Enter (--fork) or (--no_fork)"
  echo

  exit 1
fi

if [ $# -eq 0 ]
then
  echo "No arguments passed in running Ganache without forks."
  echo

  for (( ; ; ))
  do
    echo "Running tests."
    echo

    (yarn run chain) & (sleep 10s && yarn run tests)

    sleep 10000
  done
fi

if [ $1 != "--fork" ] && [ $1 != "--no_fork" ]
then
  echo "Invalid argument."
  echo "Please pass in (--fork) or (--no_fork)."
  echo "You passed in" $1 "."
  echo

  exit 1
fi

if [ $1 == "--fork" ]
then
  echo "Running Ganache with forks (--fork parameter passed in)"
  echo

  for (( ; ; ))
  do
    echo "Running Tests"
    echo

    (yarn run chain:fork) & (sleep 10s && yarn run tests)

    sleep 10000
  done
fi

if [ $1 == "--no_fork" ]
then
  echo "Running Ganache without forks (--no_fork parameter passed in)"
  echo

  for (( ; ; ))
  do
    echo "Running Tests"
    echo

    (yarn run chain) & (sleep 10s && yarn run tests)

    sleep 10000
  done
fi
