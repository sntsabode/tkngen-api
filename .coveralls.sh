#!/bin/bash

# Do not run this file. It's meant to be run by a Github Actions Runner.
# Leaks ganache instance

yarn run chain & (sleep 10s && yarn run test:coveralls)