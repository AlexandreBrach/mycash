# MyCash

MyCash is a cash management tool for individuals and even small businesses.

It is free software under the [GNU Affero](https://www.gnu.org/licenses/agpl-3.0.html) licenses. It is supplied as is and without any guarantee of operation.

# Goal

The goal is to no longer waste time calculating! Simply import your data from your bank and categorize each extract line. MyCash gives you the summary. Once your categories defined, you can add your forecasts for the next months, no more excess cemtimes will escape you!

## Features

- Bank reconciliation
- graphical visualization of expenses
- balance tracking
- forecast and cash flow plan

# Usage

## Docker compose

If you already know docker compose, it's quite straithforward :

Copy the `env.dist` file to a new `.env` file, then set it accordingly to your setup.

Then, you can run `docker compose up -d`. You can easily show the state and the logs of the app using the matching `docker compose` command.

then go to the `http://localhost:3456` (change the port number if you have changed the `APPLICATION_PORT` value)

## Kubernetes using Helm

Their is no Helm repository for this app. For now, you have to :

- clone this git repository
- build all image and push them to your Docker registry
- create a helm value file overriding the value of `charts/values.yml` file
- install the chart using :

```bash
helm install -n yournamespace my-comptes ./charts
```

# Contribute

Any contribution is welcome. If you think something is bad about MyCash or its documentation the way it is, please help in any way to make it better : this is an Open Source Project.

## backend development

Run the app using `docker compose` command.
The backend will reload on any code modification.

You can run unit test using :

```bash
    docker compose exec -it backend python manage.py test
```

## frontend development

Pre requisite : your system needs :

- the `envsubst` command (install the gettext from your os distribution)
- nodejs (version `20.8.0`)

It's hard to work on the frontend code through the Docker container, so you will have to do the following :

- `cd frontend`
- `export API_BASE_URL=http://localhost:3456`
  (this will tell the location of the backend, you could also write it onto your .bashrc)
- `yarn`
- `yarn start`

You will have to set the local backend to allow any CORS origin : set the `CORS_ORIGIN_ALLOW_ALL` value to 1 in your `.env` file (not recommended on a production environment)

You can run the unit test at the same location using : `yarn test`
