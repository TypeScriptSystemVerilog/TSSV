import { type RegisterBlockDef, RegisterBlock, RegisterType } from 'tssv/lib/core/Registers'
import { Module } from 'tssv/lib/core/TSSV'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import { writeFileSync, mkdirSync } from 'fs'

const apbRegMap = {
  CTRL: BigInt('0x00000000'),
  STATUS: BigInt('0x00000004'),
  DATA: BigInt('0x00000008')
} as const

const apbRegs: RegisterBlockDef<typeof apbRegMap> = {
  wordSize: 32,
  addrMap: apbRegMap,
  registers: {
    CTRL: {
      type: RegisterType.RW,
      reset: 0n,
      description: 'Control register'
    },
    STATUS: {
      type: RegisterType.RO,
      reset: 0n,
      description: 'Status register (read-only)'
    },
    DATA: {
      type: RegisterType.RW,
      reset: 0n,
      description: 'Data register'
    }
  }
}

const apbRegBlock = new RegisterBlock<typeof apbRegMap>(
  {
    name: 'apb_reg_block',
    busAddressWidth: 32
  },
  apbRegs,
  new APB4({ DATA_WIDTH: 32, ADDR_WIDTH: 32 })
)

const tbBody =
`
  logic [15:0] count;

  assign apb.PCLK    = clk;
  assign apb.PRESETn = rst_b;

  always @(posedge clk or negedge rst_b) begin
    if (!rst_b) begin
      count        <= 'd0;
      apb.PSELx    <= 1'b0;
      apb.PENABLE  <= 1'b0;
      apb.PWRITE   <= 1'b0;
      apb.PADDR    <= 32'h0;
      apb.PWDATA   <= 32'h0;
      apb.PSTRB    <= 4'hF;
      apb.PPROT    <= 3'h0;
    end else begin
      count <= count + 1'b1;

      case (count)
        // Write CTRL = 0xDEADBEEF
        'd1: begin
          apb.PSELx  <= 1'b1;
          apb.PWRITE <= 1'b1;
          apb.PADDR  <= 32'h00000000;
          apb.PWDATA <= 32'hDEADBEEF;
          apb.PSTRB  <= 4'hF;
        end
        'd2: apb.PENABLE <= 1'b1;
        'd3: begin apb.PSELx <= 1'b0; apb.PENABLE <= 1'b0; end

        // Write DATA = 0x12345678
        'd4: begin
          apb.PSELx  <= 1'b1;
          apb.PWRITE <= 1'b1;
          apb.PADDR  <= 32'h00000008;
          apb.PWDATA <= 32'h12345678;
          apb.PSTRB  <= 4'hF;
        end
        'd5: apb.PENABLE <= 1'b1;
        'd6: begin apb.PSELx <= 1'b0; apb.PENABLE <= 1'b0; end

        // Read CTRL
        'd7: begin
          apb.PSELx  <= 1'b1;
          apb.PWRITE <= 1'b0;
          apb.PADDR  <= 32'h00000000;
        end
        'd8: apb.PENABLE <= 1'b1;
        'd9: begin apb.PSELx <= 1'b0; apb.PENABLE <= 1'b0; end

        // Read DATA
        'd10: begin
          apb.PSELx  <= 1'b1;
          apb.PWRITE <= 1'b0;
          apb.PADDR  <= 32'h00000008;
        end
        'd11: apb.PENABLE <= 1'b1;
        'd12: begin apb.PSELx <= 1'b0; apb.PENABLE <= 1'b0; end

        // Read STATUS
        'd13: begin
          apb.PSELx  <= 1'b1;
          apb.PWRITE <= 1'b0;
          apb.PADDR  <= 32'h00000004;
        end
        'd14: apb.PENABLE <= 1'b1;
        'd15: begin apb.PSELx <= 1'b0; apb.PENABLE <= 1'b0; end

        'd20: $finish;
        default: ;
      endcase
    end
  end
`

const tb = new Module(
  { name: 'tb_apb_reg_block' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)
tb.addInterface('apb', new APB4({ DATA_WIDTH: 32, ADDR_WIDTH: 32 }))
tb.addSubmodule('dut', apbRegBlock, {}, true, true)

const outDir = 'sv-examples/test_APB_Registers_output'
mkdirSync(outDir, { recursive: true })

try {
  writeFileSync(`${outDir}/tb_apb_reg_block.sv`, tb.writeSystemVerilog())
  console.log(`Generated ${outDir}/tb_apb_reg_block.sv`)
} catch (err) {
  console.error(err)
}
