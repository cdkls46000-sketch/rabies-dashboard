import json

with open(r"D:\GRAVITY\Rabies\scripts\official_summary.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

heads = []
for line in lines:
    line = line.strip()
    if line.startswith("Row ") and " | " in line:
        parts = [p.strip() for p in line.split(" | ")]
        # Row 2: 1 | 12 กุมภาพันธ์ 2569 | โนนสูง | ยางตลาด | สุนัข | 2 | | | | ประสงค์ไม่ฉีด 2 คน | ปกติ
        # Check if first part after 'Row X: ' is a number 1..32
        first_token = parts[0].replace("Row ", "").split(":")[1].strip() if ":" in parts[0] else ""
        if first_token.isdigit():
            head_no = int(first_token)
            date_str = parts[1] if len(parts) > 1 else ""
            subdistrict = parts[2] if len(parts) > 2 else ""
            district = parts[3] if len(parts) > 3 else ""
            species = parts[4] if len(parts) > 4 else ""
            cat1 = int(parts[5]) if len(parts) > 5 and parts[5].isdigit() else 0
            cat2 = int(parts[6]) if len(parts) > 6 and parts[6].isdigit() else 0
            cat3 = int(parts[7]) if len(parts) > 7 and parts[7].isdigit() else 0
            complete_vax = int(parts[8]) if len(parts) > 8 and parts[8].isdigit() else 0
            remark = parts[9] if len(parts) > 9 else ""
            heads.append({
                "head_no": head_no,
                "date": date_str,
                "subdistrict": subdistrict,
                "district": district,
                "species": species,
                "cat1": cat1,
                "cat2": cat2,
                "cat3": cat3,
                "total_exposures": cat1 + cat2 + cat3,
                "complete_vax": complete_vax,
                "remark": remark
            })

print(f"Total positive heads: {len(heads)}")
total_cat1 = sum(h["cat1"] for h in heads)
total_cat2 = sum(h["cat2"] for h in heads)
total_cat3 = sum(h["cat3"] for h in heads)
total_all = sum(h["total_exposures"] for h in heads)

print(f"Cat 1: {total_cat1}")
print(f"Cat 2: {total_cat2}")
print(f"Cat 3: {total_cat3}")
print(f"Total Exposures: {total_all}")

for h in heads:
    print(f"Head {h['head_no']:02d}: {h['date']} | {h['subdistrict']} {h['district']} | {h['species']} | Cat1={h['cat1']} Cat2={h['cat2']} Cat3={h['cat3']} Total={h['total_exposures']} | remark: {h['remark']}")
