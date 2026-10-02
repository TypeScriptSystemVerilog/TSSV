# CI toolchain image: ghcr.io/typescriptsystemverilog/tssv-ci:<VERSION>
#
# CI only (tssv-noc#130): not a devcontainer or a local setup path. Built and
# published by .github/workflows/ci-image.yml when ./VERSION is bumped.
#
# The Verilator and Verible pins below must match the README's Setup section;
# ci/image/check-pins.sh enforces that in CI. Any change to this file needs a
# VERSION bump, since a published tag is never overwritten.

# --- Stage 1: build Verilator from source -----------------------------------
FROM ubuntu:24.04 AS verilator-build
ARG VERILATOR_VERSION=v5.052
# The README's build deps, minus ccache (no reuse in a one-shot build) and
# libgoogle-perftools-dev/numactl: configure links tcmalloc if it finds it,
# and the runtime stage would then need libtcmalloc as well.
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      build-essential autoconf flex bison help2man perl python3 \
      libfl2 libfl-dev zlib1g zlib1g-dev liblz4-dev ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*
RUN mkdir /tmp/verilator-src \
 && curl -fsSL "https://github.com/verilator/verilator/archive/refs/tags/${VERILATOR_VERSION}.tar.gz" \
      | tar xz -C /tmp/verilator-src --strip-components=1 \
 && cd /tmp/verilator-src \
 && autoconf && ./configure --prefix=/usr/local \
 && make -j"$(nproc)" && make install

# --- Stage 2: runtime image ---------------------------------------------------
FROM ubuntu:24.04
ARG VERIBLE_VERSION=v0.0-4296-g0f262651
ARG NODE_VERSION=v24.21.0
LABEL org.opencontainers.image.source=https://github.com/TypeScriptSystemVerilog/TSSV
LABEL org.opencontainers.image.description="TSSV CI toolchain: Verilator, Verible, Node"

# Verilator is a perl script that shells out to g++/make (build-essential).
# zlib and lz4 are for FST tracing: 5.052's fstcpp writer includes <lz4.h>.
# git lets actions/checkout do a real clone instead of a REST tarball.
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      build-essential perl python3 zlib1g-dev liblz4-dev ca-certificates curl git xz-utils \
 && rm -rf /var/lib/apt/lists/*

COPY --from=verilator-build /usr/local /usr/local

RUN curl -fsSL "https://github.com/chipsalliance/verible/releases/download/${VERIBLE_VERSION}/verible-${VERIBLE_VERSION}-linux-static-x86_64.tar.gz" \
      | tar xz -C /tmp \
 && install -m 755 "/tmp/verible-${VERIBLE_VERSION}"/bin/* /usr/local/bin/ \
 && rm -rf "/tmp/verible-${VERIBLE_VERSION}"

RUN curl -fsSL "https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz" \
      | tar xJ -C /usr/local --strip-components=1 \
      --exclude='*/CHANGELOG.md' --exclude='*/LICENSE' --exclude='*/README.md'

RUN verilator --version && verible-verilog-format --version \
 && verible-verilog-syntax --version && node --version && npm --version
