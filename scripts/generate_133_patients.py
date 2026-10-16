import json
import re

# Read current mock-data.ts to get real extracted patient names
with open("src/lib/mock-data.ts", "r", encoding="utf-8") as f:
    content = f.read()

p_start = content.find("export const patientList: PatientListItem[] = [")
p_end = content.find("export const vaccineCoverageData:", p_start)
patient_str = content[p_start:p_end]

blocks = re.findall(r'\{\s*"hn":\s*"[^"]+",[\s\S]*?\}', patient_str)

extracted_names = []
for b in blocks:
    name_m = re.search(r'"name":\s*"([^"]+)"', b)
    age_m = re.search(r'"age":\s*(\d+)', b)
    v_name_m = re.search(r'"village_name":\s*"([^"]+)"', b)
    v_no_m = re.search(r'"village_no":\s*"([^"]+)"', b)
    if name_m:
        extracted_names.append({
            "name": name_m.group(1),
            "age": int(age_m.group(1)) if age_m else 42,
            "village_name": v_name_m.group(1) if v_name_m else "",
            "village_no": v_no_m.group(1) if v_no_m else ""
        })

print(f"Available extracted names from excel: {len(extracted_names)}")

# We have 32 heads
with open("scripts/official_heads_summary.json", "r", encoding="utf-8") as f:
    heads = json.load(f)

# District coordinates mapping for Kalasin
district_coords = {
    'อ.เมืองกาฬสินธุ์': [16.4322, 103.5065],
    'อ.ยางตลาด': [16.4011, 103.3552],
    'อ.กมลาไสย': [16.3385, 103.5765],
    'อ.สมเด็จ': [16.7028, 103.7503],
    'อ.กุฉินารายณ์': [16.5398, 104.0504],
    'อ.สหัสขันธ์': [16.7142, 103.5186],
    'อ.คำม่วง': [16.9422, 103.6274],
    'อ.ท่าคันโท': [16.9482, 103.2427],
    'อ.หนองกุงศรี': [16.6578, 103.3005],
    'อ.ห้วยเม็ก': [16.5925, 103.2344],
    'อ.ห้วยผึ้ง': [16.6215, 103.8821],
    'อ.นามน': [16.5684, 103.7845],
    'อ.ร่องคำ': [16.2736, 103.7432],
    'อ.เขาวง': [16.6854, 104.0911],
    'อ.นาคู': [16.7388, 104.0489],
    'อ.ดอนจาน': [16.4673, 103.6492],
    'อ.สามชัย': [16.8521, 103.5511],
    'อ.ฆ้องชัย': [16.2945, 103.4532],
}

# In official summary row 15: Cat 1 = 89, Cat 2 = 32, Cat 3 = 12, Total = 133
# Head 29 (นาจารย์) had 0 in the sum row
for h in heads:
    if h["head_no"] == 29:
        h["cat1"] = 0

patients_133 = []
hn_counter = 1
name_idx = 0

for h in heads:
    dist = f"อ.{h['district']}" if not h['district'].startswith('อ.') else h['district']
    subd = f"ต.{h['subdistrict']}" if not h['subdistrict'].startswith('ต.') else h['subdistrict']
    coords = district_coords.get(dist, [16.4322, 103.5065])
    
    # Cat 1:
    for i in range(h['cat1']):
        p_info = extracted_names[name_idx % len(extracted_names)]
        name_idx += 1
        
        hn = f"KS69{hn_counter:03d}"
        hn_counter += 1
        
        v_no = p_info["village_no"] or f"{((hn_counter % 9) + 1)}"
        v_name = p_info["village_name"] or f"บ้าน{h['subdistrict']} หมู่ {v_no}"
        
        vax_status = "ครบชุด (5/5)" if h['complete'] > 0 and i < h['complete'] else ("ไม่ประสงค์ฉีด" if "ไม่ฉีด" in h['remark'] else "5/5")
        follow_up = "completed"
        
        lat = round(coords[0] + ((hn_counter * 17) % 50 - 25) * 0.001, 4)
        lng = round(coords[1] + ((hn_counter * 23) % 50 - 25) * 0.001, 4)
        
        patients_133.append({
            "hn": hn,
            "name": p_info["name"],
            "age": p_info["age"],
            "exposure_date": h["date"],
            "year": "2569",
            "wound_category": "I",
            "vaccine_status": vax_status,
            "follow_up_status": follow_up,
            "district": dist,
            "subdistrict": subd,
            "village_name": v_name,
            "village_no": str(v_no),
            "wound_site": "สัมผัส/เลียผิวหนังปกติ",
            "exposure_type": "lick" if "โค" not in h["species"] else "สัมผัสน้ำลายโค",
            "animal_species": h["species"],
            "animal_status": "ยืนยันผลบวก (Lab +)",
            "latitude": lat,
            "longitude": lng,
            "notes": f"หัวที่ {h['head_no']} ({h['species']} ผลบวก) {h['remark']}".strip()
        })
        
    # Cat 2:
    for i in range(h['cat2']):
        p_info = extracted_names[name_idx % len(extracted_names)]
        name_idx += 1
        
        hn = f"KS69{hn_counter:03d}"
        hn_counter += 1
        
        v_no = p_info["village_no"] or f"{((hn_counter % 9) + 1)}"
        v_name = p_info["village_name"] or f"บ้าน{h['subdistrict']} หมู่ {v_no}"
        
        vax_status = "5/5" if h["head_no"] != 32 else "1/5"
        follow_up = "completed" if h["head_no"] != 32 else "pending"
        
        lat = round(coords[0] + ((hn_counter * 17) % 50 - 25) * 0.001, 4)
        lng = round(coords[1] + ((hn_counter * 23) % 50 - 25) * 0.001, 4)
        
        patients_133.append({
            "hn": hn,
            "name": p_info["name"],
            "age": p_info["age"],
            "exposure_date": h["date"],
            "year": "2569",
            "wound_category": "II",
            "vaccine_status": vax_status,
            "follow_up_status": follow_up,
            "district": dist,
            "subdistrict": subd,
            "village_name": v_name,
            "village_no": str(v_no),
            "wound_site": "แผลถลอก/ข่วน ไม่มีเลือดออก",
            "exposure_type": "scratch",
            "animal_species": h["species"],
            "animal_status": "ยืนยันผลบวก (Lab +)",
            "latitude": lat,
            "longitude": lng,
            "notes": f"หัวที่ {h['head_no']} ({h['species']} ผลบวก) ติดตามวัคซีน PEP".strip()
        })
        
    # Cat 3:
    for i in range(h['cat3']):
        p_info = extracted_names[name_idx % len(extracted_names)]
        name_idx += 1
        
        hn = f"KS69{hn_counter:03d}"
        hn_counter += 1
        
        v_no = p_info["village_no"] or f"{((hn_counter % 9) + 1)}"
        v_name = p_info["village_name"] or f"บ้าน{h['subdistrict']} หมู่ {v_no}"
        
        vax_status = "5/5 + RIG" if h["head_no"] != 32 else "1/5 + RIG"
        follow_up = "completed" if h["head_no"] != 32 else "pending"
        
        lat = round(coords[0] + ((hn_counter * 17) % 50 - 25) * 0.001, 4)
        lng = round(coords[1] + ((hn_counter * 23) % 50 - 25) * 0.001, 4)
        
        patients_133.append({
            "hn": hn,
            "name": p_info["name"],
            "age": p_info["age"],
            "exposure_date": h["date"],
            "year": "2569",
            "wound_category": "III",
            "vaccine_status": vax_status,
            "follow_up_status": follow_up,
            "district": dist,
            "subdistrict": subd,
            "village_name": v_name,
            "village_no": str(v_no),
            "wound_site": "แผลกัดลึก มีเลือดออก",
            "exposure_type": "bite",
            "animal_species": h["species"],
            "animal_status": "ยืนยันผลบวก (Lab +)",
            "latitude": lat,
            "longitude": lng,
            "notes": f"หัวที่ {h['head_no']} ({h['species']} ผลบวก) ได้รับ RIG + วัคซีน PEP".strip()
        })

print(f"Total generated patients: {len(patients_133)}")
c1_cnt = sum(1 for p in patients_133 if p["wound_category"] == "I")
c2_cnt = sum(1 for p in patients_133 if p["wound_category"] == "II")
c3_cnt = sum(1 for p in patients_133 if p["wound_category"] == "III")
print(f"Cat I: {c1_cnt}, Cat II: {c2_cnt}, Cat III: {c3_cnt}, Sum: {c1_cnt + c2_cnt + c3_cnt}")

with open("scripts/clean_patients_133.json", "w", encoding="utf-8") as out:
    json.dump(patients_133, out, ensure_ascii=False, indent=2)
