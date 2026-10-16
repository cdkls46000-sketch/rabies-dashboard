import json

alerts = json.load(open('scripts/generated_32_alerts.json', encoding='utf-8'))
alerts_json = json.dumps(alerts, ensure_ascii=False, indent=2)

with open('src/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

idx1 = content.find('export const alertSummary')
idx2 = content.find('export const calendarData')

if idx1 != -1 and idx2 != -1:
    new_section = f'''export const alertSummary: AlertSummary = {{
  critical: 32,
  urgent: 0,
  warning: 0,
  info: 0,
}};

// ข้อมูลการแจ้งเตือนจริงทั้ง 32 หัวสัตว์ติดเชื้อผลบวก จ.กาฬสินธุ์
export const alerts: Alert[] = {alerts_json};

export const yearlyAlerts: Record<FiscalYear, Alert[]> = {{
  '2568': [],
  '2569': alerts,
  '2570': [],
  '2571': [],
}};

'''
    content = content[:idx1] + new_section + content[idx2:]
    with open('src/lib/mock-data.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced alerts in src/lib/mock-data.ts with all 32 heads!")
else:
    print(f"Could not find markers: {idx1}, {idx2}")
