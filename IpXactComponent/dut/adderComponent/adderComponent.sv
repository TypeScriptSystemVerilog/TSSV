`ifndef DEF__adderComponent__
`define DEF__adderComponent__
`ifdef USE_INCLUDES
`include "APB_16_32.sv"
`include "apb_adder.sv"
`endif //USE_INCLUDES

module adderComponent (
    APB_16_32.inward Init0
);

  // ------------------------------------------------------------------
  // Parameters
  // ------------------------------------------------------------------
  // moduleName = apb_adder
  // svContents = 1187 bytes, hash ekyus0p4, from $TSSV_ROOT/ts/test/modules/IpxactComponent/Adder/apb_adder.sv
  // xmlContents = 5572 bytes, hash 9ktbcuxy, from $TSSV_ROOT/ts/test/modules/IpxactComponent/Adder/adder.xml
  // ------------------------------------------------------------------

  // Bus inputs that no port of apb_adder reads
  /* verilator lint_off UNUSEDSIGNAL */
  logic unused_bus_inputs;
  /* verilator lint_on UNUSEDSIGNAL */
  assign unused_bus_inputs = ^{Init0.PCLKEN};

  apb_adder u_ip (
      .pclk(Init0.PCLK),
      .presetn(Init0.PRESETn),
      .paddr(Init0.PADDR),
      .psel(Init0.PSELx),
      .penable(Init0.PENABLE),
      .pwrite(Init0.PWRITE),
      .pwdata(Init0.PWDATA),
      .prdata(Init0.PRDATA),
      .pready(Init0.PREADY),
      .pslverr(Init0.PSLVERR)
  );

endmodule

`endif //!DEF__adderComponent__
