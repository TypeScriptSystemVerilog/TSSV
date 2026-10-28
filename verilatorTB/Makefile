TOP_MODULE?=Vtb_lpFIR
# The top .sv file, built with USE_INCLUDES and its directory on the include path, or a Verilator
# filelist (.f)
VERILOG_FILE?= ../sv-examples/FIR/myFIR3/tb_lpFIR.sv

# Every --lint-only run below passes the common waivers file first (SV guide, section 8).
COMMON_WAIVERS = ../doc/rtl-style/sv-style/common_waivers.vlt

# Generated SV is one guarded file per module and interface (writeSystemVerilogFiles()), and each
# file includes the files it needs under USE_INCLUDES. Every lint and build below defines it and
# puts the top file's directory on the include path, so naming the top file brings in the rest.
SV_INCLUDES = +define+USE_INCLUDES

# $(call lint_variants,<variant dirs>): lint each variant's top file, <variant>/<variant>.sv, with
# -Wall. Its lint reaches every file it includes.
define lint_variants
	set -e; for d in $(1); do \
	  f=$${d%/}/$$(basename $$d).sv; \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) $(SV_INCLUDES) -I$${d%/} $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
endef

run: obj_dir/$(TOP_MODULE)
	obj_dir/$(TOP_MODULE)

# The common waivers here too: generated SV writes + and - without operand casts (WIDTH-3)
obj_dir/$(TOP_MODULE): $(VERILOG_FILE) sim_main.cpp
	verilator --cc $(COMMON_WAIVERS) $(SV_INCLUDES) -I$(dir $(VERILOG_FILE)) $(if $(filter %.f,$(VERILOG_FILE)),-F )$(VERILOG_FILE) --exe --trace  sim_main.cpp -CFLAGS -DTOP_MODULE=$(TOP_MODULE)
	make -C obj_dir TOP_MODULE=$(TOP_MODULE) -j -f $(TOP_MODULE).mk $(TOP_MODULE) 

# Show-ahead synchronous FIFO: lint every generated variant with -Wall, through its top file,
# then build and run a self-checking testbench once per configuration test_SFIFO.js lists in
# configs.txt ("<config> <top .sv file>"). Each build and its waveform (tb_SFIFO_<config>.fst)
# land in obj_dir/sfifo_<config>/.
SFIFO_DIR    = ../sv-examples/SFIFO
SFIFO_TB_DIR = $(SFIFO_DIR)/tb

sfifo_sim: tsc
	cd ..; node out/test/modules/test_SFIFO.js
	$(call lint_variants,$(SFIFO_DIR)/SFIFO_*/)
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/sfifo_$$cfg -o Vtb_SFIFO \
	    -DCFG_$$cfg -I$(SFIFO_TB_DIR) $(SV_INCLUDES) -I$$(dirname ../$$dut) tb_SFIFO.sv ../$$dut > obj_dir/sfifo_$$cfg.build.log 2>&1 \
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
	$(call lint_variants,$(SRAM_DIR)/SRAM_*/)
	mkdir -p obj_dir
	set -e; while read -r cfg dut defines; do \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/sram_$$cfg -o Vtb_SRAM \
	    -DCFG_$$cfg $$defines -I$(SRAM_DIR)/tb $(SV_INCLUDES) -I$$(dirname ../$$dut) tb_SRAM.sv ../$$dut > obj_dir/sram_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/sram_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/sram_$$cfg && ./Vtb_SRAM); \
	done < $(SRAM_DIR)/tb/configs.txt
	set -e; while read -r check cfg dut mode assertion; do \
	  verilator --binary --timing -j 0 -Mdir obj_dir/sram_assert_$$check -o Vtb_SRAM \
	    -DCFG_$$cfg -DCHECK_ASSERT=$$mode -I$(SRAM_DIR)/tb $(SV_INCLUDES) -I$$(dirname ../$$dut) tb_SRAM.sv ../$$dut \
	    > obj_dir/sram_assert_$$check.build.log 2>&1 || { cat obj_dir/sram_assert_$$check.build.log; exit 1; }; \
	  if (cd obj_dir/sram_assert_$$check && ./Vtb_SRAM) > obj_dir/sram_assert_$$check.log 2>&1; then \
	    cat obj_dir/sram_assert_$$check.log; echo "FAIL: $$check: the run didn't stop"; exit 1; \
	  fi; \
	  grep -q "Assertion failed in tb_SRAM.dut.$$assertion:" obj_dir/sram_assert_$$check.log \
	    || { cat obj_dir/sram_assert_$$check.log; echo "FAIL: $$check: $$assertion didn't fire"; exit 1; }; \
	  echo "PASS: $$check: $$assertion fires"; \
	done < $(SRAM_DIR)/tb/assert_checks.txt

# RegisterBlock read path (TSSV#79): ts/test/test_RegisterBlock_read.ts generates both regression
# blocks and a self-checking testbench for each from its RegisterBlockDef (TSSV#130). This lints
# each block with -Wall, then builds and runs its testbench. regblock_read_waivers.vlt holds the
# only waivers, each for a signal owned by another open bug.
REGBLOCK_DIR = ../sv-examples/RegisterBlock_read

regblock_read_sim: tsc
	cd ..; node out/test/test_RegisterBlock_read.js
	mkdir -p obj_dir
	set -e; for b in regblock_read32 regblock_read64; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) regblock_read_waivers.vlt $(SV_INCLUDES) -I$(REGBLOCK_DIR) $(REGBLOCK_DIR)/$${b}_lint_top.sv; \
	  echo "lint -Wall clean: $$b"; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/$$b -o Vtb_$$b $(SV_INCLUDES) -I$(REGBLOCK_DIR) $(REGBLOCK_DIR)/tb_$$b.sv \
	    > obj_dir/$$b.build.log 2>&1 || { cat obj_dir/$$b.build.log; exit 1; }; \
	  (cd obj_dir/$$b && ./Vtb_$$b); \
	done

# RegisterBlock register types (TSSV#80): ts/test/test_RegisterBlock_types.ts generates each block
# and its self-checking testbench from one RegisterBlockDef. This lints each block with -Wall,
# then builds and runs its testbench. regblock_types_waivers.vlt holds the only waivers.
TYPES_DIR = ../sv-examples/RegisterBlock_types

regblock_types_sim: tsc
	cd ..; node out/test/test_RegisterBlock_types.js
	mkdir -p obj_dir
	set -e; for b in regblock_types32 regblock_types64; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) regblock_types_waivers.vlt $(SV_INCLUDES) -I$(TYPES_DIR) $(TYPES_DIR)/$${b}_lint_top.sv; \
	  echo "lint -Wall clean: $$b"; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/$$b -o Vtb_$$b $(SV_INCLUDES) -I$(TYPES_DIR) $(TYPES_DIR)/tb_$$b.sv \
	    > obj_dir/$$b.build.log 2>&1 || { cat obj_dir/$$b.build.log; exit 1; }; \
	  (cd obj_dir/$$b && ./Vtb_$$b); \
	done

# The example RegisterBlock (TSSV#130): ts/test/testRegisters.ts generates the block and a
# self-checking testbench from one RegisterBlockDef. This lints the block with -Wall, then builds
# and runs the testbench. No waivers beyond the common ones.
REGISTERS_DIR = ../sv-examples/Core/Registers

registers_sim: tsc
	cd ..; node out/test/testRegisters.js > /dev/null
	verilator --lint-only -Wall $(COMMON_WAIVERS) $(SV_INCLUDES) -I$(REGISTERS_DIR) $(REGISTERS_DIR)/testRegBlock_lint_top.sv
	@echo "lint -Wall clean: testRegBlock"
	mkdir -p obj_dir
	verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/testRegBlock -o Vtb_testRegBlock $(SV_INCLUDES) -I$(REGISTERS_DIR) $(REGISTERS_DIR)/tb_testRegBlock.sv \
	  > obj_dir/testRegBlock.build.log 2>&1 || { cat obj_dir/testRegBlock.build.log; exit 1; }
	cd obj_dir/testRegBlock && ./Vtb_testRegBlock

# TSSV#116: ts/test/test_APB_to_Memory.ts writes a RegisterBlock with an APB port, so its
# APB_to_Memory submodule drives the block's Memory bus. This lints the block with -Wall through
# its lint wrapper, and runs a self-checking APB testbench against it, from the filelist the test
# writes: tb_APB_to_Memory.sv is here, outside sv-examples/, so the filelist names it with the
# generated files it instantiates. No waivers beyond the common ones (TSSV#154).
APB_DIR = ../sv-examples/APB_to_Memory

apb_to_memory_sim: tsc
	cd ..; node out/test/test_APB_to_Memory.js
	verilator --lint-only -Wall $(COMMON_WAIVERS) $(SV_INCLUDES) -I$(APB_DIR) $(APB_DIR)/apb_regblock_lint_top.sv
	@echo "lint -Wall clean: apb_regblock"
	mkdir -p obj_dir
	verilator --binary --timing -j 0 -Mdir obj_dir/apb_to_memory -o Vtb_APB_to_Memory -F $(APB_DIR)/tb_APB_to_Memory.f \
	  > obj_dir/apb_to_memory.build.log 2>&1 || { cat obj_dir/apb_to_memory.build.log; exit 1; }
	cd obj_dir/apb_to_memory && ./Vtb_APB_to_Memory

# FIR (TSSV#152): lint every configuration test_FIR.js generates with -Wall, through the lint
# wrapper written next to it, which includes it, then build and run the self-checking testbench
# once per configuration in configs.txt ("<config> <top .sv file>"). Each build and its waveform
# (tb_FIR_<config>.fst) land in obj_dir/fir_<config>/. The builds pass the common waivers, like the
# lint, because FIR's accumulator writes + without operand casts (WIDTH-3).
FIR_DIR = ../sv-examples/FIR

fir_sim: tsc
	cd ..; node out/test/test_FIR.js
	set -e; for f in $(FIR_DIR)/*/*_lint_top.sv; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) $(SV_INCLUDES) -I$$(dirname $$f) $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	$(call run_configs,fir,tb_FIR,$(FIR_DIR)/tb,$(COMMON_WAIVERS))

.PHONY: fir_sim

# LZC and shift (TSSV#153): lint every variant the test script generates with -Wall, then build
# and run the self-checking testbench once per configuration in configs.txt ("<config> <top .sv
# file>"). Each build and its waveform land in obj_dir/lzc_<config>/ or obj_dir/shift_<config>/.
LZC_DIR   = ../sv-examples/LZC
SHIFT_DIR = ../sv-examples/shift

lzc_sim: tsc
	cd ..; node out/test/modules/test_LZC.js
	$(call lint_variants,$(LZC_DIR)/LZC_*/)
	$(call run_configs,lzc,tb_LZC,$(LZC_DIR)/tb,)

shift_sim: tsc
	cd ..; node out/test/modules/test_shift.js
	$(call lint_variants,$(SHIFT_DIR)/shift_*/)
	$(call run_configs,shift,tb_shift,$(SHIFT_DIR)/tb,)

.PHONY: lzc_sim shift_sim

# Two-clock register file (TSSV#121): lint every generated variant with -Wall, then run the
# self-checking testbench once per configuration that test_TwoClockRegFile.js lists in
# configs.txt. Each build and its waveform (tb_TwoClockRegFile_<config>.fst) land in
# obj_dir/twoclockregfile_<config>/. b_clk's period is a variable that's never zero, hence
# --no-sched-zero-delay.
TCRF_DIR = ../sv-examples/TwoClockRegFile

twoclockregfile_sim: tsc
	cd ..; node out/test/modules/test_TwoClockRegFile.js
	$(call lint_variants,$(TCRF_DIR)/TwoClockRegFile_*/)
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --binary --timing --no-sched-zero-delay --trace-fst -j 0 -Mdir obj_dir/twoclockregfile_$$cfg -o Vtb_TwoClockRegFile \
	    -DCFG_$$cfg -I$(TCRF_DIR)/tb $(SV_INCLUDES) -I$$(dirname ../$$dut) tb_TwoClockRegFile.sv ../$$dut > obj_dir/twoclockregfile_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/twoclockregfile_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/twoclockregfile_$$cfg && ./Vtb_TwoClockRegFile); \
	done < $(TCRF_DIR)/tb/configs.txt

# Dual-clock FIFO and its helpers (TSSV#67). Each target lints every generated variant with
# -Wall, then runs its self-checking testbench once per configuration that its test script lists
# in configs.txt ("<config> <top .sv file>"). Each build and its waveform land in
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
	set -e; while read -r cfg dut; do \
	  $(CDC_SIM) -Mdir obj_dir/$(1)_$$cfg -o V$(2) -DCFG_$$cfg -I$(3) $(SV_INCLUDES) -I$$(dirname ../$$dut) $(2).sv $(4) ../$$dut \
	    > obj_dir/$(1)_$$cfg.build.log 2>&1 || { cat obj_dir/$(1)_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/$(1)_$$cfg && ./V$(2)); \
	done < $(3)/configs.txt
endef

cdcsynchronizer_sim: tsc
	cd ..; node out/test/modules/test_CDCSynchronizer.js
	$(call lint_variants,$(CDC_DIR)/CDCSynchronizer_*/)
	$(call run_configs,cdcsynchronizer,tb_CDCSynchronizer,$(CDC_DIR)/tb,)

graypointer_sim: tsc
	cd ..; node out/test/modules/test_GrayPointer.js
	$(call lint_variants,$(GP_DIR)/GrayPointer_*/)
	$(call run_configs,graypointer,tb_GrayPointer,$(GP_DIR)/tb,GrayPointer_checks.sv)

afifo_sim: tsc
	cd ..; node out/test/modules/test_AFIFO.js
	$(call lint_variants,$(AFIFO_DIR)/AFIFO_*/)
	$(call run_configs,afifo,tb_AFIFO,$(AFIFO_DIR)/tb,GrayPointer_checks.sv)

# ROM (TSSV#151): lint every generated variant with -Wall, then build and run a self-checking
# testbench once per configuration that test_ROM.js lists in configs.txt ("<config> <top .sv file>").
# Each build and its waveform (tb_ROM_<config>.fst) land in obj_dir/rom_<config>/.
ROM_DIR = ../sv-examples/ROM

rom_sim: tsc
	cd ..; node out/test/modules/test_ROM.js
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --lint-only -Wall $(COMMON_WAIVERS) $(SV_INCLUDES) -I$$(dirname ../$$dut) ../$$dut; \
	  echo "lint -Wall clean: $$dut"; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/rom_$$cfg -o Vtb_ROM \
	    -DCFG_$$cfg -I$(ROM_DIR)/tb $(SV_INCLUDES) -I$$(dirname ../$$dut) tb_ROM.sv ../$$dut > obj_dir/rom_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/rom_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/rom_$$cfg && ./Vtb_ROM); \
	done < $(ROM_DIR)/tb/configs.txt

.PHONY: rom_sim

clean:
	rm -rf obj_dir
	rm -f *.vcd

.PHONY: sfifo_sim sram_sim regblock_read_sim regblock_types_sim registers_sim apb_to_memory_sim twoclockregfile_sim \
  cdcsynchronizer_sim graypointer_sim afifo_sim
.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.sv: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/addRegister_tb.sv: tsc
	cd ..; node out/test/test_addRegister.js
