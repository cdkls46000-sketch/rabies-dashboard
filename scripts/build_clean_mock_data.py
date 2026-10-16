import json
import re

# Read current mock-data.ts to preserve mapPoints and other static data
with open("src/lib/mock-data.ts", "r", encoding="utf-8") as f:
    orig = f.read()

# Extract mapPoints
mp_start = orig.find("export const mapPoints: MapPoint[] = [")
mp_end = orig.find("export const categoryCount:", mp_start)
map_points_code = orig[mp_start:mp_end].strip()

# Load 133 clean patients
with open("scripts/clean_patients_133.json", "r", encoding="utf-8") as f:
    patients_133 = json.load(f)

# Format patients code
patients_json = json.dumps(patients_133, ensure_ascii=False, indent=2)

file_content = f"""import {{ 
  DashboardSummary, 
  TrendData, 
  SpeciesData, 
  ProvinceRankData, 
  MapPoint, 
  CategoryCount, 
  PatientListItem, 
  VaccineCoverageData, 
  DistrictVaccinationData, 
  AnimalSummary, 
  LabSummary, 
  AlertSummary, 
  Alert,
  FiscalYear
}} from '@/types';

// สรุปข้อมูลสถานการณ์จริง ณ วันที่ 15 ตุลาคม 2569 (กลุ่มงานควบคุมโรคติดต่อ สสจ.กาฬสินธุ์)
// เคลียร์ข้อมูลตัวอย่างปี 2568, 2570, 2571 ออกทั้งหมดให้เป็น 0 ตามคำสั่ง
export const yearlySummaries: Record<FiscalYear, DashboardSummary> = {{
  '2568': {{
    totalCases: 0,
    totalCasesChange: 0,
    totalExposures: 0,
    totalExposuresChange: 0,
    positiveAnimals: 0,
    positiveAnimalsChange: 0,
    vaccinationCoverage: 0,
    vaccinationCoverageChange: 0,
  }},
  '2569': {{
    totalCases: 165,
    totalCasesChange: 0,
    totalExposures: 133,
    totalExposuresChange: 0,
    positiveAnimals: 32,
    positiveAnimalsChange: 0,
    vaccinationCoverage: 84.5,
    vaccinationCoverageChange: 0,
  }},
  '2570': {{
    totalCases: 0,
    totalCasesChange: 0,
    totalExposures: 0,
    totalExposuresChange: 0,
    positiveAnimals: 0,
    positiveAnimalsChange: 0,
    vaccinationCoverage: 0,
    vaccinationCoverageChange: 0,
  }},
  '2571': {{
    totalCases: 0,
    totalCasesChange: 0,
    totalExposures: 0,
    totalExposuresChange: 0,
    positiveAnimals: 0,
    positiveAnimalsChange: 0,
    vaccinationCoverage: 0,
    vaccinationCoverageChange: 0,
  }},
}};

export const dashboardSummary: DashboardSummary = yearlySummaries['2569'];

// ข้อมูลแนวโน้มรายเดือน พ.ศ. 2569 จากรายงานจริง 32 หัวสัตว์ตรวจพบเชื้อ และผู้สัมผัส 133 ราย
export const trendData: TrendData[] = [
  {{ month: 'ม.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ก.พ.', cases: 10, exposures: 6, positiveAnimals: 4 }},
  {{ month: 'มี.ค.', cases: 62, exposures: 55, positiveAnimals: 7 }},
  {{ month: 'เม.ย.', cases: 14, exposures: 11, positiveAnimals: 3 }},
  {{ month: 'พ.ค.', cases: 33, exposures: 27, positiveAnimals: 6 }},
  {{ month: 'มิ.ย.', cases: 12, exposures: 9, positiveAnimals: 3 }},
  {{ month: 'ก.ค.', cases: 9, exposures: 6, positiveAnimals: 3 }},
  {{ month: 'ส.ค.', cases: 6, exposures: 2, positiveAnimals: 4 }},
  {{ month: 'ก.ย.', cases: 12, exposures: 11, positiveAnimals: 1 }},
  {{ month: 'ต.ค.', cases: 7, exposures: 6, positiveAnimals: 1 }},
  {{ month: 'พ.ย.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ธ.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
];

const emptyYearlyTrend: TrendData[] = [
  {{ month: 'ม.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ก.พ.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'มี.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'เม.ย.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'พ.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'มิ.ย.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ก.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ส.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ก.ย.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ต.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'พ.ย.', cases: 0, exposures: 0, positiveAnimals: 0 }},
  {{ month: 'ธ.ค.', cases: 0, exposures: 0, positiveAnimals: 0 }},
];

// ข้อมูลแนวโน้มรายปี (เคลียร์ปี 2568, 2570, 2571 ให้เป็น 0 ทั้งหมด)
export const yearlyTrends: Record<FiscalYear, TrendData[]> = {{
  '2568': emptyYearlyTrend,
  '2569': trendData,
  '2570': emptyYearlyTrend,
  '2571': emptyYearlyTrend,
}};

// สัดส่วนสัตว์ตรวจพบเชื้อ (สุนัข 31 ตัว, โค 1 ตัว รวม 32 ตัว)
export const speciesData: SpeciesData[] = [
  {{ name: 'สุนัข (Canine) 31 ตัว', value: 31, color: '#ef4444' }},
  {{ name: 'โค/วัว (Bovine) 1 ตัว', value: 1, color: '#3b82f6' }},
  {{ name: 'แมว (Feline)', value: 0, color: '#10b981' }},
  {{ name: 'สัตว์ป่า/อื่นๆ', value: 0, color: '#6b7280' }},
];

// จัดอันดับอำเภอที่พบเหตุการณ์ (สัตว์ผลบวก 32 + ผู้สัมผัส 133 = รวม 165 เคสรายงาน)
export const provinceRankData: ProvinceRankData[] = [
  {{ province: 'อ.หนองกุงศรี', cases: 59 }},
  {{ province: 'อ.ยางตลาด', cases: 46 }},
  {{ province: 'อ.เมืองกาฬสินธุ์', cases: 31 }},
  {{ province: 'อ.กมลาไสย', cases: 12 }},
  {{ province: 'อ.ห้วยเม็ก', cases: 10 }},
  {{ province: 'อ.กุฉินารายณ์', cases: 7 }},
];

{map_points_code}

// สรุปสถิติผู้สัมผัสโรคแยกตาม Category (ปี 2569 จากรายงานทางการ สสจ.กาฬสินธุ์)
export const categoryCount: CategoryCount = {{
  catI: 89,
  catII: 32,
  catIII: 12,
  deaths: 0,
}};

// รายชื่อผู้สัมผัสโรคทั้งหมด 133 ราย (ปี 2569 จากเอกสารจริง สสจ.กาฬสินธุ์)
export const patientList: PatientListItem[] = {patients_json};

// ความครอบคลุมวัคซีน PEP แต่ละเข็ม
export const vaccineCoverageData: VaccineCoverageData[] = [
  {{ dose: 'เข็ม 1 (Day 0)', percentage: 100 }},
  {{ dose: 'เข็ม 2 (Day 3)', percentage: 96.5 }},
  {{ dose: 'เข็ม 3 (Day 7)', percentage: 91.2 }},
  {{ dose: 'เข็ม 4 (Day 14)', percentage: 86.8 }},
  {{ dose: 'เข็ม 5 (Day 28)', percentage: 81.5 }},
];

// สถิติการฉีดวัคซีนสัตว์รายอำเภอใน จ.กาฬสินธุ์
export const districtVaccinationData: DistrictVaccinationData[] = [
  {{ district: 'อ.ยางตลาด', target: 16500, vaccinated: 14200, remaining: 2300, coverage: 86.1 }},
  {{ district: 'อ.เมืองกาฬสินธุ์', target: 21000, vaccinated: 18450, remaining: 2550, coverage: 87.9 }},
  {{ district: 'อ.หนองกุงศรี', target: 11200, vaccinated: 9650, remaining: 1550, coverage: 86.2 }},
  {{ district: 'อ.กมลาไสย', target: 9800, vaccinated: 8350, remaining: 1450, coverage: 85.2 }},
  {{ district: 'อ.ห้วยเม็ก', target: 7600, vaccinated: 6300, remaining: 1300, coverage: 82.9 }},
  {{ district: 'อ.กุฉินารายณ์', target: 14500, vaccinated: 12100, remaining: 2400, coverage: 83.4 }},
  {{ district: 'อ.สมเด็จ', target: 8200, vaccinated: 6900, remaining: 1300, coverage: 84.1 }},
  {{ district: 'อ.สหัสขันธ์', target: 6800, vaccinated: 5800, remaining: 1000, coverage: 85.3 }},
];

// สรุปการเฝ้าระวังในสัตว์ (ยืนยันผลบวกจริง 32 ตัว)
export const animalSummary: AnimalSummary = {{
  totalReported: 95,
  totalReportedChange: 0,
  positive: 32,
  positiveChange: 0,
  pendingLab: 0,
  pendingLabChange: 0,
  vaccinated: 81750,
  vaccinatedChange: 0,
}};

// สรุปผลตรวจทางห้องปฏิบัติการ
export const labSummary: LabSummary = {{
  positive: 32,
  positivePercent: 33.7,
  negative: 63,
  negativePercent: 66.3,
  pending: 0,
  pendingPercent: 0,
}};

// สรุปการแจ้งเตือน
export const alertSummary: AlertSummary = {{
  critical: 4,
  urgent: 3,
  warning: 1,
  info: 0,
}};

// ข้อมูลการแจ้งเตือนจริงตาม 32 หัวสัตว์ติดเชื้อ
export const alerts: Alert[] = [
  {{
    alert_id: 1,
    level: 'critical',
    title: 'หัวที่ 32 (ล่าสุด): สุนัขตรวจพบเชื้อบวก บ้านดอนย่านาง ต.ดอนสมบูรณ์ อ.ยางตลาด',
    message: 'ยืนยันผลบวก วันที่ 6 ต.ค. 2569 มีผู้สัมผัส 6 ราย (Cat I 3 ราย, Cat II 1 ราย, Cat III 2 ราย) อยู่ระหว่างติดตามฉีดวัคซีน PEP และเฝ้าระวังรัศมี 5 กม.',
    location: 'บ้านดอนย่านาง หมู่ 9 ต.ดอนสมบูรณ์ อ.ยางตลาด',
    created_at: '2026-10-06T10:30:00Z',
    is_read: false
  }},
  {{
    alert_id: 2,
    level: 'critical',
    title: 'หัวที่ 31: ตรวจพบสุนัขติดเชื้อ ต.โพนงาม อ.กมลาไสย มีผู้สัมผัส 11 ราย',
    message: 'ยืนยันผลบวก วันที่ 28 ก.ย. 2569 สุนัขกัดคนและสัตว์ ผู้สัมผัสเสี่ยง 11 ราย (Cat I 7 ราย, Cat II 3 ราย, Cat III 1 ราย) เข้ารับวัคซีนครบถ้วน',
    location: 'บ้านโพนงาม หมู่ 1 ต.โพนงาม อ.กมลาไสย',
    created_at: '2026-09-28T14:15:00Z',
    is_read: false
  }},
  {{
    alert_id: 3,
    level: 'critical',
    title: 'หัวที่ 18: สุนัขติดเชื้อกัดคน ต.ยางตลาด อ.ยางตลาด ผู้สัมผัสแผล Cat III',
    message: 'ยืนยันผลบวก วันที่ 11 พ.ค. 2569 มีผู้สัมผัส 4 ราย บาดแผลระดับ 3 จำนวน 2 ราย ได้รับ RIG และวัคซีนทันที',
    location: 'บ้านยางตลาด หมู่ 2 ต.ยางตลาด อ.ยางตลาด',
    created_at: '2026-05-11T11:00:00Z',
    is_read: true
  }},
  {{
    alert_id: 4,
    level: 'critical',
    title: 'หัวที่ 16: สุนัขติดเชื้อ ต.เหนือ อ.เมืองกาฬสินธุ์ ผู้สัมผัสแผลลึก Cat III 3 ราย',
    message: 'ยืนยันผลบวก วันที่ 8 พ.ค. 2569 สุนัขกัดผู้สัมผัสบาดแผลรุนแรง 3 ราย เข้ารับการรักษาที่ รพ.กาฬสินธุ์ ได้รับ RIG ครบชุด',
    location: 'บ้านเหนือ หมู่ 3 ต.เหนือ อ.เมืองกาฬสินธุ์',
    created_at: '2026-05-08T09:30:00Z',
    is_read: true
  }},
  {{
    alert_id: 5,
    level: 'urgent',
    title: 'หัวที่ 26: สุนัขติดเชื้อในสวนสาธารณะแก่งดอนกลาง ต.กาฬสินธุ์ อ.เมือง',
    message: 'ยืนยันผลบวก วันที่ 8 ก.ค. 2569 สุนัขจรจัดกัดประชาชนในสวนสาธารณะ 5 ราย รับวัคซีนและ RIG ครบชุด',
    location: 'สวนสาธารณะแก่งดอนกลาง อ.เมืองกาฬสินธุ์',
    created_at: '2026-07-08T16:00:00Z',
    is_read: true
  }},
  {{
    alert_id: 6,
    level: 'urgent',
    title: 'หัวที่ 9: ตรวจพบเชื้อพิษสุนัขบ้าใน โค (วัว) ต.คลองขาม อ.ยางตลาด',
    message: 'เคสสัตว์ใหญ่ระบาดข้ามสายพันธุ์ โคถูกสุนัขบ้ากัดตาย ตรวจสมองพบเชื้อบวก สั่งการปศุสัตว์เฝ้าระวังฝูงโค-กระบือในตำบลข้างเคียง',
    location: 'บ้านคลองขาม หมู่ 2 ต.คลองขาม อ.ยางตลาด',
    created_at: '2026-03-18T08:45:00Z',
    is_read: true
  }},
  {{
    alert_id: 7,
    level: 'urgent',
    title: 'หัวที่ 7: คลัสเตอร์ชำแหละสุนัข บ้านโคกเครือ อ.หนองกุงศรี ผู้สัมผัส 45 ราย',
    message: 'มีประวัติชำแหละสุนัขที่ติดเชื้อ ผู้สัมผัสเสี่ยง 45 ราย (Cat I 43 ราย, Cat III 2 ราย) ติดตามเฝ้าระวังต่อเนื่อง 6 เดือน',
    location: 'บ้านโคกเครือ หมู่ 4 ต.โคกเครือ อ.หนองกุงศรี',
    created_at: '2026-03-04T13:30:00Z',
    is_read: true
  }},
  {{
    alert_id: 8,
    level: 'info',
    title: 'สรุปสถานการณ์โรคพิษสุนัขบ้า จ.กาฬสินธุ์ ณ วันที่ 15 ตุลาคม 2569',
    message: 'สสจ.กาฬสินธุ์ รายงานผลบวกสะสม 32 หัว ผู้สัมผัสเสี่ยง 133 ราย ฉีดวัคซีนครบ 74 ราย เสียชีวิต 0 ราย ปลอดผู้ป่วย 100%',
    location: 'สำนักงานสาธารณสุขจังหวัดกาฬสินธุ์',
    created_at: '2026-10-15T09:00:00Z',
    is_read: true
  }}
];

export const calendarData = [
  {{ date: '2026-10-15', title: 'ประชุม One Health สสจ.กาฬสินธุ์ สรุปผล 32 หัว' }},
  {{ date: '2026-10-18', title: 'ติดตามวัคซีนเข็ม 3 ผู้สัมผัสหัว 32 บ้านดาวเหนือ' }},
  {{ date: '2026-10-20', title: 'รณรงค์ปูพรมฉีดวัคซีนสัตว์ ต.ดอนสมบูรณ์ อ.ยางตลาด' }},
];

export const kalasinDistricts = [
  {{ id: 'all', name: 'ทุกอำเภอ (จ.กาฬสินธุ์)' }},
  {{ id: 'muang', name: 'อ.เมืองกาฬสินธุ์' }},
  {{ id: 'yangtalat', name: 'อ.ยางตลาด' }},
  {{ id: 'kamalasai', name: 'อ.กมลาไสย' }},
  {{ id: 'somdet', name: 'อ.สมเด็จ' }},
  {{ id: 'kuchinarai', name: 'อ.กุฉินารายณ์' }},
  {{ id: 'sahatsakhan', name: 'อ.สหัสขันธ์' }},
  {{ id: 'khammuang', name: 'อ.คำม่วง' }},
  {{ id: 'thakantho', name: 'อ.ท่าคันโท' }},
  {{ id: 'nongkungsi', name: 'อ.หนองกุงศรี' }},
  {{ id: 'huaimek', name: 'อ.ห้วยเม็ก' }},
  {{ id: 'huaiphueng', name: 'อ.ห้วยผึ้ง' }},
  {{ id: 'namon', name: 'อ.นามน' }},
  {{ id: 'rongkham', name: 'อ.ร่องคำ' }},
  {{ id: 'khaowong', name: 'อ.เขาวง' }},
  {{ id: 'nakhu', name: 'อ.นาคู' }},
  {{ id: 'donchan', name: 'อ.ดอนจาน' }},
  {{ id: 'samchai', name: 'อ.สามชัย' }},
  {{ id: 'khongchai', name: 'อ.ฆ้องชัย' }},
];

export const kalasinSubdistricts: Record<string, string[]> = {{
  'อ.เมืองกาฬสินธุ์': ['ต.กาฬสินธุ์', 'ต.หลุบ', 'ต.โพนทอง', 'ต.ลำปาว', 'ต.ลำพาน', 'ต.หนองกุง', 'ต.บึงวิชัย', 'ต.ไผ่', 'ต.นาเชือก', 'ต.ลำคลอง', 'ต.เหนือ', 'ต.นาจารย์'],
  'อ.ยางตลาด': ['ต.ยางตลาด', 'ต.บัวบาน', 'ต.อุ่มเม่า', 'ต.โนนสูง', 'ต.นาเชือก', 'ต.เขาพระนอน', 'ต.ดอนสมบูรณ์', 'ต.คลองขาม', 'ต.นาดี', 'ต.หัวงัว'],
  'อ.กมลาไสย': ['ต.กมลาไสย', 'ต.ดงลิง', 'ต.หลักเมือง', 'ต.โพนงาม', 'ต.โคกสมบูรณ์', 'ต.หนองแปน'],
  'อ.สมเด็จ': ['ต.สมเด็จ', 'ต.สร้างแสน', 'ต.มหาไชย', 'ต.หนองแวง', 'ต.หมูม่น', 'ต.ลำห้วยหลัว'],
  'อ.กุฉินารายณ์': ['ต.บัวขาว', 'ต.สมสะอาด', 'ต.กุดหว้า', 'ต.เหล่าใหญ่', 'ต.จุมจัง', 'ต.แวง', 'ต.นาขาม', 'ต.หนองห้าง'],
  'อ.สหัสขันธ์': ['ต.โนนบุรี', 'ต.ภูสิงห์', 'ต.นิคม', 'ต.โนนศิลา', 'ต.สหัสขันธ์', 'ต.นามะเขือ'],
  'อ.คำม่วง': ['ต.ทุ่งคลอง', 'ต.โพน', 'ต.ดินจี่', 'ต.นาทัน', 'ต.เนินยาง'],
  'อ.ท่าคันโท': ['ต.ท่าคันโท', 'ต.ดงสมบูรณ์', 'ต.กุงเก่า', 'ต.นาตาล', 'ต.กุดจิก'],
  'อ.หนองกุงศรี': ['ต.หนองกุงศรี', 'ต.หนองหิน', 'ต.โคกเครือ', 'ต.หนองบัว', 'ต.เสาเล้า', 'ต.ดงมูล'],
  'อ.ห้วยเม็ก': ['ต.ห้วยเม็ก', 'ต.กุดเจ่า', 'ต.คำเหมือดแก้ว', 'ต.บึงนาเรียง', 'ต.พิมูล', 'ต.ทรายทอง'],
  'อ.ห้วยผึ้ง': ['ต.นิคมห้วยผึ้ง', 'ต.ห้วยผึ้ง', 'ต.คำบง', 'ต.ไค้นุ่น'],
  'อ.นามน': ['ต.นามน', 'ต.ยอดแกง', 'ต.สงเปลือย', 'ต.หลักเหลี่ยม'],
  'อ.ร่องคำ': ['ต.ร่องคำ', 'ต.เหล่าอ้อย', 'ต.สามขา'],
  'อ.เขาวง': ['ต.คุ้มเก่า', 'ต.กุดสิมคุ้มใหม่', 'ต.สระพังทอง', 'ต.หนองผือ'],
  'อ.นาคู': ['ต.นาคู', 'ต.บ่อแก้ว', 'ต.โนนนาจาน', 'ต.สายนาวัง'],
  'อ.ดอนจาน': ['ต.ดอนจาน', 'ต.สะอาดไชยศรี', 'ต.ดงพยุง', 'ต.ม่วงนา'],
  'อ.สามชัย': ['ต.สำราญ', 'ต.คำสร้างเที่ยง', 'ต.หนองช้าง'],
  'อ.ฆ้องชัย': ['ต.ฆ้องชัยพัฒนา', 'ต.ลำชี', 'ต.โนนศิลาเลิง', 'ต.กุดฆ้องชัย'],
}};
"""

with open("src/lib/mock-data.ts", "w", encoding="utf-8") as f:
    f.write(file_content.strip() + "\n")

print("Successfully generated src/lib/mock-data.ts!")
