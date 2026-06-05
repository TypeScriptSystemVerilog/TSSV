function generateAPBStr(AIGCStr: string, mappings: Record<string, string>): string {
    let APBStr = AIGCStr;
  
    // Replace the mappings in the AIGCStr
    for (const [key, value] of Object.entries(mappings)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      APBStr = APBStr.replace(regex, value);
    }
  
    return APBStr;
  }
  
  // Example usage
  const AIGCStr = `
  begin
    reg_wr = psel && penable && pwrite;
    reg_rd = psel && !penable && !pwrite;
    reg_addr = paddr;
    reg_wdata = pwdata;
    prdata = reg_rdata;
    
    pready = 1'b1;
  end
  `;
  
  
  const mappings = {
    psel: 'regs.PSELx',
    penable: 'regs.PENABLE',
    pwrite: 'regs.PWRITE',
    paddr: 'regs.PADDR',
    pwdata: 'regs.PWDATA',
    prdata: 'regs.PRDATA',
    pready: 'regs.PREADY'
  };
  
  const APBStr = generateAPBStr(AIGCStr, mappings);
  console.log(APBStr);