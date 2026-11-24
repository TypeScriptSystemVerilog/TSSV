`ifndef DEF__apbComponent__
`define DEF__apbComponent__
`ifdef USE_INCLUDES
`include "APB_53_1024.sv"
`include "apbArchitecture.sv"
`endif //USE_INCLUDES

module apbComponent (
    APB_53_1024.inward  Init1,
    APB_53_1024.inward  Init0,
    APB_53_1024.outward Targ1,
    APB_53_1024.outward Targ0
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // moduleName = Specification_Architecture_Structure
  // svContents = 2059 bytes, hash iho69awl, from $TSSV_ROOT/ts/test/modules/IpxactComponent/APB/apbArchitecture.sv
  // xmlContents = 45675 bytes, hash glkntad8, from $TSSV_ROOT/ts/test/modules/IpxactComponent/APB/apbSample.xml
  // ------------------------------------------------------------------
  const logic const_w1u0 = 1'd0;

  // Inputs of Specification_Architecture_Structure that the XML maps to no bus signal, tied to 0: tm
  // Bus inputs that no port of Specification_Architecture_Structure reads
  /* verilator lint_off UNUSEDSIGNAL */
  logic unused_bus_inputs;
  /* verilator lint_on UNUSEDSIGNAL */
  assign unused_bus_inputs = ^{Init1.PCLK, Init1.PRESETn, Init1.PCLKEN, Init0.PCLK, Init0.PRESETn, Init0.PCLKEN, Targ1.PRESETn, Targ1.PCLKEN, Targ0.PCLKEN};

  Specification_Architecture_Structure u_ip (
      .Init1_P_Addr(Init1.PADDR),
      .Init1_P_Selx(Init1.PSELx),
      .Init1_P_Enable(Init1.PENABLE),
      .Init1_P_Write(Init1.PWRITE),
      .Init1_P_RData(Init1.PRDATA),
      .Init1_P_WData(Init1.PWDATA),
      .Init1_P_Ready(Init1.PREADY),
      .Init1_P_SlvErr(Init1.PSLVERR),
      .node1_pclk(Targ1.PCLK),
      .noc_prstn(Targ0.PRESETn),
      .Init0_P_Addr(Init0.PADDR),
      .Init0_P_Selx(Init0.PSELx),
      .Init0_P_Enable(Init0.PENABLE),
      .Init0_P_Write(Init0.PWRITE),
      .Init0_P_RData(Init0.PRDATA),
      .Init0_P_WData(Init0.PWDATA),
      .Init0_P_Ready(Init0.PREADY),
      .Init0_P_SlvErr(Init0.PSLVERR),
      .node0_pclk(Targ0.PCLK),
      .Targ1_P_Addr(Targ1.PADDR),
      .Targ1_P_Selx(Targ1.PSELx),
      .Targ1_P_Enable(Targ1.PENABLE),
      .Targ1_P_Write(Targ1.PWRITE),
      .Targ1_P_RData(Targ1.PRDATA),
      .Targ1_P_WData(Targ1.PWDATA),
      .Targ1_P_Ready(Targ1.PREADY),
      .Targ1_P_SlvErr(Targ1.PSLVERR),
      .Targ0_P_Addr(Targ0.PADDR),
      .Targ0_P_Selx(Targ0.PSELx),
      .Targ0_P_Enable(Targ0.PENABLE),
      .Targ0_P_Write(Targ0.PWRITE),
      .Targ0_P_RData(Targ0.PRDATA),
      .Targ0_P_WData(Targ0.PWDATA),
      .Targ0_P_Ready(Targ0.PREADY),
      .Targ0_P_SlvErr(Targ0.PSLVERR),
      .tm(const_w1u0)
  );

endmodule

`endif //!DEF__apbComponent__
