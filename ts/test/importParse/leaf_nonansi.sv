// non-ANSI module header: module wrongname
module leaf_nonansi (a, en, y, sy);
  parameter W = 8;
  input [W-1:0] a;
  input en;
  output [W-1:0] y;
  output signed [3:0] sy;
  function automatic logic [W-1:0] pick (input logic [W-1:0] y, input logic en);
    return en ? y : '0;
  endfunction
  assign y = pick(a, en);
  assign sy = '0;
endmodule
