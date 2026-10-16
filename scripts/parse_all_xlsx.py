import openpyxl
import os
import glob
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"D:\GRAVITY\Rabies\Rabies 2026  ข้อมูล ณ วันที่ 15 ตุลาคม 2569"

xlsx_files = glob.glob(os.path.join(base_dir, "**", "*.xlsx"), recursive=True)
print(f"Total xlsx files: {len(xlsx_files)}")

# Let's inspect the files
file_records = []
for f in sorted(xlsx_files):
    rel_path = os.path.relpath(f, base_dir)
    try:
        wb = openpyxl.load_workbook(f, data_only=True)
        sheet = wb.active
        rows = list(sheet.iter_rows(values_only=True))
        file_records.append({
            "path": rel_path,
            "max_row": len(rows),
            "rows": rows
        })
    except Exception as e:
        print(f"Error {rel_path}: {e}")

print(f"Loaded {len(file_records)} files.")
