#!/bin/bash

# leaks ganache instance. Don't run this on your computer
# meant to be run by Github's action runner
yarn run chain & (sleep 10s && yarn run testsuite)
