#!/usr/bin/env python3
import csv
import sys
import os


def csv_to_ralf(csv_filename, dst_filename, block_bytes=4):
    #block_name = os.path.splitext(os.path.basename(csv_filename))[0]
    with open(csv_filename, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        rows = list(csvreader)

    with open(dst_filename, 'w') as file_obj:
        print(f"Processing CSV file: {csv_filename}")    
        # CSV Column Index
        header = rows[0]
        block_column = header.index('Block Name')
        reg_column = header.index('Register Name')
        block_address_column = header.index('Block Offset')
        reg_address_column = header.index('Register Offset')
        repeat_column = header.index('Repeat')

        reg_access_column = header.index('Access Mode(RW/RO/WO/W1C/W1T/W1S)')
        field_column = header.index('Field')
        field_access_column = header.index('Access Type(RW/RO/WO/W1C/W1T/W1S)')
        reset_value_column = header.index('Reset Value')
        bits_column = header.index('Bits')
        function_column = header.index('Field Description')

        incr = block_bytes
        curBlkNm = ''
        curBlkOffset = ''
        curRegName = ''
        start_address = 0
        reg_access = ''
        repeat = 1

        # start from 2nd row, as 1st is header
        i = 1
        firstBlk = True
        while i < len(rows) and i < 10000:        
            row = rows[i]
            print(f"Processing row {i}: {row}")
            if (row[block_column] != '') :
                curBlkNm = row[block_column]
                curBlkOffset = row[block_address_column]
                if firstBlk == True:
                    
                    firstBlk = False
                else:
                    file_obj.write("}\n")
                    
                file_obj.write(f"block {curBlkNm} {{\n")
                file_obj.write(f"    bytes {block_bytes};\n")                    
                i += 1
                continue
            if (row[block_column] == '' and row[reg_column] == '' and row[field_column] == ''):
                i += 1
                continue


            
            if (row[reg_column] != '') :
                curRegName = row[reg_column]
                start_address = int(curBlkOffset, 16) + int(row[reg_address_column], 16)
                if not row[repeat_column] or row[repeat_column].strip() == '1':
                    repeat = 1
                else:
                    repeat = int(row[repeat_column].strip())
                reg_access = row[reg_access_column]
                i += 1
                continue

            if (repeat == 1) :
                reg_addr = f"0x{start_address:X}"
                file_obj.write(f"    register {curRegName} @{reg_addr} {{\n")
                file_obj.write(f"    bytes {block_bytes};\n")
                #file_obj.write(f"        left_to_right;\n")

                # Process all fields of this register
                fields = []
                while i < len(rows) and rows[i][reg_column] == '' and rows[i][field_column] != '':
                    row = rows[i]
                    field_name = row[field_column]
                    field_access = row[field_access_column]
                    field_reset = str(row[reset_value_column])  # remove 0x prefix
                    field_bits = row[bits_column]

                    if ':' in field_bits:
                        bit_start, bit_end = field_bits.split(':')
                        field_bit_start = int(bit_end)
                        field_bit_end = int(bit_start)
                        field_bits_count = field_bit_end - field_bit_start + 1
                    else:
                        field_bit_start = field_bit_end = int(field_bits)
                        field_bits_count = 1

                    # Field Info
                    fields.append({
                        'name': field_name,
                        'access': field_access,
                        'reset': field_reset,
                        'bit_start': field_bit_start,
                        'bit_end': field_bit_end,
                        'bits_count': field_bits_count
                    })
                    i += 1

                # sort field_bit_start from low to high
                fields.sort(key=lambda field: field['bit_start'])
                for field in fields:
                    if field['bit_start'] == 0:
                        file_obj.write(f"        field {field['name']} {{\n")
                    else:
                        file_obj.write(f"        field {field['name']} @ {field['bit_start']} {{\n")
                    file_obj.write(f"            bits {field['bits_count']};\n")
                    file_obj.write(f"            reset {field['reset']};\n")
                    file_obj.write(f"            access {field['access'].lower()};\n")
                    file_obj.write("        }\n")

                file_obj.write("    }\n")

            else:  # repeat > 1
                for j in range(repeat):
                    reg_name = f"{curRegName}_{j}"
                    reg_offset = start_address + j * block_bytes
                    reg_addr = f"0x{reg_offset:X}"
                    file_obj.write(f"    register {reg_name} @{reg_addr} {{\n")
                    file_obj.write(f"    bytes {block_bytes};\n")
                    file_obj.write(f"        left_to_right;\n")

                    fields = []
                    k = i
                    while k < len(rows) and rows[k][reg_column] == '' and rows[k][field_column] != '':
                        row = rows[k]
                        field_name = row[field_column]
                        field_access = row[field_access_column]
                        field_reset = str(row[reset_value_column]) 
                        field_bits = row[bits_column]

                        if ':' in field_bits:
                            bit_start, bit_end = field_bits.split(':')
                            field_bit_start = int(bit_end)
                            field_bit_end = int(bit_start)
                            field_bits_count = field_bit_end - field_bit_start + 1
                        else:
                            field_bit_start = field_bit_end = int(field_bits)
                            field_bits_count = 1

                        fields.append({
                            'name': field_name,
                            'access': field_access,
                            'reset': field_reset,
                            'bit_start': field_bit_start,
                            'bit_end': field_bit_end,
                            'bits_count': field_bits_count
                        })
                        k += 1
                    fields.sort(key=lambda field: field['bit_start'])
                    for field in fields:
                        if field['bit_start'] == 0:
                            file_obj.write(f"        field {field['name']} {{\n")
                        else:
                            file_obj.write(f"        field {field['name']} @ {field['bit_start']} {{\n")
                        file_obj.write(f"            bits {field['bits_count']};\n")
                        file_obj.write(f"            reset {field['reset']};\n")
                        file_obj.write(f"            access {field['access'].lower()};\n")
                        file_obj.write("        }\n")

                    file_obj.write("    }\n")
                    if j == repeat - 1:
                        i = k + 1

        file_obj.write("}\n")
    print("Finished processing the CSV file into the RALF format.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python csv2ralf.py <input_csv_file> <output_ralf_file> [block_bytes]")
        sys.exit(1)

    csv_filename = sys.argv[1]
    dst_filename = sys.argv[2]
    block_bytes = int(sys.argv[3]) if len(sys.argv) > 3 else 4

    csv_to_ralf(csv_filename, dst_filename, block_bytes)