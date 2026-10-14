'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/data-context';
import { kalasinDistricts, kalasinSubdistricts } from '@/lib/mock-data';
import { FiscalYear } from '@/types';
import { AlertCircle, PlusCircle, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

// Coordinates per district for default map pin
const districtCoords: Record<string, [number, number]> = {
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
};

export function NewCaseDialog() {
  const { isNewCaseOpen, setIsNewCaseOpen, addPatient, selectedYear } = useData();

  // Form states
  const [year, setYear] = useState<FiscalYear>(selectedYear);
  const [hn, setHn] = useState('KS67016');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  
  // Village-level granularity (ข้อ 2: บันทึกย่อยถึงระดับหมู่บ้าน)
  const [district, setDistrict] = useState('อ.เมืองกาฬสินธุ์');
  const [subdistrict, setSubdistrict] = useState('ต.กาฬสินธุ์');
  const [villageNo, setVillageNo] = useState('หมู่ 1');
  const [villageName, setVillageName] = useState('');

  // Coordinates (ข้อ 3: พิกัดแผนที่ รัศมี 5 กม.)
  const [latitude, setLatitude] = useState('16.4322');
  const [longitude, setLongitude] = useState('103.5065');

  const [exposureDate, setExposureDate] = useState('2026-10-09');
  const [exposureType, setExposureType] = useState('bite');
  const [woundSite, setWoundSite] = useState('มือ/แขน');
  const [woundCategory, setWoundCategory] = useState<'I' | 'II' | 'III'>('II');
  const [animalSpecies, setAnimalSpecies] = useState('dog');
  const [animalOwnership, setAnimalOwnership] = useState('stray');
  const [hospital, setHospital] = useState('โรงพยาบาลกาฬสินธุ์');
  const [rigGiven, setRigGiven] = useState(false);
  const [regimen, setRegimen] = useState('Essen (5 เข็ม)');

  // Sync year and default dates when dialog opens
  useEffect(() => {
    if (isNewCaseOpen) {
      setYear(selectedYear);
      setHn(`KS670${Math.floor(16 + Math.random() * 80)}`);
      setExposureDate(new Date().toISOString().split('T')[0]);
    }
  }, [isNewCaseOpen, selectedYear]);

  // When district changes, update subdistrict and coords automatically
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const subList = kalasinSubdistricts[newDistrict] || [];
    if (subList.length > 0) {
      setSubdistrict(subList[0]);
    } else {
      setSubdistrict('');
    }
    const coords = districtCoords[newDistrict];
    if (coords) {
      const offsetLat = (coords[0] + (Math.random() - 0.5) * 0.02).toFixed(4);
      const offsetLng = (coords[1] + (Math.random() - 0.5) * 0.02).toFixed(4);
      setLatitude(offsetLat);
      setLongitude(offsetLng);
    }
  };

  // Auto-set RIG recommendation when Cat III is selected
  const handleCategoryChange = (val: 'I' | 'II' | 'III') => {
    setWoundCategory(val);
    if (val === 'III') {
      setRigGiven(true);
    } else {
      setRigGiven(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อ-นามสกุลของผู้สัมผัสโรค (ระบบจะปกปิดตาม PDPA ให้อัตโนมัติ)');
      return;
    }

    addPatient({
      hn: hn || `KS670${Math.floor(10 + Math.random() * 89)}`,
      name: name.trim(),
      age: parseInt(age) || 30,
      exposure_date: exposureDate,
      wound_category: woundCategory,
      vaccine_status: '1/5',
      follow_up_status: 'pending',
      phone: phone.trim(),
      district: district,
      subdistrict: subdistrict.trim(),
      village_no: villageNo.trim(),
      village_name: villageName.trim(),
      latitude: parseFloat(latitude) || 16.4322,
      longitude: parseFloat(longitude) || 103.5065,
      year: year,
      wound_site: woundSite,
      exposure_type: exposureType,
      animal_species: animalSpecies,
      hospital: hospital,
      rig_given: rigGiven,
    });

    // Reset form
    setName('');
    setAge('');
    setPhone('');
    setVillageName('');
    setIsNewCaseOpen(false);
  };

  const availableSubdistricts = kalasinSubdistricts[district] || [];

  return (
    <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
      <DialogContent className="w-[96vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-3.5 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-blue-600">
              <PlusCircle className="w-5 h-5 shrink-0" />
              <DialogTitle className="text-lg sm:text-xl">บันทึกข้อมูลผู้สัมผัสโรครายใหม่</DialogTitle>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">PDPA Compliance</span>
            </div>
          </div>
          <DialogDescription className="text-xs">
            บันทึกประวัติการสัมผัสโรคละเอียดถึงระดับหมู่บ้าน พร้อมปักหมุดพิกัดและสร้างวงรัศมีเฝ้าระวัง 5 กิโลเมตร
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* ข้อมูลประจำปี พ.ศ. & ข้อมูลทั่วไป */}
          <div className="bg-slate-50 p-3 sm:p-3.5 rounded-lg border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>👤</span> ข้อมูลทั่วไปของผู้สัมผัสโรค
              </h4>
              <div className="flex items-center gap-2">
                <Label htmlFor="year-select" className="text-xs font-medium text-slate-600">ปีงบประมาณ พ.ศ.:</Label>
                <Select value={year} onValueChange={(val) => { if (val) setYear(val as FiscalYear); }}>
                  <SelectTrigger id="year-select" className="h-7 w-[110px] text-xs font-bold bg-white text-blue-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2568">พ.ศ. 2568</SelectItem>
                    <SelectItem value="2569">พ.ศ. 2569</SelectItem>
                    <SelectItem value="2570">พ.ศ. 2570</SelectItem>
                    <SelectItem value="2571">พ.ศ. 2571</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="hn" className="text-xs">เลข HN</Label>
                <Input 
                  id="hn" 
                  value={hn} 
                  onChange={(e) => setHn(e.target.value)} 
                  className="h-8 text-xs font-semibold text-blue-600 bg-white" 
                  required 
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="name" className="text-xs flex items-center justify-between">
                  <span>ชื่อ - นามสกุล <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-emerald-600 font-normal">🛡️ จะถูกปิดบังชื่อตาม PDPA</span>
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="เช่น นายสมหมาย ลำปาว" 
                  className="h-8 text-xs bg-white" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-xs">อายุ (ปี)</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  placeholder="35" 
                  className="h-8 text-xs bg-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone" className="text-xs">เบอร์โทรศัพท์ติดต่อ (เข้ารหัสในฐานข้อมูล)</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="081-xxxxxxx" 
                  className="h-8 text-xs bg-white" 
                />
              </div>
              <div>
                <Label htmlFor="hospital" className="text-xs">สถานพยาบาลที่ให้การรักษา</Label>
                <Select value={hospital} onValueChange={(val) => { if (val) setHospital(val); }}>
                  <SelectTrigger id="hospital" className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    <SelectItem value="โรงพยาบาลกาฬสินธุ์">รพ.กาฬสินธุ์</SelectItem>
                    <SelectItem value="โรงพยาบาลสมเด็จพระยุพราชกุฉินารายณ์">รพ.สมเด็จพระยุพราชกุฉินารายณ์</SelectItem>
                    <SelectItem value="โรงพยาบาลยางตลาด">รพ.ยางตลาด</SelectItem>
                    <SelectItem value="โรงพยาบาลกมลาไสย">รพ.กมลาไสย</SelectItem>
                    <SelectItem value="โรงพยาบาลสมเด็จ">รพ.สมเด็จ</SelectItem>
                    <SelectItem value="โรงพยาบาลสหัสขันธ์">รพ.สหัสขันธ์</SelectItem>
                    <SelectItem value="โรงพยาบาลหนองกุงศรี">รพ.หนองกุงศรี</SelectItem>
                    <SelectItem value="โรงพยาบาลห้วยเม็ก">รพ.ห้วยเม็ก</SelectItem>
                    <SelectItem value="โรงพยาบาลเขาวง">รพ.เขาวง</SelectItem>
                    <SelectItem value="โรงพยาบาลท่าคันโท">รพ.ท่าคันโท</SelectItem>
                    <SelectItem value="โรงพยาบาลคำม่วง">รพ.คำม่วง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ข้อมูลที่อยู่ระดับหมู่บ้าน และพิกัดแผนที่ (ข้อ 2 & 3) */}
          <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> ที่อยู่ระดับหมู่บ้านและพิกัด (รัศมี 5 กม.)
              </h4>
              <Badge variant="outline" className="text-[10px] bg-blue-100/70 text-blue-800 border-blue-300">
                ⭕ สร้างวงรัศมีเฝ้าระวัง 5,000 เมตร
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* อำเภอ */}
              <div>
                <Label className="text-xs">อำเภอ (จ.กาฬสินธุ์)</Label>
                <Select value={district} onValueChange={(val) => { if (val) handleDistrictChange(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {kalasinDistricts.filter(d => d.id !== 'all').map(d => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ตำบล */}
              <div>
                <Label className="text-xs">ตำบล</Label>
                <Select value={subdistrict} onValueChange={(val) => { if (val) setSubdistrict(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {availableSubdistricts.map(s => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* หมู่ที่ */}
              <div>
                <Label htmlFor="villageNo" className="text-xs">หมู่ที่</Label>
                <Input 
                  id="villageNo" 
                  value={villageNo} 
                  onChange={(e) => setVillageNo(e.target.value)} 
                  placeholder="เช่น หมู่ 4" 
                  className="h-8 text-xs bg-white" 
                />
              </div>

              {/* ชื่อหมู่บ้าน/ชุมชน */}
              <div>
                <Label htmlFor="villageName" className="text-xs">ชื่อหมู่บ้าน / ชุมชน</Label>
                <Input 
                  id="villageName" 
                  value={villageName} 
                  onChange={(e) => setVillageName(e.target.value)} 
                  placeholder="เช่น บ้านตูม, คุ้มโฮง" 
                  className="h-8 text-xs bg-white" 
                />
              </div>
            </div>

            {/* ละติจูด / ลองจิจูด */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-blue-100">
              <div>
                <Label htmlFor="latitude" className="text-xs text-slate-600">พิกัดละติจูด (Latitude)</Label>
                <Input 
                  id="latitude" 
                  value={latitude} 
                  onChange={(e) => setLatitude(e.target.value)} 
                  placeholder="เช่น 16.4322" 
                  className="h-8 text-xs font-mono bg-white" 
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-xs text-slate-600">พิกัดลองจิจูด (Longitude)</Label>
                <Input 
                  id="longitude" 
                  value={longitude} 
                  onChange={(e) => setLongitude(e.target.value)} 
                  placeholder="เช่น 103.5065" 
                  className="h-8 text-xs font-mono bg-white" 
                />
              </div>
            </div>
            <p className="text-[11px] text-blue-700">
              ℹ️ พิกัดจะถูกใช้สร้างหมุดบนแผนที่ระบาดวิทยาและวาดวงรัศมีควบคุมโรค 5 กิโลเมตร (5,000 ม.) ทันทีที่บันทึก
            </p>
          </div>

          {/* ข้อมูลการสัมผัสโรคและบาดแผล */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🩸</span> ลักษณะการสัมผัสโรค และการประเมินบาดแผล (WHO)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="exposureDate" className="text-xs">วันที่ถูกกัด/สัมผัส</Label>
                <Input 
                  id="exposureDate" 
                  type="date" 
                  value={exposureDate} 
                  onChange={(e) => setExposureDate(e.target.value)} 
                  className="h-8 text-xs bg-white" 
                  required 
                />
              </div>
              <div>
                <Label className="text-xs">ลักษณะการสัมผัส</Label>
                <Select value={exposureType} onValueChange={(val) => { if (val) setExposureType(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bite">ถูกกัด (Bite)</SelectItem>
                    <SelectItem value="scratch">ถูกข่วน (Scratch)</SelectItem>
                    <SelectItem value="lick">เลียแผล/เยื่อบุ (Lick on broken skin)</SelectItem>
                    <SelectItem value="contact">สัมผัสซากสัตว์/น้ำลาย</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">ตำแหน่งบาดแผล</Label>
                <Select value={woundSite} onValueChange={(val) => { if (val) setWoundSite(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="มือ/แขน">มือ / แขน</SelectItem>
                    <SelectItem value="ขา/เท้า">ขา / เท้า</SelectItem>
                    <SelectItem value="ใบหน้า/ศีรษะ">ใบหน้า / ศีรษะ (เสี่ยงสูงมาก)</SelectItem>
                    <SelectItem value="ลำตัว">ลำตัว</SelectItem>
                    <SelectItem value="หลายตำแหน่ง">หลายตำแหน่ง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* WHO Category Selector */}
            <div className="pt-1">
              <Label className="text-xs font-semibold mb-1.5 block">การประเมินระดับความรุนแรงตามเกณฑ์ WHO Category</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('I')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    woundCategory === 'I'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Category I</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">สัมผัส/เลียผิวปกติ ไม่เป็นแผล</div>
                  <Badge variant="outline" className="mt-1 text-[9px] text-blue-700 bg-blue-100/50">ล้างแผลอย่างเดียว</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('II')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    woundCategory === 'II'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Category II</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">รอยข่วน แผลถลอก ไม่มีเลือด</div>
                  <Badge variant="outline" className="mt-1 text-[9px] text-amber-700 bg-amber-100/50">ล้างแผล + ฉีดวัคซีน</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('III')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    woundCategory === 'III'
                      ? 'border-red-600 bg-red-50 text-red-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-red-700">Category III</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">แผลลึก เลือดออก เลียเยื่อบุ</div>
                  <Badge variant="outline" className="mt-1 text-[9px] text-red-700 bg-red-100/50">ล้างแผล + วัคซีน + RIG</Badge>
                </button>
              </div>

              {woundCategory === 'III' && (
                <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0" />
                  <span><strong>คำแนะนำด่วน:</strong> ผู้สัมผัสระดับ Cat III ต้องได้รับวัคซีนพร้อม Rabies Immunoglobulin (RIG) แทรกซึมรอบแผลทันทีใน Day 0 และระบบจะส่งสัญญาณเตือนภัยฉุกเฉิน</span>
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลสัตว์และการรักษา */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>🐕</span> ข้อมูลสัตว์และการรักษา (PEP)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">ชนิดสัตว์</Label>
                <Select value={animalSpecies} onValueChange={(val) => { if (val) setAnimalSpecies(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">สุนัข (Dog)</SelectItem>
                    <SelectItem value="cat">แมว (Cat)</SelectItem>
                    <SelectItem value="cattle">โค - กระบือ (Cattle)</SelectItem>
                    <SelectItem value="bat">ค้างคาว (Bat)</SelectItem>
                    <SelectItem value="other">สัตว์เลี้ยงลูกด้วยนมอื่นๆ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">สถานะสัตว์</Label>
                <Select value={animalOwnership} onValueChange={(val) => { if (val) setAnimalOwnership(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">มีเจ้าของ (กักสังเกต 10 วัน)</SelectItem>
                    <SelectItem value="stray">สัตว์จรจัด / ไม่ทราบประวัติ</SelectItem>
                    <SelectItem value="dead">สัตว์ตาย (ส่งตัดหัวตรวจ Lab)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">สูตรการฉีดวัคซีน (Regimen)</Label>
                <Select value={regimen} onValueChange={(val) => { if (val) setRegimen(val); }}>
                  <SelectTrigger className="h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Essen (5 เข็ม)">Essen IM (Day 0, 3, 7, 14, 28)</SelectItem>
                    <SelectItem value="TRC (2-2-2-0-2)">Thai Red Cross ID (4 ครั้ง)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="rigCheckbox"
                checked={rigGiven}
                onChange={(e) => setRigGiven(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <Label htmlFor="rigCheckbox" className="text-xs font-medium cursor-pointer">
                ได้รับเซรุ่มป้องกันโรค (Rabies Immunoglobulin - RIG) ใน Day 0 เรียบร้อยแล้ว
              </Label>
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsNewCaseOpen(false)}
              className="w-full sm:w-auto text-xs"
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
            >
              <CheckCircle2 size={15} /> บันทึกข้อมูลและสร้างจุดพิกัดรัศมี 5 กม.
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
