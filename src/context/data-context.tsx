'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientListItem, 
  MapPoint, 
  Alert, 
  DashboardSummary, 
  CategoryCount,
  FiscalYear,
  TrendData
} from '@/types';
import { 
  patientList as initialPatients, 
  mapPoints as initialMapPoints, 
  alerts as initialAlerts, 
  yearlySummaries,
  yearlyTrends,
  categoryCount as initialCategoryCount 
} from '@/lib/mock-data';
import { maskThaiName } from '@/lib/pdpa';

interface DataContextType {
  patients: PatientListItem[];
  addPatient: (patient: PatientListItem, createMapPoint?: boolean) => void;
  updatePatient: (hn: string, data: Partial<PatientListItem>) => void;
  deletePatient: (hn: string) => void;
  mapPoints: MapPoint[];
  addMapPoint: (point: Omit<MapPoint, 'id'>) => void;
  alerts: Alert[];
  addAlert: (alert: { level: 'critical' | 'urgent' | 'warning' | 'info'; title: string; message: string; location: string }) => void;
  markAlertRead: (alertId: number) => void;
  dashboardSummary: DashboardSummary;
  categoryCount: CategoryCount;
  trendData: TrendData[];
  isNewCaseOpen: boolean;
  setIsNewCaseOpen: (open: boolean) => void;
  editingPatient: PatientListItem | null;
  setEditingPatient: (patient: PatientListItem | null) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  // PDPA privacy features (เรื่องที่ 1: ปกปิดชื่อตาม PDPA)
  isPdpaActive: boolean;
  togglePdpa: () => void;
  getDisplayName: (name: string) => string;
  // Fiscal Years (เรื่องที่ 4: พ.ศ. 2568, 2569, 2570, 2571)
  selectedYear: FiscalYear;
  setSelectedYear: (year: FiscalYear) => void;
  // 5km Radius Buffer (เรื่องที่ 3: วงรัศมี 5 กิโลเมตร)
  show5kmRadius: boolean;
  setShow5kmRadius: (show: boolean) => void;
  toggle5kmRadius: () => void;
  // Mobile responsive sidebar drawer
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<PatientListItem[]>(initialPatients);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(initialMapPoints);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientListItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // เรื่องที่ 1: ปกปิดชื่อตาม PDPA (เปิดใช้งานเป็นค่าเริ่มต้น)
  const [isPdpaActive, setIsPdpaActive] = useState<boolean>(true);

  // เรื่องที่ 4: ปี พ.ศ. 2568 - 2571 (เริ่มต้นที่ 2569 ปัจจุบัน)
  const [selectedYear, setSelectedYear] = useState<FiscalYear>('2569');

  // เรื่องที่ 3: แสดงวงรัศมี 5 กิโลเมตร (เปิดใช้งานเป็นค่าเริ่มต้น)
  const [show5kmRadius, setShow5kmRadius] = useState<boolean>(true);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem('rabies_kalasin_patients');
      if (savedPatients) setPatients(JSON.parse(savedPatients));

      const savedMapPoints = localStorage.getItem('rabies_kalasin_mappoints');
      if (savedMapPoints) setMapPoints(JSON.parse(savedMapPoints));

      const savedAlerts = localStorage.getItem('rabies_kalasin_alerts');
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));

      const savedPdpa = localStorage.getItem('rabies_kalasin_pdpa');
      if (savedPdpa !== null) setIsPdpaActive(savedPdpa === 'true');

      const savedYear = localStorage.getItem('rabies_kalasin_year');
      if (savedYear) setSelectedYear(savedYear as FiscalYear);
    } catch {
      // Local storage unavailable
    }
  }, []);

  // Save to localStorage when patients change
  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_patients', JSON.stringify(patients));
    } catch {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_mappoints', JSON.stringify(mapPoints));
    } catch {}
  }, [mapPoints]);

  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_alerts', JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  const togglePdpa = () => {
    setIsPdpaActive(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rabies_kalasin_pdpa', String(next));
      } catch {}
      showToast(next ? '🛡️ เปิดโหมด PDPA: ซ่อนชื่อ-สกุลเรียบร้อยแล้ว' : '🔓 โหมดเจ้าหน้าที่: แสดงชื่อผู้ป่วยเต็ม');
      return next;
    });
  };

  const toggle5kmRadius = () => {
    setShow5kmRadius(prev => !prev);
  };

  const handleSelectYear = (year: FiscalYear) => {
    setSelectedYear(year);
    try {
      localStorage.setItem('rabies_kalasin_year', year);
    } catch {}
    showToast(`📅 เปลี่ยนมุมมองข้อมูลเป็น ปี พ.ศ. ${year}`);
  };

  const getDisplayName = (name: string): string => {
    if (!name) return '-';
    if (isPdpaActive) {
      return maskThaiName(name);
    }
    return name;
  };

  // Filter patients by selected fiscal year
  const yearFilteredPatients = patients.filter(p => !p.year || p.year === selectedYear);

  // Dynamically compute category counts from patient list
  const categoryCount: CategoryCount = {
    catI: yearFilteredPatients.filter(p => p.wound_category === 'I').length,
    catII: yearFilteredPatients.filter(p => p.wound_category === 'II').length,
    catIII: yearFilteredPatients.filter(p => p.wound_category === 'III').length,
    deaths: initialCategoryCount.deaths,
  };

  // Active dashboard summary and trend data based on selected fiscal year
  const baseSummary = yearlySummaries[selectedYear] || yearlySummaries['2569'];
  const dashboardSummary: DashboardSummary = {
    ...baseSummary,
    totalExposures: yearFilteredPatients.length > 0 ? yearFilteredPatients.length : baseSummary.totalExposures,
  };

  const trendData: TrendData[] = yearlyTrends[selectedYear] || yearlyTrends['2569'];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addPatient = (newPatient: PatientListItem, createMapPoint: boolean = true) => {
    const patientWithYear: PatientListItem = {
      ...newPatient,
      year: newPatient.year || selectedYear,
    };

    setPatients(prev => [patientWithYear, ...prev]);

    // If Cat III, create an alert in the Alert Center with STRICT PDPA (NO raw name)
    if (patientWithYear.wound_category === 'III') {
      const locationText = [
        patientWithYear.village_no,
        patientWithYear.village_name,
        patientWithYear.subdistrict,
        patientWithYear.district
      ].filter(Boolean).join(' ');

      addAlert({
        level: 'critical',
        title: `พบผู้สัมผัสโรคบาดแผลระดับ 3 (Cat III) — HN: ${patientWithYear.hn}`,
        message: `ผู้ป่วย HN: ${patientWithYear.hn} บาดแผล ${patientWithYear.wound_site || 'รุนแรง'} เข้ารับการรักษาที่ ${patientWithYear.hospital || 'รพ.ในพื้นที่'} ต้องได้รับ RIG และวัคซีนทันที พร้อมประกาศเฝ้าระวังพื้นที่หมู่บ้าน รัศมี 5 กม.`,
        location: locationText || `${patientWithYear.district || 'จ.กาฬสินธุ์'}`,
      });
    }

    // Add map point with village level and 5km buffer radius
    if (createMapPoint) {
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

      const defaultCoords = (patientWithYear.district && districtCoords[patientWithYear.district]) 
        ? districtCoords[patientWithYear.district] 
        : [16.4800, 103.5500];

      const lat = patientWithYear.latitude || (defaultCoords[0] + (Math.random() - 0.5) * 0.03);
      const lng = patientWithYear.longitude || (defaultCoords[1] + (Math.random() - 0.5) * 0.03);

      const locationDetails = [
        patientWithYear.village_no,
        patientWithYear.village_name,
        patientWithYear.subdistrict,
        patientWithYear.district
      ].filter(Boolean).join(' ');

      const newPoint: MapPoint = {
        id: Date.now(),
        lat,
        lng,
        title: `${patientWithYear.district || 'จ.กาฬสินธุ์'} - ผู้สัมผัสโรค (แผล Cat ${patientWithYear.wound_category})`,
        type: 'exposure',
        date: patientWithYear.exposure_date,
        details: `ผู้ป่วย (HN: ${patientWithYear.hn}) พื้นที่: ${locationDetails || 'จ.กาฬสินธุ์'} | สถานะวัคซีน: ${patientWithYear.vaccine_status} | วงรัศมีเฝ้าระวัง 5 กม.`,
        district: patientWithYear.district,
        subdistrict: patientWithYear.subdistrict,
        village_no: patientWithYear.village_no,
        village_name: patientWithYear.village_name,
        radius_m: 5000,
        year: patientWithYear.year || selectedYear,
      };

      setMapPoints(prev => [newPoint, ...prev]);
    }

    showToast(`✅ บันทึกข้อมูล HN ${patientWithYear.hn} (${patientWithYear.village_name || patientWithYear.district}) เรียบร้อยแล้ว (PDPA Protected)`);
  };

  const updatePatient = (hn: string, data: Partial<PatientListItem>) => {
    setPatients(prev => prev.map(p => {
      if (p.hn === hn) {
        return { ...p, ...data };
      }
      return p;
    }));
    showToast(`✏️ อัปเดตข้อมูลผู้ป่วย HN: ${hn} เรียบร้อยแล้ว`);
  };

  const deletePatient = (hn: string) => {
    setPatients(prev => prev.filter(p => p.hn !== hn));
    showToast(`🗑️ ลบข้อมูลผู้ป่วย HN: ${hn} เรียบร้อยแล้ว`);
  };

  const addMapPoint = (point: Omit<MapPoint, 'id'>) => {
    const newPoint: MapPoint = {
      ...point,
      id: Date.now(),
      radius_m: point.radius_m || 5000,
      year: point.year || selectedYear,
    };
    setMapPoints(prev => [newPoint, ...prev]);
  };

  const addAlert = (alertData: { level: 'critical' | 'urgent' | 'warning' | 'info'; title: string; message: string; location: string }) => {
    const newAlert: Alert = {
      alert_id: Date.now(),
      level: alertData.level,
      title: alertData.title,
      message: alertData.message,
      location: alertData.location,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertRead = (alertId: number) => {
    setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, is_read: true } : a));
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        mapPoints,
        addMapPoint,
        alerts,
        addAlert,
        markAlertRead,
        dashboardSummary,
        categoryCount,
        trendData,
        isNewCaseOpen,
        setIsNewCaseOpen,
        editingPatient,
        setEditingPatient,
        toastMessage,
        setToastMessage,
        isPdpaActive,
        togglePdpa,
        getDisplayName,
        selectedYear,
        setSelectedYear: handleSelectYear,
        show5kmRadius,
        setShow5kmRadius,
        toggle5kmRadius,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar: () => setIsMobileSidebarOpen(prev => !prev),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
