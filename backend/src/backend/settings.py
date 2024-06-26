"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "iya6+t+3_ugfyh72uu*azd5lfl%ymmf7dhpn)n^-4wo^=aw9&6"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ["DJANGO_DEBUG"] == "1"

ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "comptes.apps.ComptesConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "mptt",
]

MIDDLEWARE = [
    "comptes.middleware.ExceptionMiddleware.ExceptionMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

CORS_ORIGIN_ALLOW_ALL = True if os.environ["CORS_ORIGIN_ALLOW_ALL"] == "1" else False

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "HOST": os.environ["DATABASE_HOST"],
        "NAME": os.environ["DATABASE_NAME"],
        "USER": os.environ["DATABASE_USER"],
        "PASSWORD": os.environ["DATABASE_PASSWORD"],
        "PORT": os.environ["DATABASE_PORT"],
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Paris"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = "/static/"

DATABASE_DEBUG_LEVEL = "DEBUG" if os.environ["SQL_LOG_REQUEST"] == "1" else "CRITICAL"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            "datefmt": "%d/%b/%Y %H:%M:%S",
        },
        "simple": {"format": "%(levelname)s %(message)s"},
        "insertor": {"format": "[INSERTOR] %(levelname)s %(message)s"},
    },
    "handlers": {
        "stream": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "insertor": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "insertor",
        },
    },
    "loggers": {
        "django.request": {
            "handlers": ["stream"],
            "level": "INFO",
            "propagate": True,
        },
        "django": {
            "handlers": ["stream"],
            "level": "INFO",
            "propagate": True,
        },
        "insertor": {
            "handlers": ["insertor"],
            "level": "INFO",
            "propagate": True,
        },
        "django.db.backends": {
            "handlers": ["stream"],
            "level": DATABASE_DEBUG_LEVEL,
        },
    },
}
