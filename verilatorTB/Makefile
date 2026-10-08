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

clean:
	rm -rf obj_dir
	rm -f *.vcd

.PHONY: sfifo_sim
.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.sv: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/regMod.sv: tsc
	cd ..; node out/test/test_addRegister.js
