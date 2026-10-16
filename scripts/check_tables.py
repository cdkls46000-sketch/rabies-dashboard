import json

with open(r"D:\GRAVITY\Rabies\scripts\official_summary.txt", "r", encoding="utf-8") as f:
    text = f.read()

parts = text.split("--- TABLE ")

for idx, p in enumerate(parts[1:], 1):
    print(f"=== TABLE {idx} ===")
    lines = [l for l in p.split("\n") if l.startswith("Row ")]
    for l in lines:
        print(l)
