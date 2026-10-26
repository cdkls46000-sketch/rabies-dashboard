import { QuarantineAnimal } from '@/types';

// Mock baseline historical count for Kalasin province (สัตว์ที่กักครบ 14 วัน พ้นระยะปลอดภัยสะสมตั้งแต่ต้นปี)
export const HISTORICAL_COMPLETED_BASELINE = 398;

export const initialQuarantineAnimals: QuarantineAnimal[] = [
  // 18 อยู่ระหว่างกักตัว (Active Quarantine) ณ วันที่ 26 ต.ค. 2569
  {
    id: 'Q-2569-001',
    code: 'Q-2569-001',
    animalName: 'เจ้าด่าง',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายประสิทธิ์ สุขใจ',
    district: 'อ.เมืองกาฬสินธุ์',
    subdistrict: 'ต.กาฬสินธุ์',
    village: 'ม.2 ชุมชนหนองสิม',
    startDate: '2026-10-13', // 13 days elapsed (Day 13/14 - พรุ่งนี้ครบ!)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดเพื่อนบ้านขณะเดินผ่านหน้าบ้าน ล่ามโซ่ในพื้นที่ปิด แข็งแรง กินอาหารได้ปกติ',
  },
  {
    id: 'Q-2569-002',
    code: 'Q-2569-002',
    animalName: 'สุนัขจรจัดลายเสือ',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ไม่ทราบเจ้าของ (เทศบาลกักตัว)',
    district: 'อ.เมืองกาฬสินธุ์',
    subdistrict: 'ต.หลุบ',
    village: 'ม.4 บ้านหลุบ',
    startDate: '2026-10-14', // 12 days elapsed (Day 12/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'จับขังในกรงกักกันสัตว์เทศบาลเมืองกาฬสินธุ์ อาการปกติ กินอาหารได้ดี',
  },
  {
    id: 'Q-2569-003',
    code: 'Q-2569-003',
    animalName: 'เจ้าหมอก',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไซบีเรียน ฮัสกี้',
    ownership: 'owned',
    ownerName: 'นางกาญจนา ศรีทอง',
    district: 'อ.ยางตลาด',
    subdistrict: 'ต.ยางตลาด',
    village: 'ม.1 บ้านยางตลาด',
    startDate: '2026-10-15', // 11 days elapsed (Day 11/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'แย่งของเล่นกับเด็ก ข่วนที่แขน กักบริเวณในบ้าน',
  },
  {
    id: 'Q-2569-004',
    code: 'Q-2569-004',
    animalName: 'เจ้ามอม',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยบางแก้วผสม',
    ownership: 'owned',
    ownerName: 'นายวิเชียร สมบูรณ์',
    district: 'อ.ยางตลาด',
    subdistrict: 'ต.คลองขาม',
    village: 'ม.5 บ้านดอนยานาง',
    startDate: '2026-10-16', // 10 days elapsed (Day 10/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดคนส่งพัสดุ ขังในกรงเหล็กดูอาการใกล้ชิด',
  },
  {
    id: 'Q-2569-005',
    code: 'Q-2569-005',
    animalName: 'สุนัขจรสีดำ',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ปศุสัตว์อำเภอกมลาไสยกักตัว',
    district: 'อ.กมลาไสย',
    subdistrict: 'ต.กมลาไสย',
    village: 'ม.3 ตลาดกมลาไสย',
    startDate: '2026-10-17', // 9 days elapsed (Day 9/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดคนในตลาดสด กักตัวที่ศูนย์กักกันสัตว์ประจำอำเภอ',
  },
  {
    id: 'Q-2569-006',
    code: 'Q-2569-006',
    animalName: 'เจ้าสีหมอก',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวไทยศุภลักษณ์',
    ownership: 'owned',
    ownerName: 'นางสาวพิมพ์ชนก รัตนชัย',
    district: 'อ.กมลาไสย',
    subdistrict: 'ต.ดงลิง',
    village: 'ม.7 บ้านโนนงาม',
    startDate: '2026-10-18', // 8 days elapsed (Day 8/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'ตกใจฟ้าร้องข่วนเจ้าของ ขังกรงในบ้าน',
  },
  {
    id: 'Q-2569-007',
    code: 'Q-2569-007',
    animalName: 'เจ้าขาว',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายบุญทัน นาพรม',
    district: 'อ.สมเด็จ',
    subdistrict: 'ต.สมเด็จ',
    village: 'ม.1 บ้านสมเด็จ',
    startDate: '2026-10-18', // 8 days elapsed (Day 8/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดเด็กวิ่งเล่นหน้าบ้าน กักในรั้วมิดชิด',
  },
  {
    id: 'Q-2569-008',
    code: 'Q-2569-008',
    animalName: 'สุนัขจรจัดสีน้ำตาล',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'อบต.สมเด็จ รับกักตัว',
    district: 'อ.สมเด็จ',
    subdistrict: 'ต.หนองแวง',
    village: 'ม.4 บ้านหนองแวง',
    startDate: '2026-10-19', // 7 days elapsed (Day 7/14 - ครึ่งทาง)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'ไล่กัดคนขี่จักรยาน กักในกรง อบต.',
  },
  {
    id: 'Q-2569-009',
    code: 'Q-2569-009',
    animalName: 'เจ้าตาล',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'พิทบูลผสม',
    ownership: 'owned',
    ownerName: 'นายเอกชัย ใจมั่น',
    district: 'อ.กุฉินารายณ์',
    subdistrict: 'ต.บัวขาว',
    village: 'ม.3 บ้านบัวขาว',
    startDate: '2026-10-20', // 6 days elapsed (Day 6/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดคนตัดหญ้า กักบริเวณโรงเรือน',
  },
  {
    id: 'Q-2569-010',
    code: 'Q-2569-010',
    animalName: 'เจ้าส้ม',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวไทยลายส้ม',
    ownership: 'owned',
    ownerName: 'นางบุญมี คำสอน',
    district: 'อ.กุฉินารายณ์',
    subdistrict: 'ต.จุมจัง',
    village: 'ม.6 บ้านจุมจัง',
    startDate: '2026-10-20', // 6 days elapsed (Day 6/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดมือเจ้าของขณะป้อนยา ขังกรงในห้องนอน',
  },
  {
    id: 'Q-2569-011',
    code: 'Q-2569-011',
    animalName: 'สุนัขจรจัดขนฟู',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ชิสุผสมไทย',
    ownership: 'stray',
    ownerName: 'วัดพุทธาวาสภูสิงห์ (ดูแลชั่วคราว)',
    district: 'อ.สหัสขันธ์',
    subdistrict: 'ต.โนนบุรี',
    village: 'ม.1 บ้านโนนบุรี',
    startDate: '2026-10-21', // 5 days elapsed (Day 5/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดนักท่องเที่ยวบริเวณบันไดสวรรค์ กักในกรงวัด',
  },
  {
    id: 'Q-2569-012',
    code: 'Q-2569-012',
    animalName: 'เจ้าโบ้',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'โกลเด้นผสม',
    ownership: 'owned',
    ownerName: 'นายเกียรติศักดิ์ ภูโคก',
    district: 'อ.คำม่วง',
    subdistrict: 'ต.ทุ่งคลอง',
    village: 'ม.8 บ้านหนองสิม',
    startDate: '2026-10-22', // 4 days elapsed (Day 4/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดเด็กข้างบ้านขณะเล่นลูกบอล ล่ามในโรงรถ',
  },
  {
    id: 'Q-2569-013',
    code: 'Q-2569-013',
    animalName: 'เจ้าเสือดาว',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวเบงกอลผสม',
    ownership: 'owned',
    ownerName: 'นางสาวสุดารัตน์ พิมพะนิตย์',
    district: 'อ.ท่าคันโท',
    subdistrict: 'ต.ท่าคันโท',
    village: 'ม.2 บ้านท่าคันโท',
    startDate: '2026-10-22', // 4 days elapsed (Day 4/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'ข่วนแขนสัตวแพทย์ขณะตรวจฟัน ขังกรงคลินิก',
  },
  {
    id: 'Q-2569-014',
    code: 'Q-2569-014',
    animalName: 'สุนัขจรจัดลายจุด',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'เทศบาลตำบลหนองกุงศรี',
    district: 'อ.หนองกุงศรี',
    subdistrict: 'ต.หนองกุงศรี',
    village: 'ม.5 บ้านหนองกุงศรี',
    startDate: '2026-10-23', // 3 days elapsed (Day 3/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดแม่ค้าขายหมูปิ้ง กักในกรงเทศบาล',
  },
  {
    id: 'Q-2569-015',
    code: 'Q-2569-015',
    animalName: 'เจ้าดำรง',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยหลังอาน',
    ownership: 'owned',
    ownerName: 'นายสนอง พันธุศาสตร์',
    district: 'อ.ห้วยเม็ก',
    subdistrict: 'ต.ห้วยเม็ก',
    village: 'ม.3 บ้านห้วยเม็ก',
    startDate: '2026-10-23', // 3 days elapsed (Day 3/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดคนงานก่อสร้าง ล่ามโซ่ในคอก',
  },
  {
    id: 'Q-2569-016',
    code: 'Q-2569-016',
    animalName: 'เจ้ามั่งมี',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ร็อตไวเลอร์ผสม',
    ownership: 'owned',
    ownerName: 'นายศักดิ์ดา อัครเดช',
    district: 'อ.ห้วยผึ้ง',
    subdistrict: 'ต.ห้วยผึ้ง',
    village: 'ม.1 บ้านห้วยผึ้ง',
    startDate: '2026-10-24', // 2 days elapsed (Day 2/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'หวงอาณาเขต ข่วนขาคนเก็บขยะ กักในกรงเหล็ก',
  },
  {
    id: 'Q-2569-017',
    code: 'Q-2569-017',
    animalName: 'สุนัขจรจัดสีเผือก',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'อบต.หนองบัว',
    district: 'อ.นามน',
    subdistrict: 'ต.ยอดแกง',
    village: 'ม.4 บ้านยอดแกง',
    startDate: '2026-10-24', // 2 days elapsed (Day 2/14)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'วิ่งไล่กัดชาวบ้านกรีดยาง เจ้าหน้าที่จับกักตัว',
  },
  {
    id: 'Q-2569-018',
    code: 'Q-2569-018',
    animalName: 'เจ้าทองคำ',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นางสมจิตต์ บุญเลิศ',
    district: 'อ.ร่องคำ',
    subdistrict: 'ต.ร่องคำ',
    village: 'ม.2 บ้านร่องคำ',
    startDate: '2026-10-25', // 1 day elapsed (Day 1/14 - เพิ่งเริ่มเมื่อวาน)
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กัดหลานสาวขณะแย่งอาหาร กักตัวในบ้านอย่างเคร่งครัด',
  },

  // 6 แสดงอาการสงสัย (Symptomatic / Watch)
  {
    id: 'Q-2569-S01',
    code: 'Q-2569-S01',
    animalName: 'สุนัขจรจัดหัวดำ',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'กักตัวเทศบาลกมลาไสย',
    district: 'อ.กมลาไสย',
    subdistrict: 'ต.หลักเมือง',
    village: 'ม.1 บ้านหลักเมือง',
    startDate: '2026-10-18',
    quarantineDays: 14,
    clinicalStatus: 'symptomatic',
    symptomDetails: 'เริ่มมีน้ำลายไหลย้อย กระวนกระวาย วิ่งชนกรง ปฏิเสธอาหาร',
    notes: 'ปศุสัตว์แยกกรงเดี่ยวเฝ้าระวังระดับสูงสุด (ระยะที่ 2 ดุร้าย)',
  },
  {
    id: 'Q-2569-S02',
    code: 'Q-2569-S02',
    animalName: 'เจ้าดื้อ',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายทองพูน วงษ์สว่าง',
    district: 'อ.เมืองกาฬสินธุ์',
    subdistrict: 'ต.โพนทอง',
    village: 'ม.6 บ้านโพนทอง',
    startDate: '2026-10-19',
    quarantineDays: 14,
    clinicalStatus: 'symptomatic',
    symptomDetails: 'มีไข้ ซึม แอบในมุมมืด ม่านตาขยาย เสียงเห่าแหบพร่า',
    notes: 'เจ้าของรายงานอาการทางคลินิกระยะที่ 1 พฤติกรรมเปลี่ยน',
  },
  {
    id: 'Q-2569-S03',
    code: 'Q-2569-S03',
    animalName: 'เจ้าพยัคฆ์',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'พิทบูล',
    ownership: 'owned',
    ownerName: 'นายสมบัติ ภูผา',
    district: 'อ.ยางตลาด',
    subdistrict: 'ต.หัวนาคำ',
    village: 'ม.3 บ้านหัวนาคำ',
    startDate: '2026-10-20',
    quarantineDays: 14,
    clinicalStatus: 'symptomatic',
    symptomDetails: 'กัดกรงเหล็กจนฟันหัก ตาขวาง น้ำลายไหล ไม่กินน้ำ',
    notes: 'ประสาน ศวพ. เตรียมรับซากหากเสียชีวิต',
  },
  {
    id: 'Q-2569-S04',
    code: 'Q-2569-S04',
    animalName: 'สุนัขจรจัดสีเทา',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ปศุสัตว์สมเด็จ',
    district: 'อ.สมเด็จ',
    subdistrict: 'ต.ผาเสวย',
    village: 'ม.2 บ้านผาเสวย',
    startDate: '2026-10-21',
    quarantineDays: 14,
    clinicalStatus: 'symptomatic',
    symptomDetails: 'ขาหลังเริ่มอ่อนแรง เดินโซเซ ขากรรไกรตก ลิ้นห้อย',
    notes: 'เข้าสู่ระยะอัมพาต (ระยะที่ 3) คาดเสียชีวิตภายใน 24-48 ชม.',
  },
  {
    id: 'Q-2569-S05',
    code: 'Q-2569-S05',
    animalName: 'เจ้าบุญรอด',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวไทยวิเชียรมาศ',
    ownership: 'owned',
    ownerName: 'นางประนอม ศิริชัย',
    district: 'อ.กุฉินารายณ์',
    subdistrict: 'ต.เหล่าใหญ่',
    village: 'ม.5 บ้านเหล่าใหญ่',
    startDate: '2026-10-21',
    quarantineDays: 14,
    clinicalStatus: 'symptomatic',
    symptomDetails: 'ซึมผิดปกติ ไม่กลืนน้ำลาย ดุร้ายเมื่อเข้าใกล้',
    notes: 'กักในกรงมิดชิด ป้องกันการสัมผัสน้ำลาย 100%',
  },
  {
    id: 'Q-2569-S06',
    code: 'Q-2569-S06',
    animalName: 'สุนัขจรจัดข้างวัด',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'อบต.ลำปาว',
    district: 'อ.เมืองกาฬสินธุ์',
    subdistrict: 'ต.ลำปาว',
    village: 'ม.7 บ้านดงน้อย',
    startDate: '2026-10-22',
    quarantineDays: 14,
    clinicalStatus: 'symptomatic',
    symptomDetails: 'วิ่งวนไร้ทิศทาง กัดใบไม้และดิน น้ำลายฟูมปาก',
    notes: 'เจ้าหน้าที่เข้าควบคุมในกรงปิด',
  },

  // 14 ตัวอย่างสัตว์ที่กักครบ 14 วัน ปกติ (Completed Quarantine) ในรอบเดือนนี้
  {
    id: 'Q-2569-C01',
    code: 'Q-2569-C01',
    animalName: 'เจ้าลัคกี้',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'พุดเดิ้ล',
    ownership: 'owned',
    ownerName: 'นางมาลี ดวงแก้ว',
    district: 'อ.เมืองกาฬสินธุ์',
    subdistrict: 'ต.หนองกุง',
    village: 'ม.3 บ้านหนองกุง',
    startDate: '2026-10-10', // 16 days ago -> Completed
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน สุขภาพแข็งแรงดี ปลดการกักตัว และนัดฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าทันที',
  },
  {
    id: 'Q-2569-C02',
    code: 'Q-2569-C02',
    animalName: 'เจ้าเพชร',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายจำรัส พลศรี',
    district: 'อ.ยางตลาด',
    subdistrict: 'ต.บัวบาน',
    village: 'ม.8 บ้านบัวบาน',
    startDate: '2026-10-09', // 17 days ago -> Completed
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ ไม่พบอาการทางประสาท ปลอดโรค',
  },
  {
    id: 'Q-2569-C03',
    code: 'Q-2569-C03',
    animalName: 'เจ้าม้าว',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวสามสี',
    ownership: 'owned',
    ownerName: 'นางสาวรัชนี สายทอง',
    district: 'อ.กมลาไสย',
    subdistrict: 'ต.โคกสมบูรณ์',
    village: 'ม.2 บ้านโคก',
    startDate: '2026-10-08', // 18 days ago -> Completed
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปลอดภัย ผู้ถูกกัดได้รับวัคซีนครบ 3 เข็มแรกแล้ว ปลอดภัย',
  },
  {
    id: 'Q-2569-C04',
    code: 'Q-2569-C04',
    animalName: 'เจ้าแดง',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'เทศบาลสมเด็จ',
    district: 'อ.สมเด็จ',
    subdistrict: 'ต.ลำห้วยหลัว',
    village: 'ม.4 บ้านลำห้วย',
    startDate: '2026-10-07', // 19 days ago -> Completed
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ ทำหมันและฉีดวัคซีนแล้ว',
  },
  {
    id: 'Q-2569-C05',
    code: 'Q-2569-C05',
    animalName: 'เจ้าบราวนี่',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ลาบราดอร์ผสม',
    ownership: 'owned',
    ownerName: 'พ.ต.ท.สมพงษ์ เจริญผล',
    district: 'อ.สหัสขันธ์',
    subdistrict: 'ต.โนนน้ำเกลี้ยง',
    village: 'ม.5 บ้านโนนน้ำเกลี้ยง',
    startDate: '2026-10-06',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ผลการตรวจสุขภาพปกติ',
  },
  {
    id: 'Q-2569-C06',
    code: 'Q-2569-C06',
    animalName: 'เจ้าทองขาว',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายณรงค์ เกษตรสม',
    district: 'อ.กุฉินารายณ์',
    subdistrict: 'ต.สมสะอาด',
    village: 'ม.1 บ้านสมสะอาด',
    startDate: '2026-10-05',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ ปลดการกัก',
  },
  {
    id: 'Q-2569-C07',
    code: 'Q-2569-C07',
    animalName: 'เจ้าสำลี',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวไทยขาวมณี',
    ownership: 'owned',
    ownerName: 'นางดวงใจ มณีรัตน์',
    district: 'อ.คำม่วง',
    subdistrict: 'ต.โพน',
    village: 'ม.3 บ้านโพน',
    startDate: '2026-10-04',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ',
  },
  {
    id: 'Q-2569-C08',
    code: 'Q-2569-C08',
    animalName: 'สุนัขจรสีเทาเข้ม',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ปศุสัตว์หนองกุงศรี',
    district: 'อ.หนองกุงศรี',
    subdistrict: 'ต.โคกเครือ',
    village: 'ม.6 บ้านโคกเครือ',
    startDate: '2026-10-03',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ฉีดวัคซีนแล้วส่งศูนย์พักพิง',
  },
  {
    id: 'Q-2569-C09',
    code: 'Q-2569-C09',
    animalName: 'เจ้าตาลโตนด',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายสายชล มารักษ์',
    district: 'อ.ห้วยเม็ก',
    subdistrict: 'ต.กุดเจ่า',
    village: 'ม.2 บ้านกุดเจ่า',
    startDate: '2026-10-02',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน แข็งแรง ปกติ',
  },
  {
    id: 'Q-2569-C10',
    code: 'Q-2569-C10',
    animalName: 'เจ้ามอมแมม',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'อบต.ห้วยผึ้ง',
    district: 'อ.ห้วยผึ้ง',
    subdistrict: 'ต.คำบง',
    village: 'ม.4 บ้านคำบง',
    startDate: '2026-10-01',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ',
  },
  {
    id: 'Q-2569-C11',
    code: 'Q-2569-C11',
    animalName: 'เจ้านิล',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายพงษ์พันธ์ จันทร์หอม',
    district: 'อ.นามน',
    subdistrict: 'ต.นามน',
    village: 'ม.1 บ้านนามน',
    startDate: '2026-09-29',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ',
  },
  {
    id: 'Q-2569-C12',
    code: 'Q-2569-C12',
    animalName: 'เจ้าดวงดี',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'บางแก้วผสม',
    ownership: 'owned',
    ownerName: 'นางคำภา บุญประเสริฐ',
    district: 'อ.ร่องคำ',
    subdistrict: 'ต.เหล่าอ้อย',
    village: 'ม.3 บ้านเหล่าอ้อย',
    startDate: '2026-09-28',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ',
  },
  {
    id: 'Q-2569-C13',
    code: 'Q-2569-C13',
    animalName: 'เจ้าจ้อย',
    species: 'cat',
    speciesLabel: 'แมว (Cat)',
    breed: 'แมวไทยลายสลิด',
    ownership: 'owned',
    ownerName: 'นายสุริยันต์ อินทร์แปลง',
    district: 'อ.เขาวง',
    subdistrict: 'ต.คุ้มเก่า',
    village: 'ม.2 บ้านคุ้มเก่า',
    startDate: '2026-09-27',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ',
  },
  {
    id: 'Q-2569-C14',
    code: 'Q-2569-C14',
    animalName: 'เจ้ามั่งคง',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยพันธุ์ทาง',
    ownership: 'owned',
    ownerName: 'นายถนอม ศรีสว่าง',
    district: 'อ.นาคู',
    subdistrict: 'ต.นาคู',
    village: 'ม.5 บ้านนาคู',
    startDate: '2026-09-26',
    quarantineDays: 14,
    clinicalStatus: 'normal',
    notes: 'กักครบ 14 วัน ปกติ',
  },

  // 32 ตัว สัตว์ที่ตายระหว่างกัก และตรวจยืนยันผลบวก (Dead during quarantine / Positive heads)
  {
    id: 'Q-2569-D01',
    code: 'Q-2569-D01',
    animalName: 'สุนัขจรจัดหัวขาด',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ไม่ทราบเจ้าของ',
    district: 'อ.เมืองกาฬสินธุ์',
    subdistrict: 'ต.ลำปาว',
    village: 'ม.3 บ้านดงน้อย',
    startDate: '2026-10-12',
    quarantineDays: 14,
    clinicalStatus: 'dead',
    symptomDetails: 'ตายในวันที่ 3 ของการกักตัวหลังมีอาการน้ำลายไหล ชักเกร็ง ขากรรไกรแข็ง',
    notes: 'ส่งหัวตรวจ ศวพ.ขอนแก่น ผลบวก DFA & RT-PCR (หัวที่ 32 ของจังหวัด)',
  },
  {
    id: 'Q-2569-D02',
    code: 'Q-2569-D02',
    animalName: 'สุนัขจรจัดเพศผู้',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ไม่ทราบเจ้าของ',
    district: 'อ.ยางตลาด',
    subdistrict: 'ต.ยางตลาด',
    village: 'ม.7 ชุมชนหนองบัว',
    startDate: '2026-09-18',
    quarantineDays: 14,
    clinicalStatus: 'dead',
    symptomDetails: 'ตายหลังกักดูอาการได้ 2 วัน กัดคนและสุนัขตัวอื่น',
    notes: 'ผลบวก DFA ยืนยันเชื้อไวรัสโรคพิษสุนัขบ้า ประกาศเขตควบคุมโรค 5 กม.',
  },
  {
    id: 'Q-2569-D03',
    code: 'Q-2569-D03',
    animalName: 'โคเนื้อเพศเมีย',
    species: 'cattle',
    speciesLabel: 'โค/วัว (Bovine)',
    breed: 'ลูกผสมบราห์มัน',
    ownership: 'owned',
    ownerName: 'นายประดิษฐ์ ผ่องใส',
    district: 'อ.กมลาไสย',
    subdistrict: 'ต.ดงลิง',
    village: 'ม.5 บ้านดงลิง',
    startDate: '2026-08-22',
    quarantineDays: 14,
    clinicalStatus: 'dead',
    symptomDetails: 'ชักเกร็ง น้ำลายไหลย้อย ขาหลังอัมพาต ล้มลงตายในคอก',
    notes: 'ถูกสุนัขบ้ากัดที่จมูกเมื่อ 3 สัปดาห์ก่อน ผลตรวจสมองพบเชื้อพิษสุนัขบ้า (เคสโค 1 ตัว)',
  },
  {
    id: 'Q-2569-D04',
    code: 'Q-2569-D04',
    animalName: 'สุนัขจรจัดสีด่างลายจุด',
    species: 'dog',
    speciesLabel: 'สุนัข (Dog)',
    breed: 'ไทยจรจัด',
    ownership: 'stray',
    ownerName: 'ไม่ทราบเจ้าของ',
    district: 'อ.สมเด็จ',
    subdistrict: 'ต.สมเด็จ',
    village: 'ม.8 บ้านสมเด็จ',
    startDate: '2026-08-14',
    quarantineDays: 14,
    clinicalStatus: 'dead',
    symptomDetails: 'ตายระหว่างกักวันที่ 4',
    notes: 'ศวพ.ขอนแก่น ยืนยันผลบวก',
  },
];

export interface QuarantineProgress {
  daysElapsed: number;
  daysRemaining: number;
  progressPercent: number;
  category: 'active' | 'completed' | 'symptomatic' | 'dead';
  statusLabel: string;
  isCompleted: boolean;
}

/**
 * คำนวณสถานะความคืบหน้าของการกักสัตว์ 14 วัน ตามวันเวลาอ้างอิงจริง
 * (ถ้าผ่านไปครบ 14 วัน และไม่มีอาการป่วย จะ Auto-Roll กลายเป็น 'completed' อัตโนมัติ!)
 */
export function calculateQuarantineProgress(
  animal: QuarantineAnimal,
  referenceDate: Date = new Date('2026-10-26T12:00:00')
): QuarantineProgress {
  // วันที่เริ่มกักตัว
  const [year, month, day] = animal.startDate.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  
  // คำนวณจำนวนวันที่ผ่านไป (นับแบบ 24 ชั่วโมงต่อวัน)
  const diffTime = referenceDate.getTime() - start.getTime();
  const rawDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.max(1, rawDays + 1); // วันแรกที่เริ่มนับเป็นวันที่ 1
  const daysRemaining = Math.max(0, 14 - daysElapsed);
  const progressPercent = Math.min(100, Math.round((daysElapsed / 14) * 100));

  // 1. ถ้าสัตว์ตายระหว่างกัก
  if (animal.clinicalStatus === 'dead') {
    return {
      daysElapsed,
      daysRemaining: 0,
      progressPercent: 100,
      category: 'dead',
      statusLabel: 'ตายระหว่างกัก (ส่งตรวจ Lab)',
      isCompleted: false,
    };
  }

  // 2. ถ้าสัตว์แสดงอาการสงสัยทางประสาท
  if (animal.clinicalStatus === 'symptomatic') {
    return {
      daysElapsed,
      daysRemaining,
      progressPercent,
      category: 'symptomatic',
      statusLabel: 'แสดงอาการสงสัย (เฝ้าระวังพิเศษ)',
      isCompleted: false,
    };
  }

  // 3. ถ้ากักครบ 14 วันแล้ว (daysElapsed >= 14 วัน หรือ rawDays >= 14) และสัตว์ปกติ -> Auto-Graduate!
  if (daysElapsed >= 14 || rawDays >= 14) {
    return {
      daysElapsed: Math.min(14, daysElapsed),
      daysRemaining: 0,
      progressPercent: 100,
      category: 'completed',
      statusLabel: 'กักครบ 14 วัน ปกติ (พ้นระยะสงสัย ปลอดโรค)',
      isCompleted: true,
    };
  }

  // 4. ยังอยู่ระหว่างกักดูอาการ (< 14 วัน)
  return {
    daysElapsed,
    daysRemaining,
    progressPercent,
    category: 'active',
    statusLabel: `อยู่ระหว่างกักดูอาการ (วันที่ ${daysElapsed}/14)`,
    isCompleted: false,
  };
}

/**
 * คำนวณสถิติภาพรวม Dynamic สรุป 4 ช่อง
 */
export function computeQuarantineSummary(
  animals: QuarantineAnimal[],
  referenceDate: Date = new Date('2026-10-26T12:00:00'),
  districtFilter: string = 'all'
) {
  // กรองตามอำเภอถ้ามี
  const filtered = animals.filter(a => {
    if (!districtFilter || districtFilter === 'all') return true;
    const target = districtFilter.replace(/^อ\./, '').trim();
    const itemDistrict = a.district.replace(/^อ\./, '').trim();
    return itemDistrict.includes(target) || target.includes(itemDistrict);
  });

  let activeCount = 0;
  let symptomaticCount = 0;
  let dynamicCompletedCount = 0;
  let deadInList = 0;

  for (const animal of filtered) {
    const prog = calculateQuarantineProgress(animal, referenceDate);
    if (prog.category === 'dead') {
      deadInList++;
    } else if (prog.category === 'symptomatic') {
      symptomaticCount++;
    } else if (prog.category === 'completed') {
      dynamicCompletedCount++;
    } else {
      activeCount++;
    }
  }

  // ถ้าระดับทั้งจังหวัด ใช้ค่า Baseline สะสมรวมของจังหวัด + สัตว์ที่เพิ่งครบกำหนดในระบบ Dynamic
  const isAllProvince = districtFilter === 'all';
  const completedCount = isAllProvince 
    ? (HISTORICAL_COMPLETED_BASELINE + dynamicCompletedCount)
    : Math.max(dynamicCompletedCount, Math.round(HISTORICAL_COMPLETED_BASELINE / 18) + dynamicCompletedCount);

  // สัตว์ตายตรวจผลบวกสะสม (32 ตัวทั้งจังหวัด หรือสัดส่วนตามอำเภอ)
  const deadCount = isAllProvince ? 32 : Math.max(deadInList, 1);

  const totalMonitored = activeCount + completedCount + symptomaticCount + deadCount;
  const safePercent = totalMonitored > 0 ? ((completedCount / totalMonitored) * 100).toFixed(1) : '0.0';

  return {
    active: activeCount,
    completed: completedCount,
    symptomatic: symptomaticCount,
    dead: deadCount,
    total: totalMonitored,
    safePercent,
    filteredAnimals: filtered,
  };
}
