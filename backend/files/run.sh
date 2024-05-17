#!/bin/bash

set -xe

# python /src/manage.py makemigrations
python /src/manage.py migrate

if [ "$DJANGO_USE_WSGI" == "1" ] ; then
    echo "BACKEND RUN IN uWSGI MODE"
    uwsgi --http :80 \
        --processes $UWSGI_WORKER \
        --wsgi-file /src/backend/wsgi.py
else
    echo "BACKEND RUN WITH DJANGO RUNSERVER COMMAND"
    python /src/manage.py runserver 0.0.0.0:80
fi
