import json
import re

heads = json.load(open('scripts/official_heads_summary.json', encoding='utf-8'))

month_map = {
    'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04',
    'พฤษภาคม': '05', 'มิถุนายน': '06', 'กรกฎาคม': '07', 'สิงหาคม': '08',
    'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12',
    'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
    'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
    'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12'
}

def parse_iso(thai_date):
    clean = re.sub(r'\s+', ' ', thai_date.strip())
    parts = clean.split(' ')
    day = parts[0].zfill(2)
    month = '01'
    for k, v in month_map.items():
        if len(parts) > 1 and k in parts[1]:
            month = v
            break
    year = '2026'
    return f"{year}-{month}-{day}"

# Read mapPoints villages from src/lib/mock-data.ts with regex
pts_village = {}
with open('src/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find blocks like "id": 1, ... "village_name": "..."
blocks = re.findall(r'\{\s*"id":\s*(\d+).*?"village_name":\s*"([^"]+)".*?\}', text, re.DOTALL)
for b in blocks:
    pts_village[int(b[0])] = b[1]

alerts = []
for h in heads:
    head_no = h['head_no']
    subdistrict = h['subdistrict'].strip()
    if not subdistrict.startswith('ต.'):
        subdistrict = 'ต.' + subdistrict
    district = h['district'].strip()
    if not district.startswith('อ.'):
        district = 'อ.' + district
    if district == 'อ.เมือง':
        district = 'อ.เมืองกาฬสินธุ์'
    
    village_name = pts_village.get(head_no, f"ต.{h['subdistrict']}")
    date_str = h['date']
    iso_date = parse_iso(date_str)

    # 1 month check (from 15 กันยายน 2569 to 15 ตุลาคม 2569)
    # Head 31 (28 ก.ย. 2569) and Head 32 (6 ต.ค. 2569)
    is_recent = iso_date >= '2026-09-15'

    species = h.get('species', 'สุนัข')
    total_exp = h.get('total', 0)
    cat1 = h.get('cat1', 0)
    cat2 = h.get('cat2', 0)
    cat3 = h.get('cat3', 0)

    sample_id = f"KLS-69-{str(head_no).zfill(3)}"
    title = f"หัวที่ {head_no}: ผลบวก {species} ({subdistrict} {district})"
    
    msg_parts = [
        f"ยืนยันผลบวกตรวจพบเชื้อพิษสุนัขบ้า (Rabies Positive) ใน{species} วันที่ {date_str}",
        f"พื้นที่: {village_name} {subdistrict} {district}",
        f"ผลตรวจทางห้องปฏิบัติการ: DFA / RT-PCR พบเชื้อบวก โดย ศวพ.ขอนแก่น",
    ]
    if total_exp > 0:
        msg_parts.append(f"มีผู้สัมผัสโรค {total_exp} ราย (Cat I: {cat1}, Cat II: {cat2}, Cat III: {cat3} ราย) ได้รับวัคซีน PEP ครบถ้วนตามมาตรฐาน")
    else:
        msg_parts.append(f"ไม่มีผู้สัมผัสโรคถูกกัด (ทีมปศุสัตว์ร่วมกับ สธ. ดำเนินการปูพรมฉีดวัคซีนสัตว์รอบรัศมี 5 กม.)")
    
    if h.get('remark'):
        msg_parts.append(f"หมายเหตุ: {h['remark']}")

    message = " | ".join(msg_parts)
    location = f"{village_name} {subdistrict} {district}"

    alert_item = {
        "alert_id": head_no,
        "head_no": head_no,
        "level": "critical",
        "title": title,
        "message": message,
        "location": location,
        "created_at": f"{iso_date}T08:30:00Z",
        "date_thai": date_str,
        "is_read": not is_recent,
        "animal_species": species,
        "lab_result": "ผลบวก (Rabies Positive: DFA/RT-PCR +)",
        "lab_agency": "ศวพ.ขอนแก่น (กรมปศุสัตว์) / สถาบันสุขภาพสัตว์แห่งชาติ",
        "sample_id": sample_id,
        "lab_date": date_str,
        "exposures_count": total_exp,
        "cat1_count": cat1,
        "cat2_count": cat2,
        "cat3_count": cat3,
        "is_recent_1_month": is_recent,
        "district": district,
        "subdistrict": subdistrict,
        "village_name": village_name,
        "year": "2569"
    }
    alerts.append(alert_item)

# Sort alerts from newest head to oldest (32 down to 1)
alerts.sort(key=lambda x: x['head_no'], reverse=True)

with open('scripts/generated_32_alerts.json', 'w', encoding='utf-8') as f:
    json.dump(alerts, f, ensure_ascii=False, indent=2)

print(f"Generated {len(alerts)} alerts.")
recent_heads = [a['head_no'] for a in alerts if a['is_recent_1_month']]
print(f"Recent in 1 month: {len(recent_heads)} alerts (heads: {recent_heads})")
