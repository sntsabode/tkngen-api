#!/bin/bash

# leaks ganache instance. Don't run this on your computer
# meant to be run by CI action runners 
yarn run chain & (sleep 10s && yarn run testsuite)
