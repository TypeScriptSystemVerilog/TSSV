FROM ubuntu:22.04

RUN apt update && apt install -y \
    git \
    cmake \
    ninja-build \
    build-essential \
    libtool \
    libssl-dev \
    zlib1g-dev \
    python3 \
    python3-pip \
    autoconf automake autotools-dev curl \
    libmpc-dev libmpfr-dev libgmp-dev \
    libusb-1.0-0-dev gawk build-essential \
    bison flex texinfo gperf libtool \
    patchutils bc zlib1g-dev \
    device-tree-compiler pkg-config \
    libexpat-dev libfl-dev default-jre
    

RUN pip3 install z3-solver ortools


RUN git clone https://github.com/llvm/circt.git /circt 
WORKDIR /circt
RUN cd /circt && git checkout tags/firtool-1.72.0 && git submodule init && git submodule update  

RUN apt update && apt install -y \
    gcc \
    lld
RUN apt upgrade    

RUN mkdir /circt/llvm/build && cd /circt/llvm/build &&cmake -G Ninja ../llvm \
    -DLLVM_ENABLE_PROJECTS="mlir" \
    -DLLVM_TARGETS_TO_BUILD="host" \
    -DLLVM_ENABLE_ASSERTIONS=ON \
    -DCMAKE_BUILD_TYPE=Release \
    -DLLVM_USE_SPLIT_DWARF=ON \
    -DLLVM_ENABLE_LLD=ON && ninja


RUN cd /circt && mkdir build &&cd build && cmake -G Ninja .. \
    -DMLIR_DIR=$PWD/../llvm/build/lib/cmake/mlir \
    -DLLVM_DIR=$PWD/../llvm/build/lib/cmake/llvm \
    -DLLVM_ENABLE_ASSERTIONS=ON \
    -DCMAKE_BUILD_TYPE=Release \
    -DLLVM_USE_SPLIT_DWARF=ON \
    -DLLVM_ENABLE_LLD=ON  && ninja && ninja install


RUN git clone https://github.com/chipsalliance/rocket-chip.git /rocketchip
RUN cd /rocketchip  && git checkout 1ba5acd77aeb54cb11c045a652867f8cb21bec60 -b dev063024 && git submodule update --init
RUN sh -c "curl -L https://github.com/com-lihaoyi/mill/releases/download/0.11.8/0.11.8 > /usr/bin/mill && chmod +x /usr/bin/mill"

RUN cd /rocketchip && \
echo -e 'diff --git a/build.sc b/build.sc\n'\
'index 8baed34e5..4c79a1b94 100644\n'\
'--- a/build.sc\n'\
'+++ b/build.sc\n'\
'@@ -191,7 +191,6 @@ trait Emulator extends Cross.Module2[String, String] {\n'\
'         generator.chirrtl().path,\n'\
'         s"--annotation-file=${generator.chiselAnno().path}",\n'\
'         "--disable-annotation-unknown",\n'\
'-        "-dedup",\n'\
'         "-O=debug",\n'\
'         "--split-verilog",\n'\
'         "--preserve-values=named",\n'\
'@@ -310,6 +309,7 @@ trait Emulator extends Cross.Module2[String, String] {\n'\
'\n'\
' /** object to elaborate verilated emulators. */\n'\
' object emulator extends Cross[Emulator](\n'\
'+  ("tssv.componentgen.MyAXISubsystem", "tssv.componentgen.MyAXIConfig"),\n'\
'   // RocketSuiteA\n'\
'   ("freechips.rocketchip.system.TestHarness", "freechips.rocketchip.system.DefaultConfig"),\n'\
'   // RocketSuiteB\n' | patch build.sc

RUN cd /rocketchip && make verilog

ENV PATH="/circt/build/bin:${PATH}"
WORKDIR /rocketchip
