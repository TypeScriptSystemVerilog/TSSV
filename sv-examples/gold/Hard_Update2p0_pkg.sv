package Hard_Update2p0_pkg;

// =============================================================================
// Register bit field definition
// Commit ID: 20a6af013fd07393de4c64eaf9009a282150fbc9
// =============================================================================

typedef struct packed {
  logic [31: 0] wptr;
} WPTR_t;

typedef struct packed {
  logic [31: 0] fetch_rptr;
} FETCH_RPTR_t;

endpackage : Hard_Update2p0_pkg
