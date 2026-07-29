TOP_MODULE?=Vtb_lpFIR
VERILOG_FILE?= ../sv-examples/FIR/myFIR3/tb_lpFIR.sv

# Dual-clock async FIFO: self-checking, self-driving testbench built with
# --binary --timing (the generic single-clock sim_main.cpp cannot drive it).
AFIFO_DUT?= ../sv-examples/AFIFO/AFIFO_8_2_none_2/AFIFO_8_2_none_2.sv


run: obj_dir/$(TOP_MODULE)
	obj_dir/$(TOP_MODULE)

afifo_sim: obj_dir_afifo/Vtb_AFIFO
	obj_dir_afifo/Vtb_AFIFO

obj_dir_afifo/Vtb_AFIFO: tb_AFIFO.sv $(AFIFO_DUT) Makefile
	verilator --binary --timing --trace-fst -Wno-fatal -Mdir obj_dir_afifo -o Vtb_AFIFO tb_AFIFO.sv $(AFIFO_DUT)

$(AFIFO_DUT): tsc
	cd ..; node out/test/modules/test_AFIFO.js

obj_dir/$(TOP_MODULE): $(VERILOG_FILE) sim_main.cpp
	verilator --cc $(VERILOG_FILE) --exe --trace-fst  sim_main.cpp -CFLAGS -DTOP_MODULE=$(TOP_MODULE)
	make -C obj_dir TOP_MODULE=$(TOP_MODULE) -j -f $(TOP_MODULE).mk $(TOP_MODULE) 

# Show-ahead synchronous FIFO: a self-checking testbench, built and run once per
# configuration that test_SFIFO.js lists in configs.txt. Each build and its waveform
# (tb_SFIFO_<config>.fst) land in obj_dir/sfifo_<config>/.
SFIFO_TB_DIR = ../sv-examples/SFIFO/tb

sfifo_sim: tsc
	cd ..; node out/test/modules/test_SFIFO.js
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/sfifo_$$cfg -o Vtb_SFIFO \
	    -DCFG_$$cfg -I$(SFIFO_TB_DIR) tb_SFIFO.sv ../$$dut > obj_dir/sfifo_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/sfifo_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/sfifo_$$cfg && ./Vtb_SFIFO); \
	done < $(SFIFO_TB_DIR)/configs.txt

# RegisterBlock read path (TSSV#79): lint both regression blocks with -Wall, then run the
# self-checking testbench against them. regblock_read_waivers.vlt holds the only waivers,
# each for a signal owned by another open bug.
REGBLOCK_DIR = ../sv-examples/RegisterBlock_read

regblock_read_sim: tsc
	cd ..; node out/test/test_RegisterBlock_read.js
	set -e; for b in regblock_read32 regblock_read64; do \
	  verilator --lint-only -Wall --top-module $${b}_lint_top regblock_read_waivers.vlt \
	    $(REGBLOCK_DIR)/$$b.sv $(REGBLOCK_DIR)/$${b}_lint_top.sv; \
	  echo "lint -Wall clean: $$b"; \
	done
	mkdir -p obj_dir
	verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/regblock_read -o Vtb_RegisterBlock_read \
	  tb_RegisterBlock_read.sv $(REGBLOCK_DIR)/regblock_read32.sv $(REGBLOCK_DIR)/regblock_read64.sv \
	  $(REGBLOCK_DIR)/memory_models.sv \
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
	  verilator --lint-only -Wall --top-module $${b}_lint_top regblock_types_waivers.vlt \
	    $(TYPES_DIR)/$$b.sv $(TYPES_DIR)/$${b}_lint_top.sv; \
	  echo "lint -Wall clean: $$b"; \
	  verilator --binary --timing --trace-fst -j 0 -Mdir obj_dir/$$b -o Vtb_$$b --top-module tb_$$b \
	    $(TYPES_DIR)/tb_$$b.sv $(TYPES_DIR)/$$b.sv $(TYPES_DIR)/memory_models.sv \
	    > obj_dir/$$b.build.log 2>&1 || { cat obj_dir/$$b.build.log; exit 1; }; \
	  (cd obj_dir/$$b && ./Vtb_$$b); \
	done

# TSSV#116: ts/test/test_APB_to_Memory.ts writes a RegisterBlock with an APB port, so its
# APB_to_Memory submodule drives the block's Memory bus. This lints the block with -Wall and runs
# a self-checking APB testbench against it. apb_to_memory_waivers.vlt holds the only waivers.
APB_DIR = ../sv-examples/APB_to_Memory

apb_to_memory_sim: tsc
	cd ..; node out/test/test_APB_to_Memory.js
	verilator --lint-only -Wall --top-module apb_regblock_lint_top apb_to_memory_waivers.vlt \
	  $(APB_DIR)/apb_regblock.sv $(APB_DIR)/apb_regblock_lint_top.sv
	@echo "lint -Wall clean: apb_regblock"
	mkdir -p obj_dir
	verilator --binary --timing -j 0 -Mdir obj_dir/apb_to_memory -o Vtb_APB_to_Memory \
	  tb_APB_to_Memory.sv $(APB_DIR)/apb_regblock.sv $(APB_DIR)/memory_models.sv \
	  > obj_dir/apb_to_memory.build.log 2>&1 || { cat obj_dir/apb_to_memory.build.log; exit 1; }
	cd obj_dir/apb_to_memory && ./Vtb_APB_to_Memory

# Two-clock register file (TSSV#121): lint every generated variant with -Wall, then run the
# self-checking testbench once per configuration that test_TwoClockRegFile.js lists in
# configs.txt. Each build and its waveform (tb_TwoClockRegFile_<config>.fst) land in
# obj_dir/twoclockregfile_<config>/. b_clk's period is a variable that's never zero, hence
# --no-sched-zero-delay.
TCRF_DIR = ../sv-examples/TwoClockRegFile

twoclockregfile_sim: tsc
	cd ..; node out/test/modules/test_TwoClockRegFile.js
	set -e; for f in $(TCRF_DIR)/TwoClockRegFile_*/*.sv; do \
	  verilator --lint-only -Wall $$f; \
	  echo "lint -Wall clean: $$f"; \
	done
	mkdir -p obj_dir
	set -e; while read -r cfg dut; do \
	  verilator --binary --timing --no-sched-zero-delay --trace-fst -j 0 -Mdir obj_dir/twoclockregfile_$$cfg -o Vtb_TwoClockRegFile \
	    -DCFG_$$cfg -I$(TCRF_DIR)/tb tb_TwoClockRegFile.sv ../$$dut > obj_dir/twoclockregfile_$$cfg.build.log 2>&1 \
	    || { cat obj_dir/twoclockregfile_$$cfg.build.log; exit 1; }; \
	  (cd obj_dir/twoclockregfile_$$cfg && ./Vtb_TwoClockRegFile); \
	done < $(TCRF_DIR)/tb/configs.txt

clean:
	rm -rf obj_dir obj_dir_afifo

.PHONY: sfifo_sim regblock_read_sim regblock_types_sim apb_to_memory_sim twoclockregfile_sim
.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.sv: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/regMod.sv: tsc
	cd ..; node out/test/test_addRegister.js
