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

clean:
	rm -rf obj_dir obj_dir_afifo

.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.sv: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/regMod.sv: tsc
	cd ..; node out/test/test_addRegister.js
