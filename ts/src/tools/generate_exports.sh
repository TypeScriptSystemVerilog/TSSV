#!/bin/bash

# Define the paths
INTERFACES_DIR="/Users/bennettva/TSSV/ts/src/interfaces/AMBA"
OUTPUT_FILE="/Users/bennettva/TSSV/ts/src/tools/index.ts"

# Create or clear the output file
echo "// Auto-generated index file" > "$OUTPUT_FILE"

# Function to recursively find .ts files and generate export statements
generate_exports() {
  local dir_path="$1"
  local prefix="$2"

  for file_path in "$dir_path"/*; do
    if [ -d "$file_path" ]; then
      # Recursively process subdirectories
      generate_exports "$file_path" "$prefix/$(basename "$file_path")"
    elif [ -f "$file_path" ]; then
      # Process .ts files
      if [[ "$file_path" == *.ts ]]; then
        local file_name=$(basename "$file_path" .ts)
        local relative_path="$prefix/$file_name"
        echo "export { default as $file_name } from \"$relative_path\";" >> "$OUTPUT_FILE"
      fi
    fi
  done
}

# Start generating exports from the root of the interfaces directory
generate_exports "$INTERFACES_DIR" "."

echo "Exports generated in $OUTPUT_FILE"
