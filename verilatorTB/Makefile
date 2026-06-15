TOP_MODULE?=Vtb_lpFIR
VERILOG_FILE?= ../sv-examples/FIR/myFIR3/tb_lpFIR.sv


run: obj_dir/$(TOP_MODULE)
	obj_dir/$(TOP_MODULE)

obj_dir/$(TOP_MODULE): $(VERILOG_FILE) sim_main.cpp
	verilator --cc $(VERILOG_FILE) --exe --trace  sim_main.cpp -CFLAGS -DTOP_MODULE=$(TOP_MODULE)
	make -C obj_dir TOP_MODULE=$(TOP_MODULE) -j -f $(TOP_MODULE).mk $(TOP_MODULE) 

clean:
	rm -rf obj_dir
	rm -f *.vcd

.FORCE:
tsc: .FORCE
	cd ..; npx tsc


../sv-examples/FIR/myFIR3/tb_lpFIR.sv: tsc
	cd ..; node out/test/test_FIR.js

../sv-examples/Core/addRegister/regMod.sv: tsc
	cd ..; node out/test/test_addRegister.js
