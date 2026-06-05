import sys
import os
import csv

def remove_duplicates(sram_list_file, sram_list_old_file, exist_file):
    if not os.path.exists(sram_list_file):
        print("Error: {} not found!".format(sram_list_file))
        sys.exit(1)

    if not os.path.exists(sram_list_old_file):
        print("Error: {} not found!".format(sram_list_old_file))
        sys.exit(1)
    if not os.path.exists(exist_file):
        open(exist_file,'w').close()
    old_sram = {}
    with open(sram_list_old_file, 'r') as old_file:
        reader = csv.reader(old_file)
        next(reader)
        for row in reader:
            if len(row) >= 6:
                key = (row[1], row[2], row[3], row[4], row[5])
                old_sram[key]= tuple(row)
  
        temp_file = 'sram_list_temp.csv'
        with open(sram_list_file, 'r') as list_file, open(temp_file, 'w') as tmp_file, open(exist_file,'a') as exist_writer:
            reader = csv.reader(list_file)
            writer = csv.writer(tmp_file)
            exist_writer = csv.writer(exist_writer)
                            
            for row in reader:
                if len(row) >= 6:
                    key = (row[1], row[2], row[3], row[4], row[5])
                    #print(key)
                    if key not in old_sram:
                        # If the line is not duplicated, keep it
                        writer.writerow(row)
                    else:
                        # If duplicate, log the removal
                        exist_writer.writerow(old_sram[key])
                        print("Duplicate entry removed: Frequency: {}, Port: {}, Width: {}, Depth: {}, SW: {}".format(row[1],row[2],row[3],row[4],row[5]))
        # Replace the old sram_list.csv with the new one (without duplicates)
        os.rename(temp_file, sram_list_file)
        print("{} has been updated. Duplicates have been removed.".format(sram_list_file))

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python check_csv_duplicates.py <sram_list.csv> <sram_list_old.csv>")
        sys.exit(1)
    sram_list = sys.argv[1]
    sram_list_old = sys.argv[2]
    remove_duplicates(sram_list, sram_list_old,"./sram_list_exist.csv")
