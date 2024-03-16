echo "# Simple FIR Filter Example" > example.md
echo "### Implementation" >> example.md
echo "\`\`\`typescript" >> example.md
cat ../ts/src/modules/FIR.ts >> example.md
echo "\`\`\`" >> example.md

echo "### Test Program" >> example.md
echo "\`\`\`typescript" >> example.md
cat ../ts/test/test_FIR.ts >> example.md
echo "\`\`\`" >> example.md


echo "### Generated SystemVerilog" >> example.md
echo "#### Example 1" >> example.md
echo "\`\`\`systemverilog" >> example.md
cat ../sv-examples/test_FIR_output/myFIR.sv >> example.md
echo "\`\`\`" >> example.md

echo "#### Example 2" >> example.md
echo "\`\`\`systemverilog" >> example.md
cat ../sv-examples/test_FIR_output/FIR_1pmlbrs_8_9_2.sv >> example.md
echo "\`\`\`" >> example.md

echo "#### Example 3" >> example.md
echo "\`\`\`systemverilog" >> example.md
cat ../sv-examples/test_FIR_output/myFIR3.sv >> example.md
echo "\`\`\`" >> example.md

mkdir -p typedoc/docs
markdown example.md > typedoc/docs/example.md

