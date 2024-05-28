#include <iostream>


#define STRINGIFY(x) #x
#define TOSTRING(x) STRINGIFY(x)

#ifndef MAX_CYCLES
#define MAX_CYCLES 1000
#endif

#ifndef RESET_SIG
#define RESET_SIG rst_b
#endif

#ifndef CLOCK_SIG
#define CLOCK_SIG clk
#endif

#ifndef TOP_MODULE
#define TOP_MODULE Vtb_lpFIR
#endif

#define TOP_MODULE_H TOSTRING(TOP_MODULE.h)
#define WAVEFORM_FILE TOSTRING(TOP_MODULE.vcd)

#include TOP_MODULE_H
#include "verilated.h"
#include "verilated_vcd_c.h"

vluint64_t sim_time = 0;
int main(int argc, char **argv, char **env)
{
        Verilated::commandArgs(argc, argv);
	Verilated::traceEverOn(true);
        TOP_MODULE *top = new TOP_MODULE;
	VerilatedVcdC *m_trace = new VerilatedVcdC;
	top->trace(m_trace, 5);
	m_trace->open(WAVEFORM_FILE);
	int count = 0;
	top->RESET_SIG = 0;
	top->CLOCK_SIG = 0;
        while (!Verilated::gotFinish() && (count < (2*MAX_CYCLES)))
        {
                top->CLOCK_SIG ^= 1;
                top->eval();
		m_trace->dump(sim_time);
		sim_time++;
		count++;
		if(count == 6) {
		  top->RESET_SIG = 1;
		}
        }
	m_trace->close();
        delete top;
        exit(0);
}
