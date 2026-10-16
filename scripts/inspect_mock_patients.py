import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open("src/lib/mock-data.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find patientList
p_start = content.find("export const patientList: PatientListItem[] = [")
p_end = content.find("export const vaccineCoverageData:", p_start)
patient_str = content[p_start:p_end]

# Extract all patient blocks
# pattern: { ... }
blocks = re.findall(r'\{\s*"hn":\s*"[^"]+",[\s\S]*?\}', patient_str)
print(f"Total blocks found in mock-data.ts: {len(blocks)}")

patients = []
for b in blocks:
    # parse fields with regex
    hn = re.search(r'"hn":\s*"([^"]+)"', b)
    name = re.search(r'"name":\s*"([^"]+)"', b)
    age = re.search(r'"age":\s*(\d+)', b)
    exp_date = re.search(r'"exposure_date":\s*"([^"]+)"', b)
    year = re.search(r'"year":\s*"([^"]+)"', b)
    wound_cat = re.search(r'"wound_category":\s*"([^"]+)"', b)
    vax_status = re.search(r'"vaccine_status":\s*"([^"]+)"', b)
    follow_up = re.search(r'"follow_up_status":\s*"([^"]+)"', b)
    district = re.search(r'"district":\s*"([^"]+)"', b)
    subdistrict = re.search(r'"subdistrict":\s*"([^"]+)"', b)
    v_name = re.search(r'"village_name":\s*"([^"]+)"', b)
    v_no = re.search(r'"village_no":\s*"([^"]+)"', b)
    
    patients.append({
        "hn": hn.group(1) if hn else "",
        "name": name.group(1) if name else "",
        "age": int(age.group(1)) if age else 0,
        "exposure_date": exp_date.group(1) if exp_date else "",
        "year": year.group(1) if year else "",
        "wound_category": wound_cat.group(1) if wound_cat else "II",
        "vaccine_status": vax_status.group(1) if vax_status else "ครบชุด",
        "follow_up_status": follow_up.group(1) if follow_up else "completed",
        "district": district.group(1) if district else "",
        "subdistrict": subdistrict.group(1) if subdistrict else "",
        "village_name": v_name.group(1) if v_name else "",
        "village_no": v_no.group(1) if v_no else ""
    })

print("First 5 patients:", json.dumps(patients[:5], ensure_ascii=False, indent=2))
print("Last 5 patients:", json.dumps(patients[-5:], ensure_ascii=False, indent=2))

# Check for duplicate names
names = [p["name"] for p in patients]
from collections import Counter
c = Counter(names)
dups = {k: v for k, v in c.items() if v > 1}
print(f"Total distinct names: {len(c)}")
print(f"Names appearing multiple times: {len(dups)}")
for k, v in list(dups.items())[:10]:
    print(f"  {k}: {v} times")
