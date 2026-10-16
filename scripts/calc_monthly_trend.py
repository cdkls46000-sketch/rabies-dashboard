import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/official_heads_summary.json", "r", encoding="utf-8") as f:
    heads = json.load(f)

months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
month_map = {
    "มกราคม": "ม.ค.",
    "กุมภาพันธ์": "ก.พ.",
    "มีนาคม": "มี.ค.",
    "เมษายน": "เม.ย.",
    "พฤษภาคม": "พ.ค.",
    "มิถุนายน": "มิ.ย.",
    "กรกฎาคม": "ก.ค.",
    "สิงหาคม": "ส.ค.",
    "กันยายน": "ก.ย.",
    "ตุลาคม": "ต.ค.",
    "พฤศจิกายน": "พ.ย.",
    "ธันวาคม": "ธ.ค.",
}

by_month = {m: {"animals": 0, "c1": 0, "c2": 0, "c3": 0, "exposures": 0} for m in months}

for h in heads:
    m_found = None
    for full_m, short_m in month_map.items():
        if full_m in h["date"]:
            m_found = short_m
            break
    if m_found:
        by_month[m_found]["animals"] += 1
        cat1 = h["cat1"] if h["head_no"] != 29 else 0
        by_month[m_found]["c1"] += cat1
        by_month[m_found]["c2"] += h["cat2"]
        by_month[m_found]["c3"] += h["cat3"]
        by_month[m_found]["exposures"] += (cat1 + h["cat2"] + h["cat3"])

trend_2569 = []
for m in months:
    info = by_month[m]
    cases = info["animals"] + info["exposures"]
    trend_2569.append({
        "month": m,
        "cases": cases,
        "exposures": info["exposures"],
        "positiveAnimals": info["animals"]
    })

print("Exact 2569 Monthly Trend:")
print(json.dumps(trend_2569, ensure_ascii=False, indent=2))

tot_anim = sum(t["positiveAnimals"] for t in trend_2569)
tot_exp = sum(t["exposures"] for t in trend_2569)
tot_cases = sum(t["cases"] for t in trend_2569)
print(f"Total animals: {tot_anim}, Total exposures: {tot_exp}, Total cases: {tot_cases}")

with open("scripts/trend_2569.json", "w", encoding="utf-8") as out:
    json.dump(trend_2569, out, ensure_ascii=False, indent=2)
