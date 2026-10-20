TOP_MODULE?=Vtb_lpFIR
# An .sv file, or a Verilator filelist (.f) such as the one-module-per-file emissions write
VERILOG_FILE?= ../sv-examples/FIR/myFIR3/tb_lpFIR.f

# Every --lint-only run below passes the common waivers file first (SV guide, section 8).
COMMON_WAIVERS = ../doc/rtl-style/sv-style/common_waivers.vlt


run: obj_dir/$(TOP_MODULE)
	obj_dir/$(TOP_MODULE)

# The common waivers here too: generated SV writes + and - without operand casts (WIDTH-3)
obj_dir/$(TOP_MODULE): $(VERILOG_FILE) sim_main.cpp
	verilator --cc $(COMMON_WAIVERS) $(if $(filter %.f,$(VERILOG_FILE)),-F )$(VERILOG_FILE) --exe --trace  sim_main.cpp -CFLAGS -DTOP_MODULE=$(TOP_MODULE)
	make -C obj_dir TOP_MODULE=$(TOP_MODULE) -j -f $(TOP_MODULE).mk $(TOP_MODULE) 

# Show-ahead synchronous FIFO: lint every generated variant with -Wall, through the filelist
# test_SFIFO.js writes for each, then build and run a self-checking testbench once per
# configuration it lists in configs.txt ("<config> <.sv files>"). Each build and its waveform
# (tb_SFIFO_<config>.fst) land in obj_dir/sfifo_<config>/.
SFIFO_DIR    = ../sv-examples/SFIFO
SFIFO_TB_DIR = $(SFIFO_DIR)/tb

sfifo_sim: tsc
	cd ..; node out/test/modules/test_SFIFO.js
	set -e; for f in $(SFIFO_DIR)/SFIFO_*/*.f; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) -F $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	mkdir -p obj_dir
	set -e; while read -r cfg files; do \
	  srcs=""; for f in $$files; do srcs="$$srcs ../$$f"; done; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/sfifo_$$cfg -o Vtb_SFIFO \
	    -DCFG_$$cfg -I$(SFIFO_TB_DIR) tb_SFIFO.sv $$srcs > obj_dir/sfifo_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/sfifo_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/sfifo_$$cfg && ./Vtb_SFIFO); \
	done < $(SFIFO_TB_DIR)/configs.txt

# SRAM: lint every generated variant with -Wall, then build and run a self-checking
# testbench once per configuration that test_SRAM.js lists in configs.txt, with the defines
# that line gives. Each build and its waveform (tb_SRAM_<config>.fst) land in
# obj_dir/sram_<config>/. Then each run in assert_checks.txt breaks one of the SRAM's
# assertions on purpose, and must stop on that assertion.
SRAM_DIR = ../sv-examples/SRAM

sram_sim: tsc
	cd ..; node out/test/modules/test_SRAM.js
	set -e; for f in $(SRAM_DIR)/SRAM_*/*.sv; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	mkdir -p obj_dir
	set -e; while read -r cfg dut defines; do \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/sram_$$cfg -o Vtb_SRAM \
	    -DCFG_$$cfg $$defines -I$(SRAM_DIR)/tb tb_SRAM.sv ../$$dut > obj_dir/sram_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/sram_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/sram_$$cfg && ./Vtb_SRAM); \
	done < $(SRAM_DIR)/tb/configs.txt
	set -e; while read -r check cfg dut mode assertion; do \
	  verilator --binary --timing -j 0 -Mdir obj_dir/sram_assert_$$check -o Vtb_SRAM \
	    -DCFG_$$cfg -DCHECK_ASSERT=$$mode -I$(SRAM_DIR)/tb tb_SRAM.sv ../$$dut \
	    > obj_dir/sram_assert_$$check.build.log 2>&1 || { cat obj_dir/sram_assert_$$check.build.log; exit 1; }; \
	  if (cd obj_dir/sram_assert_$$check && ./Vtb_SRAM) > obj_dir/sram_assert_$$check.log 2>&1; then \
	    cat obj_dir/sram_assert_$$check.log; echo "FAIL: $$check: the run didn't stop"; exit 1; \
	  fi; \
	  grep -q "Assertion failed in tb_SRAM.dut.$$assertion:" obj_dir/sram_assert_$$check.log \
	    || { cat obj_dir/sram_assert_$$check.log; echo "FAIL: $$check: $$assertion didn't fire"; exit 1; }; \
	  echo "PASS: $$check: $$assertion fires"; \
	done < $(SRAM_DIR)/tb/assert_checks.txt

# RegisterBlock read path (TSSV#79): lint both regression blocks with -Wall, then run the
# self-checking testbench against them. regblock_read_waivers.vlt holds the only waivers,
# each for a signal owned by another open bug.
REGBLOCK_DIR = ../sv-examples/RegisterBlock_read

regblock_read_sim: tsc
	cd ..; node out/test/test_RegisterBlock_read.js
	set -e; for b in regblock_read32 regblock_read64; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) regblock_read_waivers.vlt -F $(REGBLOCK_DIR)/$${b}_lint_top.f; \
	  echo "lint -Wall clean: $$b"; \
	done
	mkdir -p obj_dir
	verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/regblock_read -o Vtb_RegisterBlock_read \
	  -F $(REGBLOCK_DIR)/tb_RegisterBlock_read.f \
	  > obj_dir/regblock_read.build.log 2>&1 || { cat obj_dir/regblock_read.build.log; exit 1; }
	cd obj_dir/regblock_read && ./Vtb_RegisterBlock_read

# RegisterBlock register types (TSSV#80): ts/test/test_RegisterBlock_types.ts generates each block
# and its self-checking testbench from one RegisterBlockDef. This lints each block with -Wall,
# then builds and runs its testbench. regblock_types_waivers.vlt holds the only waivers.
TYPES_DIR = ../sv-examples/RegisterBlock_types

regblock_types_sim: tsc
	cd ..; node out/test/test_RegisterBlock_types.js
	mkdir -p obj_dir
	set -e; for b in regblock_types32 regblock_types64; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) regblock_types_waivers.vlt -F $(TYPES_DIR)/$${b}_lint_top.f; \
	  echo "lint -Wall clean: $$b"; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/$$b -o Vtb_$$b -F $(TYPES_DIR)/tb_$$b.f \
	    > obj_dir/$$b.build.log 2>&1 || { cat obj_dir/$$b.build.log; exit 1; }; \
	  (cd obj_dir/$$b && ./Vtb_$$b); \
	done

# TSSV#116: ts/test/test_APB_to_Memory.ts writes a RegisterBlock with an APB port, so its
# APB_to_Memory submodule drives the block's Memory bus. This lints the block with -Wall and runs
# a self-checking APB testbench against it. apb_to_memory_waivers.vlt holds the only waivers.
APB_DIR = ../sv-examples/APB_to_Memory

apb_to_memory_sim: tsc
	cd ..; node out/test/test_APB_to_Memory.js
	verilator --lint-only -Wall --top-module apb_regblock_lint_top $(COMMON_WAIVERS) apb_to_memory_waivers.vlt \
	  $(APB_DIR)/apb_regblock.sv $(APB_DIR)/apb_regblock_lint_top.sv
	@echo "lint -Wall clean: apb_regblock"
	mkdir -p obj_dir
	verilator --binary --timing -j 0 -Mdir obj_dir/apb_to_memory -o Vtb_APB_to_Memory \
	  tb_APB_to_Memory.sv $(APB_DIR)/apb_regblock.sv $(APB_DIR)/memory_models.sv \
	  > obj_dir/apb_to_memory.build.log 2>&1 || { cat obj_dir/apb_to_memory.build.log; exit 1; }
	cd obj_dir/apb_to_memory && ./Vtb_APB_to_Memory

# FIR (TSSV#152): lint every configuration test_FIR.js generates with -Wall, through the lint
# wrapper and filelist written next to it, then build and run the self-checking testbench once
# per configuration in configs.txt ("<config> <.sv files>"). Each build and its waveform
# (tb_FIR_<config>.fst) land in obj_dir/fir_<config>/. The builds pass the common waivers, like the
# lint, because FIR's accumulator writes + without operand casts (WIDTH-3).
FIR_DIR = ../sv-examples/FIR

fir_sim: tsc
	cd ..; node out/test/test_FIR.js
	set -e; for f in $(FIR_DIR)/*/*_lint_top.f; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) -F $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	$(call run_configs,fir,tb_FIR,$(FIR_DIR)/tb,$(COMMON_WAIVERS))

.PHONY: fir_sim

# Two-clock register file (TSSV#121): lint every generated variant with -Wall, then run the
# self-checking testbench once per configuration that test_TwoClockRegFile.js lists in
# configs.txt. Each build and its waveform (tb_TwoClockRegFile_<config>.fst) land in
# obj_dir/twoclockregfile_<config>/. b_clk's period is a variable that's never zero, hence
# --no-sched-zero-delay.
TCRF_DIR = ../sv-examples/TwoClockRegFile

twoclockregfile_sim: tsc
	cd ..; node out/test/modules/test_TwoClockRegFile.js
	set -e; for f in $(TCRF_DIR)/TwoClockRegFile_*/*.sv; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --binary --timing --no-sched-zero-delay --trace-fst -j 0 -Mdir obj_dir/twoclockregfile_$$cfg -o Vtb_TwoClockRegFile \
	    -DCFG_$$cfg -I$(TCRF_DIR)/tb tb_TwoClockRegFile.sv ../$$dut > obj_dir/twoclockregfile_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/twoclockregfile_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/twoclockregfile_$$cfg && ./Vtb_TwoClockRegFile); \
	done < $(TCRF_DIR)/tb/configs.txt

# Dual-clock FIFO and its helpers (TSSV#67). Each target lints every generated variant with
# -Wall, then runs its self-checking testbench once per configuration that its test script lists
# in configs.txt ("<config> <.sv files>"). Each build and its waveform land in
# obj_dir/<target>_<config>/. Both clock periods are variables that are never zero, hence
# --no-sched-zero-delay. --coverage-user makes Verilator run the testbenches' cover properties,
# which it otherwise compiles and skips (TSSV#97); a testbench fails if a cover is never hit.
CDC_DIR   = ../sv-examples/CDCSynchronizer
GP_DIR    = ../sv-examples/GrayPointer
AFIFO_DIR = ../sv-examples/AFIFO
CDC_SIM   = verilator --binary --timing --no-sched-zero-delay --trace-fst --coverage-user -j 0

# $(call run_configs,<name>,<tb>,<tb dir>,<extra sources>): build and run <tb> per configuration
define run_configs
	mkdir -p obj_dir
	set -e; while read -r cfg files; do \
	  srcs=""; for f in $$files; do srcs="$$srcs ../$$f"; done; \
	  $(CDC_SIM) -Mdir obj_dir/$(1)_$$cfg -o V$(2) -DCFG_$$cfg -I$(3) $(2).sv $(4) $$srcs \
	    > obj_dir/$(1)_$$cfg.build.log 2>&1 || { cat obj_dir/$(1)_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/$(1)_$$cfg && ./V$(2)); \
	done < $(3)/configs.txt
endef

cdcsynchronizer_sim: tsc
	cd ..; node out/test/modules/test_CDCSynchronizer.js
	set -e; for f in $(CDC_DIR)/CDCSynchronizer_*/*.sv; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	$(call run_configs,cdcsynchronizer,tb_CDCSynchronizer,$(CDC_DIR)/tb,)

# GrayPointer and AFIFO variants are emitted one module per file, so each is linted through the
# filelist its test script writes next to it
graypointer_sim: tsc
	cd ..; node out/test/modules/test_GrayPointer.js
	set -e; for f in $(GP_DIR)/GrayPointer_*/*.f; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) -F $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	$(call run_configs,graypointer,tb_GrayPointer,$(GP_DIR)/tb,GrayPointer_checks.sv)

afifo_sim: tsc
	cd ..; node out/test/modules/test_AFIFO.js
	set -e; for f in $(AFIFO_DIR)/AFIFO_*/*.f; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) -F $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	$(call run_configs,afifo,tb_AFIFO,$(AFIFO_DIR)/tb,GrayPointer_checks.sv)

# ROM (TSSV#151): lint every generated variant with -Wall, then build and run a self-checking
# testbench once per configuration that test_ROM.js lists in configs.txt ("<config> <.sv file>").
# Each build and its waveform (tb_ROM_<config>.fst) land in obj_dir/rom_<config>/.
ROM_DIR = ../sv-examples/ROM

rom_sim: tsc
	cd ..; node out/test/modules/test_ROM.js
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) ../$$dut; \
	  echo "lint -Wall clean: $$dut"; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/rom_$$cfg -o Vtb_ROM \
	    -DCFG_$$cfg -I$(ROM_DIR)/tb tb_ROM.sv ../$$dut > obj_dir/rom_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/rom_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/rom_$$cfg && ./Vtb_ROM); \
	done < $(ROM_DIR)/tb/configs.txt

.PHONY: rom_sim

clean:
	rm -rf obj_dir
	rm -f *.vcd

.PHONY: sfifo_sim sram_sim regblock_read_sim regblock_types_sim apb_to_memory_sim twoclockregfile_sim \
  cdcsynchronizer_sim graypointer_sim afifo_sim
.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.f: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/addRegister_tb.sv: tsc
	cd ..; node out/test/test_addRegister.js
