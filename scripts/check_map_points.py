import re
import sys
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/mock-data.ts', encoding='utf-8') as f:
    text = f.read()

p1 = text.find('export const mapPoints: MapPoint[] = [')
p2 = text.find('export const categoryCount:', p1)
slice_text = text[p1:p2]

points = re.findall(r'"id":\s*(\d+)', slice_text)
years = re.findall(r'"year":\s*"([^"]+)"', slice_text)
types = re.findall(r'"type":\s*"([^"]+)"', slice_text)

print('Total map points:', len(points))
print('By type:', Counter(types))
print('By year:', Counter(years))
