package AIGC_DEMO_reg_pkg;

// =============================================================================
// Register bit field definition
// =============================================================================

typedef struct packed {
  logic [31: 0] wptr;
} WPTR_t;

typedef struct packed {
  logic [31: 0] fetch_rptr;
} FETCH_RPTR_t;

endpackage : AIGC_DEMO_reg_pkg
