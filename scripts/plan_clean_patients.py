import json
import re

with open("src/lib/mock-data.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Find patientList
p_start = content.find("export const patientList: PatientListItem[] = [")
p_end = content.find("export const vaccineCoverageData:", p_start)
patient_str = content[p_start:p_end]

blocks = re.findall(r'\{\s*"hn":\s*"[^"]+",[\s\S]*?\}', patient_str)
print(f"Total current blocks: {len(blocks)}")

# Load heads summary
with open("scripts/official_heads_summary.json", "r", encoding="utf-8") as f:
    heads = json.load(f)

# Total needed: 133
# Cat I: 89
# Cat II: 32
# Cat III: 12
print("Target: Cat I = 89, Cat II = 32, Cat III = 12, Total = 133")
