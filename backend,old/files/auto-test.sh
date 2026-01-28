#!/bin/bash

set -xe

until ack -f --python | entr -dn python -Wa /src/manage.py test comptes/tests/ --failfast ; do sleep 1; done
