# Test scripts that need tools outside the pinned toolchain (README Setup), so
# they can't run here or in CI. Sourced by runAllTests.sh and scripts/gen-sv.
#   test_AXI4XBar: runs Rocket Chip's Scala generator, via Docker
#                  (third-party/rocket-chip-component-gen)
skip=(out/test/modules/test_AXI4XBar.js)
