import json
import re

with open("scripts/cells_out.txt", "r", encoding="utf-8") as f:
    text = f.read()

pattern = r'C0:(\d+)\s*;\s*C1:([^;]+);\s*C2:([^;]+);\s*C3:([^;]+);\s*C4:([^;]+);\s*C5:([^;]*);\s*C6:([^;]*);\s*C7:([^;]*);\s*C8:([^;]*);\s*C9:([^;]*);\s*C10:([^;\n]*)'

matches = re.findall(pattern, text)

heads = []
for m in matches:
    def parse_int(v):
        v = v.strip()
        return int(v) if v.isdigit() else 0

    head_no = int(m[0])
    date = m[1].strip()
    subd = m[2].strip()
    dist = m[3].strip()
    spec = m[4].strip()
    c1 = parse_int(m[5])
    c2 = parse_int(m[6])
    c3 = parse_int(m[7])
    complete = parse_int(m[8])
    remark = m[9].strip()

    heads.append({
        "head_no": head_no,
        "date": date,
        "subdistrict": subd,
        "district": dist,
        "species": spec,
        "cat1": c1,
        "cat2": c2,
        "cat3": c3,
        "total": c1 + c2 + c3,
        "complete": complete,
        "remark": remark
    })

with open("scripts/official_heads_summary.json", "w", encoding="utf-8") as out:
    json.dump(heads, out, ensure_ascii=False, indent=2)

print(f"Successfully saved {len(heads)} heads to json.")
