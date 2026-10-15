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
import { Edit3, Trash2, Check, ShieldCheck } from 'lucide-react';

export function EditPatientDialog() {
  const { 
    editingPatient, 
    setEditingPatient, 
    updatePatient, 
    deletePatient, 
    isPdpaActive, 
    getDisplayName 
  } = useData();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [vaccineStatus, setVaccineStatus] = useState('1/5');
  const [followUpStatus, setFollowUpStatus] = useState<'completed' | 'pending' | 'overdue'>('pending');
  const [woundCategory, setWoundCategory] = useState<'I' | 'II' | 'III'>('II');
  const [notes, setNotes] = useState('');
  const [district, setDistrict] = useState('อ.เมืองกาฬสินธุ์');
  const [subdistrict, setSubdistrict] = useState('');
  const [villageNo, setVillageNo] = useState('');
  const [villageName, setVillageName] = useState('');
  const [year, setYear] = useState<FiscalYear>('2569');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name);
      setAge(editingPatient.age.toString());
      setVaccineStatus(editingPatient.vaccine_status);
      setFollowUpStatus(editingPatient.follow_up_status);
      setWoundCategory(editingPatient.wound_category);
      setNotes(editingPatient.notes || '');
      setDistrict(editingPatient.district || 'อ.เมืองกาฬสินธุ์');
      setSubdistrict(editingPatient.subdistrict || '');
      setVillageNo(editingPatient.village_no || '');
      setVillageName(editingPatient.village_name || '');
      setYear((editingPatient.year as FiscalYear) || '2569');
      setConfirmDelete(false);
    }
  }, [editingPatient]);

  if (!editingPatient) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(editingPatient.hn, {
      name: name.trim(),
      age: parseInt(age) || editingPatient.age,
      vaccine_status: vaccineStatus,
      follow_up_status: followUpStatus,
      wound_category: woundCategory,
      notes: notes.trim(),
      district: district,
      subdistrict: subdistrict.trim(),
      village_no: villageNo.trim(),
      village_name: villageName.trim(),
      year: year,
    });
    setEditingPatient(null);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deletePatient(editingPatient.hn);
    setEditingPatient(null);
  };

  const availableSubdistricts = kalasinSubdistricts[district] || [];

  return (
    <Dialog open={!!editingPatient} onOpenChange={(open) => !open && setEditingPatient(null)}>
      <DialogContent className="w-[96vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-3.5 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Edit3 className="w-5 h-5 shrink-0" />
              <DialogTitle className="text-base sm:text-lg">แก้ไขข้อมูลผู้สัมผัสโรค (HN: {editingPatient.hn})</DialogTitle>
            </div>
            {isPdpaActive && (
              <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-300 flex items-center gap-1 self-start sm:self-auto">
                <ShieldCheck size={12} /> PDPA Active
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs">
            อัปเดตข้อมูลระดับหมู่บ้าน ความคืบหน้าการฉีดวัคซีน และสถานะการติดตาม
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label className="text-xs">ชื่อ - นามสกุล</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-8 text-xs font-medium" 
                  required 
                />
              </div>
              <div>
                <Label className="text-xs">ปีงบประมาณ</Label>
                <Select value={year} onValueChange={(val) => { if (val) setYear(val as FiscalYear); }}>
                  <SelectTrigger className="h-8 text-xs font-bold text-blue-700">
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">อายุ (ปี)</Label>
                <Input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  className="h-8 text-xs" 
                />
              </div>
              <div>
                <Label className="text-xs">ระดับแผล (WHO)</Label>
                <Select value={woundCategory} onValueChange={(val) => { if (val) setWoundCategory(val as 'I' | 'II' | 'III'); }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">Cat I (สัมผัส)</SelectItem>
                    <SelectItem value="II">Cat II (แผลตื้น)</SelectItem>
                    <SelectItem value="III">Cat III (แผลลึก/เลือด)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ที่อยู่ระดับหมู่บ้าน */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                📍 ข้อมูลพื้นที่ระดับหมู่บ้าน (จ.กาฬสินธุ์)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">อำเภอ</Label>
                  <Select value={district} onValueChange={(val) => { if (val) setDistrict(val); }}>
                    <SelectTrigger className="h-7 text-xs bg-white">
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
                <div>
                  <Label className="text-[10px]">ตำบล</Label>
                  <Select value={subdistrict} onValueChange={(val) => { if (val) setSubdistrict(val); }}>
                    <SelectTrigger className="h-7 text-xs bg-white">
                      <SelectValue placeholder="เลือกตำบล" />
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
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">หมู่ที่</Label>
                  <Input 
                    value={villageNo} 
                    onChange={(e) => setVillageNo(e.target.value)} 
                    placeholder="เช่น หมู่ 4"
                    className="h-7 text-xs bg-white" 
                  />
                </div>
                <div>
                  <Label className="text-[10px]">ชื่อหมู่บ้าน/ชุมชน</Label>
                  <Input 
                    value={villageName} 
                    onChange={(e) => setVillageName(e.target.value)} 
                    placeholder="เช่น ชุมชนคุ้มโฮง"
                    className="h-7 text-xs bg-white" 
                  />
                </div>
              </div>
            </div>

            {/* วัคซีนและการติดตาม */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 space-y-3">
              <div className="text-xs font-semibold text-blue-900 flex items-center justify-between">
                <span>💉 การติดตามการฉีดวัคซีน (PEP)</span>
                <Badge variant="outline" className="text-[10px] bg-white">
                  วันที่สัมผัส: {editingPatient.exposure_date}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">ความคืบหน้าวัคซีน</Label>
                  <Select value={vaccineStatus} onValueChange={(val) => { if (val) setVaccineStatus(val); }}>
                    <SelectTrigger className="h-8 text-xs font-semibold bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0/5">ยังไม่เริ่มฉีด (0/5)</SelectItem>
                      <SelectItem value="1/5">ฉีดเข็ม 1 แล้ว (1/5) Day 0</SelectItem>
                      <SelectItem value="2/5">ฉีดเข็ม 2 แล้ว (2/5) Day 3</SelectItem>
                      <SelectItem value="3/5">ฉีดเข็ม 3 แล้ว (3/5) Day 7</SelectItem>
                      <SelectItem value="4/5">ฉีดเข็ม 4 แล้ว (4/5) Day 14</SelectItem>
                      <SelectItem value="5/5">ฉีดครบ 5 เข็มแล้ว (5/5) 🎉</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">สถานะการติดตาม</Label>
                  <Select 
                    value={followUpStatus} 
                    onValueChange={(val) => { if (val) setFollowUpStatus(val as 'completed' | 'pending' | 'overdue'); }}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">ครบตามนัด (Completed)</SelectItem>
                      <SelectItem value="pending">รอตามนัด (Pending)</SelectItem>
                      <SelectItem value="overdue">ขาดนัดเตือน (Overdue ⚠️)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">บันทึกข้อความจากเจ้าหน้าที่ (Notes)</Label>
              <Input 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="เช่น ผู้สัมผัสรับวัคซีนเข็ม 2 ปกติ นัดเข็ม 3 วันที่ 12 ต.ค." 
                className="h-8 text-xs" 
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete}
                  className="h-8 text-xs font-semibold"
                >
                  ยืนยันลบเคสนี้!
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setConfirmDelete(false)}
                  className="h-8 text-xs"
                >
                  ยกเลิก
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
              >
                <Trash2 size={13} /> ลบเคส
              </Button>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setEditingPatient(null)}
                className="h-8 text-xs"
              >
                ปิด
              </Button>
              <Button 
                type="submit" 
                size="sm"
                className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1"
              >
                <Check size={14} /> บันทึกการแก้ไข
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
