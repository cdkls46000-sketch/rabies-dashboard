import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/clean_patients_133.json", "r", encoding="utf-8") as f:
    patients = json.load(f)

with open("scripts/official_heads_summary.json", "r", encoding="utf-8") as f:
    heads = json.load(f)

dist_stats = {}
for p in patients:
    d = p["district"].replace("อ.", "").strip()
    if d not in dist_stats:
        dist_stats[d] = {"exposures": 0, "animals": 0, "total": 0}
    dist_stats[d]["exposures"] += 1
    dist_stats[d]["total"] += 1

for h in heads:
    d = h["district"].replace("อ.", "").strip()
    if d not in dist_stats:
        dist_stats[d] = {"exposures": 0, "animals": 0, "total": 0}
    dist_stats[d]["animals"] += 1
    dist_stats[d]["total"] += 1

sorted_dist = sorted(dist_stats.items(), key=lambda x: x[1]["total"], reverse=True)
print("Districts ranking:")
rank_data = []
for d, s in sorted_dist:
    print(f"  อ.{d}: {s['total']} (คนสัมผัส={s['exposures']}, สัตว์บวก={s['animals']})")
    rank_data.append({"province": f"อ.{d}", "cases": s["total"]})

with open("scripts/rank_data.json", "w", encoding="utf-8") as out:
    json.dump(rank_data, out, ensure_ascii=False, indent=2)
