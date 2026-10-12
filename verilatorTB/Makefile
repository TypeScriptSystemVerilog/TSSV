TOP_MODULE?=Vtb_lpFIR
VERILOG_FILE?= ../sv-examples/FIR/myFIR3/tb_lpFIR.sv


run: obj_dir/$(TOP_MODULE)
	obj_dir/$(TOP_MODULE)

obj_dir/$(TOP_MODULE): $(VERILOG_FILE) sim_main.cpp
	verilator --cc $(VERILOG_FILE) --exe --trace  sim_main.cpp -CFLAGS -DTOP_MODULE=$(TOP_MODULE)
	make -C obj_dir TOP_MODULE=$(TOP_MODULE) -j -f $(TOP_MODULE).mk $(TOP_MODULE) 

# Show-ahead synchronous FIFO: a self-checking testbench, built and run once per
# configuration that test_SFIFO.js lists in configs.txt. Each build and its waveform
# (tb_SFIFO_<config>.fst) land in obj_dir/sfifo_<config>/.
SFIFO_TB_DIR = ../sv-examples/SFIFO/tb

sfifo_sim: tsc
	cd ..; node out/test/modules/test_SFIFO.js
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
	  > obj_dir/regblock_read.build.log 2>&1 || { cat obj_dir/regblock_read.build.log; exit 1; }
	cd obj_dir/regblock_read && ./Vtb_RegisterBlock_read

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
	  tb_APB_to_Memory.sv $(APB_DIR)/apb_regblock.sv \
	  > obj_dir/apb_to_memory.build.log 2>&1 || { cat obj_dir/apb_to_memory.build.log; exit 1; }
	cd obj_dir/apb_to_memory && ./Vtb_APB_to_Memory

clean:
	rm -rf obj_dir
	rm -f *.vcd

.PHONY: sfifo_sim regblock_read_sim apb_to_memory_sim
.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.sv: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/regMod.sv: tsc
	cd ..; node out/test/test_addRegister.js
