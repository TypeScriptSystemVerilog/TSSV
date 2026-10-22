// A sample IP for IpXactComponent (doc/modules/IpXactComponent/IpXactComponent-spec.md): an
// adder behind an APB target port. Write the operands to A (0x0) and B (0x4), and read their sum,
// modulo 2^32, from SUM (0x8). adder.xml describes it.
module apb_adder (
    input  logic        pclk,
    input  logic        presetn,
    input  logic [15:0] paddr,
    input  logic        psel,
    input  logic        penable,
    input  logic        pwrite,
    input  logic [31:0] pwdata,
    output logic [31:0] prdata,
    output logic        pready,
    output logic        pslverr
);
  logic [31:0] a_q;
  logic [31:0] b_q;
  logic        wr;

  assign wr = psel & penable & pwrite;

  always_ff @(posedge pclk or negedge presetn) begin : operands
    if (!presetn) begin
      a_q <= '0;
      b_q <= '0;
    end else if (wr) begin
      if (paddr == 16'h0) a_q <= pwdata;
      if (paddr == 16'h4) b_q <= pwdata;
    end
  end

  always_comb begin : read_data
    case (paddr)
      16'h0:   prdata = a_q;
      16'h4:   prdata = b_q;
      16'h8:   prdata = 32'(a_q + b_q);
      default: prdata = '0;
    endcase
  end

  assign pready  = 1'b1;
  assign pslverr = 1'b0;
endmodule
