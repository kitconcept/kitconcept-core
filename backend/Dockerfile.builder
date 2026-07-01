# syntax=docker/dockerfile:1.9
ARG PYTHON_VERSION=3.14
FROM plone/server-builder:uv-${PYTHON_VERSION} AS builder
ARG KC_VERSION

# Remove base skeleton to avoid conflicts with our
RUN <<EOT
    rm -Rf /app_skeleton
EOT

# Copy default structure for a Plone Project
COPY /container/skeleton /app_skeleton

LABEL maintainer="kitconcept GmbH <gov@plone.org.br>" \
      org.label-schema.name="ghcr.io/kitconcept/core-builder" \
      org.label-schema.description="kitconcept $KC_VERSION builder image with Python $PYTHON_VERSION" \
      org.label-schema.vendor="kitconcept GmbH"
