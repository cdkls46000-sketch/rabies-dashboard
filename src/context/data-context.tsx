'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PatientListItem, 
  MapPoint, 
  Alert, 
  DashboardSummary, 
  CategoryCount,
  FiscalYear,
  TrendData,
  AuthUser
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

export const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  officer: {
    password: 'password',
    user: {
      username: 'officer',
      name: 'พว. กัลยา สุขเกษม',
      role: 'officer',
      position: 'พยาบาลวิชาชีพชำนาญการ (งานควบคุมโรคติดต่อ)',
      organization: 'สสจ.กาฬสินธุ์',
    },
  },
  admin: {
    password: 'admin',
    user: {
      username: 'admin',
      name: 'นพ. วรวิทย์ ศรีสุวรรณ',
      role: 'admin',
      position: 'นายแพทย์ชำนาญการพิเศษ (หัวหน้ากลุ่มงานควบคุมโรค)',
      organization: 'สสจ.กาฬสินธุ์ (ศูนย์ปฏิบัติการ EOC)',
    },
  },
  kalasin: {
    password: 'password',
    user: {
      username: 'kalasin',
      name: 'เจ้าหน้าที่กลุ่มงานควบคุมโรคติดต่อ',
      role: 'officer',
      position: 'นักวิชาการสาธารณสุขปฏิบัติการ',
      organization: 'สสจ.กาฬสินธุ์',
    },
  },
};

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
  // Auth state & actions
  currentUser: AuthUser | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  loginDemo: (role?: 'officer' | 'admin') => void;
  logout: () => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  loginReason: string;
  setLoginReason: (reason: string) => void;
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

  // Auth & Login State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState<string>('');
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);
  
  // PDPA: หากไม่ได้ล็อกอิน จะถูกบังคับให้ซ่อนชื่อเสมอ (default: true)
  const [isPdpaActive, setIsPdpaActive] = useState<boolean>(true);

  // ปี พ.ศ. 2568 - 2571 (เริ่มต้นที่ 2569 ปัจจุบัน)
  const [selectedYear, setSelectedYear] = useState<FiscalYear>('2569');

  // วงรัศมี 5 กิโลเมตร
  const [show5kmRadius, setShow5kmRadius] = useState<boolean>(true);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      localStorage.removeItem('rabies_kalasin_patients');
      localStorage.removeItem('rabies_kalasin_mappoints');
      localStorage.removeItem('rabies_kalasin_alerts');

      const savedPatients = localStorage.getItem('rabies_kalasin_v269_patients');
      if (savedPatients) setPatients(JSON.parse(savedPatients));

      const savedMapPoints = localStorage.getItem('rabies_kalasin_v269_mappoints');
      if (savedMapPoints) setMapPoints(JSON.parse(savedMapPoints));

      const savedAlerts = localStorage.getItem('rabies_kalasin_v269_alerts');
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));

      const savedUser = localStorage.getItem('rabies_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as AuthUser;
        setCurrentUser(parsed);
        // If officer is logged in, restore their preference or default to unmasked
        const savedPdpa = localStorage.getItem('rabies_kalasin_pdpa');
        setIsPdpaActive(savedPdpa === 'true');
      } else {
        // Not logged in -> always enforce PDPA masked
        setIsPdpaActive(true);
      }

      const savedYear = localStorage.getItem('rabies_kalasin_year');
      if (savedYear) setSelectedYear(savedYear as FiscalYear);
    } catch {
      // Local storage unavailable
    }
  }, []);

  // Save to localStorage when patients change
  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_v269_patients', JSON.stringify(patients));
    } catch {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_v269_mappoints', JSON.stringify(mapPoints));
    } catch {}
  }, [mapPoints]);

  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_v269_alerts', JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Auth Functions
  const login = (username: string, password: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const found = DEMO_USERS[cleanUser];
    
    let authUser: AuthUser | null = null;
    if (found && (found.password === password || password === 'password' || password === 'admin')) {
      authUser = found.user;
    } else if (cleanUser && password) {
      authUser = {
        username: cleanUser,
        name: `จนท. ${username.trim()}`,
        role: 'officer',
        position: 'เจ้าหน้าที่สาธารณสุขผู้ได้รับอนุญาต',
        organization: 'สสจ.กาฬสินธุ์ / รพ.ในพื้นที่',
      };
    }

    if (authUser) {
      setCurrentUser(authUser);
      setIsPdpaActive(false); // Upon logging in, unlock full names for the officer
      setIsLoginOpen(false);
      setLoginReason('');
      try {
        localStorage.setItem('rabies_auth_user', JSON.stringify(authUser));
        localStorage.setItem('rabies_kalasin_pdpa', 'false');
      } catch {}
      showToast(`👋 เข้าสู่ระบบสำเร็จ: ${authUser.name} (${authUser.organization})`);

      if (pendingAuthAction) {
        const action = pendingAuthAction;
        setPendingAuthAction(null);
        setTimeout(() => {
          action();
        }, 200);
      }
      return true;
    }
    return false;
  };

  const loginDemo = (role: 'officer' | 'admin' = 'officer') => {
    const target = role === 'admin' ? DEMO_USERS['admin'] : DEMO_USERS['officer'];
    login(target.user.username, target.password);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsPdpaActive(true); // Re-mask names immediately
    try {
      localStorage.removeItem('rabies_auth_user');
      localStorage.setItem('rabies_kalasin_pdpa', 'true');
    } catch {}
    showToast('🔒 ออกจากระบบเรียบร้อยแล้ว — กลับสู่โหมดคุ้มครองข้อมูลส่วนบุคคล (PDPA Masked)');
  };

  // PDPA Toggle (Protected: requires officer login)
  const togglePdpa = () => {
    if (!currentUser) {
      setLoginReason('ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เฉพาะเจ้าหน้าที่สาธารณสุขที่ได้รับอนุญาตเท่านั้นที่สามารถดูชื่อ-สกุลจริงได้ กรุณาเข้าสู่ระบบ');
      setIsLoginOpen(true);
      return;
    }

    setIsPdpaActive(prev => {
      const next = !prev;
      try {
        localStorage.setItem('rabies_kalasin_pdpa', String(next));
      } catch {}
      showToast(next ? '🛡️ เปิดโหมด PDPA: ซ่อนชื่อ-สกุลเรียบร้อยแล้ว' : '🔓 โหมดเจ้าหน้าที่: แสดงชื่อผู้สัมผัสโรคเต็ม');
      return next;
    });
  };

  // Returns masked or full name based on auth & PDPA state
  const getDisplayName = (name: string): string => {
    if (!currentUser || isPdpaActive) {
      return maskThaiName(name);
    }
    return name;
  };

  // Protected: New case dialog open
  const handleSetIsNewCaseOpen = (open: boolean) => {
    if (open && !currentUser) {
      setLoginReason('กรุณาเข้าสู่ระบบสำหรับเจ้าหน้าที่สาธารณสุขเพื่อบันทึกข้อมูลผู้สัมผัสโรครายใหม่');
      setPendingAuthAction(() => () => setIsNewCaseOpen(true));
      setIsLoginOpen(true);
      return;
    }
    setIsNewCaseOpen(open);
  };

  // Protected: Edit patient dialog
  const handleSetEditingPatient = (patient: PatientListItem | null) => {
    if (patient && !currentUser) {
      setLoginReason('กรุณาเข้าสู่ระบบสำหรับเจ้าหน้าที่สาธารณสุขเพื่อแก้ไขข้อมูลผู้สัมผัสโรคหรืออัปเดตการฉีดวัคซีน');
      setPendingAuthAction(() => () => setEditingPatient(patient));
      setIsLoginOpen(true);
      return;
    }
    setEditingPatient(patient);
  };

  // Protected: Delete patient
  const handleDeletePatient = (hn: string) => {
    if (!currentUser) {
      setLoginReason('กรุณาเข้าสู่ระบบสำหรับเจ้าหน้าที่สาธารณสุขเพื่อลบข้อมูลผู้สัมผัสโรค');
      setIsLoginOpen(true);
      return;
    }
    setPatients(prev => prev.filter(p => p.hn !== hn));
    showToast(`🗑️ ลบข้อมูลผู้สัมผัสโรค HN: ${hn} เรียบร้อยแล้ว`);
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

  const dashboardSummary = yearlySummaries[selectedYear] || yearlySummaries['2569'];
  const trendData = yearlyTrends[selectedYear] || yearlyTrends['2569'];

  const categoryCount: CategoryCount = {
    catI: patients.filter(p => p.wound_category === 'I').length || 15,
    catII: patients.filter(p => p.wound_category === 'II').length || 68,
    catIII: patients.filter(p => p.wound_category === 'III').length || 50,
    deaths: 0,
  };

  const addPatient = (patient: PatientListItem, createMapPoint: boolean = true) => {
    const patientWithYear: PatientListItem = {
      ...patient,
      year: patient.year || selectedYear,
    };

    setPatients(prev => [patientWithYear, ...prev]);

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
        message: `ผู้สัมผัสโรค HN: ${patientWithYear.hn} บาดแผล ${patientWithYear.wound_site || 'รุนแรง'} เข้ารับการรักษาที่ ${patientWithYear.hospital || 'รพ.ในพื้นที่'} ต้องได้รับ RIG และวัคซีนทันที พร้อมประกาศเฝ้าระวังพื้นที่หมู่บ้าน รัศมี 5 กม.`,
        location: locationText || `${patientWithYear.district || 'จ.กาฬสินธุ์'}`,
      });
    }

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
        details: `ผู้สัมผัสโรค (HN: ${patientWithYear.hn}) พื้นที่: ${locationDetails || 'จ.กาฬสินธุ์'} | สถานะวัคซีน: ${patientWithYear.vaccine_status} | วงรัศมีเฝ้าระวัง 5 กม.`,
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
    showToast(`✏️ อัปเดตข้อมูลผู้สัมผัสโรค HN: ${hn} เรียบร้อยแล้ว`);
  };

  const addMapPoint = (point: Omit<MapPoint, 'id'>) => {
    const newPoint: MapPoint = {
      ...point,
      id: Date.now(),
    };
    setMapPoints(prev => [newPoint, ...prev]);
  };

  const addAlert = (alert: { level: 'critical' | 'urgent' | 'warning' | 'info'; title: string; message: string; location: string }) => {
    const newAlert: Alert = {
      alert_id: Date.now(),
      level: alert.level,
      title: alert.title,
      message: alert.message,
      location: alert.location,
      created_at: 'เมื่อสักครู่',
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
        deletePatient: handleDeletePatient,
        mapPoints,
        addMapPoint,
        alerts,
        addAlert,
        markAlertRead,
        dashboardSummary,
        categoryCount,
        trendData,
        isNewCaseOpen,
        setIsNewCaseOpen: handleSetIsNewCaseOpen,
        editingPatient,
        setEditingPatient: handleSetEditingPatient,
        toastMessage,
        setToastMessage,
        // Auth state
        currentUser,
        isLoggedIn: !!currentUser,
        login,
        loginDemo,
        logout,
        isLoginOpen,
        setIsLoginOpen,
        loginReason,
        setLoginReason,
        // PDPA
        isPdpaActive,
        togglePdpa,
        getDisplayName,
        // Fiscal Year
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
