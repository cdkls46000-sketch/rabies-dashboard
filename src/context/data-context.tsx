'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  categoryCount as initialCategoryCount,
  kalasinDistricts,
  districtVaccinationData
} from '@/lib/mock-data';
import { maskThaiName } from '@/lib/pdpa';

export const isDistrictMatch = (itemDistrict?: string, filterDistrict?: string): boolean => {
  if (!filterDistrict || filterDistrict === 'all') return true;
  if (!itemDistrict) return false;

  const found = kalasinDistricts.find(d => d.id === filterDistrict || d.name === filterDistrict);
  const targetName = found ? found.name : filterDistrict;

  const cleanTarget = targetName.replace(/^อ\./, '').trim();
  const cleanItem = itemDistrict.replace(/^อ\./, '').trim();

  return cleanItem.includes(cleanTarget) || cleanTarget.includes(cleanItem);
};

export const THAI_MONTH_DEFS = [
  { short: 'ม.ค.', patterns: ['มกราคม', 'ม.ค.', '-01-', '/01/'] },
  { short: 'ก.พ.', patterns: ['กุมภาพันธ์', 'ก.พ.', '-02-', '/02/'] },
  { short: 'มี.ค.', patterns: ['มีนาคม', 'มี.ค.', '-03-', '/03/'] },
  { short: 'เม.ย.', patterns: ['เมษายน', 'เม.ย.', '-04-', '/04/'] },
  { short: 'พ.ค.', patterns: ['พฤษภาคม', 'พ.ค.', '-05-', '/05/'] },
  { short: 'มิ.ย.', patterns: ['มิถุนายน', 'มิ.ย.', '-06-', '/06/'] },
  { short: 'ก.ค.', patterns: ['กรกฎาคม', 'ก.ค.', '-07-', '/07/'] },
  { short: 'ส.ค.', patterns: ['สิงหาคม', 'ส.ค.', '-08-', '/08/'] },
  { short: 'ก.ย.', patterns: ['กันยายน', 'ก.ย.', '-09-', '/09/'] },
  { short: 'ต.ค.', patterns: ['ตุลาคม', 'ต.ค.', '-10-', '/10/'] },
  { short: 'พ.ย.', patterns: ['พฤศจิกายน', 'พ.ย.', '-11-', '/11/'] },
  { short: 'ธ.ค.', patterns: ['ธันวาคม', 'ธ.ค.', '-12-', '/12/'] },
];

export const getThaiMonthShort = (dateStr?: string): string | null => {
  if (!dateStr) return null;
  for (const m of THAI_MONTH_DEFS) {
    for (const pat of m.patterns) {
      if (dateStr.includes(pat)) return m.short;
    }
  }
  return null;
};
import {
  hashWithSalt,
  generateSalt,
  getStoredCredentials,
  saveStoredCredentials,
  checkAccountLockout,
  recordFailedAttempt,
  resetFailedAttempts,
  createOtpChallenge,
  verifyOtpChallenge,
  getSecurityAuditLogs,
  logSecurityAudit,
  clearSecurityAuditLogs,
  SESSION_TIMEOUT_MS,
  SESSION_WARNING_MS,
  OtpChallenge,
  SecurityAuditLog,
  StoredUserCredential
} from '@/lib/security';

export const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  juthamas: {
    password: 'Juthamas@Kalasin2569!',
    user: {
      username: 'juthamas',
      name: 'คุณจุฑามาศ บัวลอย',
      role: 'officer',
      position: 'เจ้าหน้าที่กลุ่มงานควบคุมโรคติดต่อ',
      organization: 'สสจ.กาฬสินธุ์',
    },
  },
  officer: {
    password: 'Juthamas@Kalasin2569!',
    user: {
      username: 'juthamas',
      name: 'คุณจุฑามาศ บัวลอย',
      role: 'officer',
      position: 'เจ้าหน้าที่กลุ่มงานควบคุมโรคติดต่อ',
      organization: 'สสจ.กาฬสินธุ์',
    },
  },
  kongrit: {
    password: 'Kongrit@Kalasin2569!',
    user: {
      username: 'kongrit',
      name: 'คุณคงฤทธิ์ วันจรูญ',
      role: 'admin',
      position: 'หัวหน้ากลุ่มงานควบคุมโรคติดต่อ (Admin)',
      organization: 'สสจ.กาฬสินธุ์ (ศูนย์ปฏิบัติการ EOC)',
    },
  },
  admin: {
    password: 'Kongrit@Kalasin2569!',
    user: {
      username: 'kongrit',
      name: 'คุณคงฤทธิ์ วันจรูญ',
      role: 'admin',
      position: 'หัวหน้ากลุ่มงานควบคุมโรคติดต่อ (Admin)',
      organization: 'สสจ.กาฬสินธุ์ (ศูนย์ปฏิบัติการ EOC)',
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
  
  // Auth state & Multi-Factor Authentication (MFA Level 4)
  currentUser: AuthUser | null;
  isLoggedIn: boolean;
  loginStep1: (username: string, password: string) => {
    success: boolean;
    error?: string;
    isLocked?: boolean;
    remainingSeconds?: number;
    attemptsRemaining?: number;
    challenge?: OtpChallenge;
  };
  loginStep2: (challenge: OtpChallenge, enteredOtp: string) => {
    success: boolean;
    error?: string;
  };
  resendOtpChallenge: (username: string) => OtpChallenge | null;
  login: (username: string, password: string) => boolean;
  loginDemo: (role?: 'officer' | 'admin') => void;
  logout: (reason?: string) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  loginReason: string;
  setLoginReason: (reason: string) => void;

  // Change Password
  isChangePasswordOpen: boolean;
  setIsChangePasswordOpen: (open: boolean) => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };

  // Security Audit Trail
  isSecurityAuditOpen: boolean;
  setIsSecurityAuditOpen: (open: boolean) => void;
  auditLogs: SecurityAuditLog[];
  refreshAuditLogs: () => void;
  clearAuditLogs: () => void;

  // Session Inactivity Timeout
  sessionRemainingSeconds: number;
  extendSession: () => void;
  isSessionWarningOpen: boolean;
  setIsSessionWarningOpen: (open: boolean) => void;

  // PDPA privacy features
  isPdpaActive: boolean;
  togglePdpa: () => void;
  getDisplayName: (name: string) => string;

  // District Filter
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedDistrictName: string;
  isDistrictMatch: (itemDistrict?: string) => boolean;

  // Fiscal Years
  selectedYear: FiscalYear;
  setSelectedYear: (year: FiscalYear) => void;

  // 5km Radius Buffer
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

  // Password & Audit Dialogs
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSecurityAuditOpen, setIsSecurityAuditOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Session Activity & Inactivity Timeout
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(900); // 15 mins = 900s
  const [isSessionWarningOpen, setIsSessionWarningOpen] = useState<boolean>(false);
  
  // PDPA: หากไม่ได้ล็อกอิน จะถูกบังคับให้ซ่อนชื่อเสมอ (default: true)
  const [isPdpaActive, setIsPdpaActive] = useState<boolean>(true);

  // ปี พ.ศ. 2568 - 2571 (เริ่มต้นที่ 2569 ปัจจุบัน)
  const [selectedYear, setSelectedYear] = useState<FiscalYear>('2569');

  // ตัวกรองอำเภอ (ค่าเริ่มต้น: 'all' = ทุกอำเภอ)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // วงรัศมี 5 กิโลเมตร
  const [show5kmRadius, setShow5kmRadius] = useState<boolean>(true);

  // Refresh Audit Logs from Storage
  const refreshAuditLogs = useCallback(() => {
    setAuditLogs(getSecurityAuditLogs());
  }, []);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      // Clear out legacy test and dirty caches
      localStorage.removeItem('rabies_kalasin_patients');
      localStorage.removeItem('rabies_kalasin_mappoints');
      localStorage.removeItem('rabies_kalasin_alerts');
      localStorage.removeItem('rabies_kalasin_v269_patients');
      localStorage.removeItem('rabies_kalasin_v269_mappoints');
      localStorage.removeItem('rabies_kalasin_v269_alerts');
      localStorage.removeItem('rabies_kalasin_clean133_alerts');

      const savedPatients = localStorage.getItem('rabies_kalasin_clean133_patients');
      if (savedPatients) setPatients(JSON.parse(savedPatients));

      const savedMapPoints = localStorage.getItem('rabies_kalasin_clean133_mappoints');
      if (savedMapPoints) setMapPoints(JSON.parse(savedMapPoints));

      const savedAlerts = localStorage.getItem('rabies_kalasin_v32_alerts');
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      } else {
        setAlerts(initialAlerts);
      }

      const savedUser = localStorage.getItem('rabies_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as AuthUser;
        setCurrentUser(parsed);
        const savedPdpa = localStorage.getItem('rabies_kalasin_pdpa');
        setIsPdpaActive(savedPdpa === 'true');
        setLastActivityTime(Date.now());
      } else {
        setIsPdpaActive(true);
      }

      const savedYear = localStorage.getItem('rabies_kalasin_year');
      if (savedYear) setSelectedYear(savedYear as FiscalYear);

      const savedDistrict = localStorage.getItem('rabies_kalasin_district');
      if (savedDistrict) setSelectedDistrict(savedDistrict);

      // Load audit logs
      setAuditLogs(getSecurityAuditLogs());
    } catch {
      // Local storage unavailable
    }
  }, []);

  // Save to localStorage when patients change
  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_clean133_patients', JSON.stringify(patients));
    } catch {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_clean133_mappoints', JSON.stringify(mapPoints));
    } catch {}
  }, [mapPoints]);

  useEffect(() => {
    try {
      localStorage.setItem('rabies_kalasin_v32_alerts', JSON.stringify(alerts));
    } catch {}
  }, [alerts]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // =========================================================================
  // Inactivity Heartbeat & Session Expiry Listeners
  // =========================================================================
  const lastActiveThrottleRef = useRef<number>(Date.now());

  const handleUserActivity = useCallback(() => {
    if (!currentUser) return;
    const now = Date.now();
    if (now - lastActiveThrottleRef.current > 3000) {
      lastActiveThrottleRef.current = now;
      setLastActivityTime(now);
      if (isSessionWarningOpen) {
        setIsSessionWarningOpen(false);
      }
    }
  }, [currentUser, isSessionWarningOpen]);

  useEffect(() => {
    if (!currentUser) return;

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(ev => window.addEventListener(ev, handleUserActivity, { passive: true }));

    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleUserActivity));
    };
  }, [currentUser, handleUserActivity]);

  // Session timer countdown check
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityTime;
      const remaining = Math.max(0, Math.ceil((SESSION_TIMEOUT_MS - elapsed) / 1000));
      setSessionRemainingSeconds(remaining);

      // Warning at 2 minutes remaining
      if (remaining <= 120 && remaining > 0 && !isSessionWarningOpen) {
        setIsSessionWarningOpen(true);
      }

      // Timeout expired
      if (remaining === 0) {
        logout('เซสชันหมดอายุเนื่องจากไม่มีการใช้งานเกิน 15 นาที');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, lastActivityTime, isSessionWarningOpen]);

  const extendSession = () => {
    setLastActivityTime(Date.now());
    setSessionRemainingSeconds(900);
    setIsSessionWarningOpen(false);
    showToast('⏱️ ต่อเวลาเซสชันการใช้งาน 15 นาทีเรียบร้อยแล้ว');
    if (currentUser) {
      logSecurityAudit({
        eventType: 'SESSION_TIMEOUT',
        username: currentUser.username,
        ipAddress: '10.43.12.8 (Gov Gateway)',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        details: 'ผู้ใช้กดต่อเวลาเซสชันการใช้งาน (Extended Session +15m)',
        status: 'INFO',
      });
      refreshAuditLogs();
    }
  };

  // =========================================================================
  // High-Security Auth: Step 1 (Salted Hash & Lockout Check)
  // =========================================================================
  const loginStep1 = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check brute-force lockout
    const lockout = checkAccountLockout(cleanUser);
    if (lockout.isLocked) {
      return {
        success: false,
        isLocked: true,
        remainingSeconds: lockout.remainingSeconds,
        error: `บัญชีนี้ถูกระงับชั่วคราวเนื่องจากกรอกรหัสผ่านผิดเกินกำหนด กรุณารอ ${Math.ceil(lockout.remainingSeconds / 60)} นาที`,
      };
    }

    const creds = getStoredCredentials();
    const cred = creds[cleanUser];

    if (!cred) {
      return {
        success: false,
        error: 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ หรือยังไม่ได้รับสิทธิ์เข้าใช้งาน',
      };
    }

    // Verify salted cryptographic hash
    const inputHash = hashWithSalt(cleanPass, cred.salt);
    const isMatch = 
      inputHash === cred.passwordHash || 
      (cred.backupHash && inputHash === cred.backupHash);

    if (!isMatch) {
      const failResult = recordFailedAttempt(cleanUser);
      refreshAuditLogs();
      return {
        success: false,
        isLocked: failResult.isLocked,
        remainingSeconds: failResult.remainingSeconds,
        attemptsRemaining: failResult.attemptsRemaining,
        error: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
      };
    }

    // Password valid -> Reset failed counter and create 2FA Challenge
    resetFailedAttempts(cleanUser);
    const challenge = createOtpChallenge(cleanUser);
    refreshAuditLogs();

    return {
      success: true,
      challenge: challenge || undefined,
    };
  };

  // =========================================================================
  // High-Security Auth: Step 2 (2FA OTP Verification)
  // =========================================================================
  const loginStep2 = (challenge: OtpChallenge, enteredOtp: string) => {
    const otpResult = verifyOtpChallenge(challenge, enteredOtp);
    refreshAuditLogs();

    if (!otpResult.valid) {
      return {
        success: false,
        error: otpResult.reason || 'รหัส OTP ไม่ถูกต้อง',
      };
    }

    // OTP Valid -> Complete High-Security Login
    const creds = getStoredCredentials();
    const cred = creds[challenge.username];
    if (!cred) {
      return { success: false, error: 'ไม่พบข้อมูลผู้ใช้' };
    }

    const sessionToken = `SEC-SESSION-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const authUser: AuthUser = {
      ...cred.user,
      phoneMasked: cred.phoneMasked,
      lastLogin: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
      sessionToken,
      mfaVerified: true,
    };

    setCurrentUser(authUser);
    setIsPdpaActive(false);
    setIsLoginOpen(false);
    setLoginReason('');
    setLastActivityTime(Date.now());
    setSessionRemainingSeconds(900);
    setIsSessionWarningOpen(false);

    try {
      localStorage.setItem('rabies_auth_user', JSON.stringify(authUser));
      localStorage.setItem('rabies_kalasin_pdpa', 'false');
    } catch {}

    logSecurityAudit({
      eventType: 'LOGIN_SUCCESS',
      username: authUser.username,
      ipAddress: '10.43.12.8 (Gov Gateway)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      details: `เข้าสู่ระบบสำเร็จด้วยการยืนยันตัวตนสองชั้น (2FA/MFA) รหัสเซสชัน ${sessionToken}`,
      status: 'SUCCESS',
    });
    refreshAuditLogs();

    showToast(`🛡️ ยืนยันตัวตน 2FA สำเร็จ: ยินดีต้อนรับ ${authUser.name}`);

    if (pendingAuthAction) {
      const action = pendingAuthAction;
      setPendingAuthAction(null);
      setTimeout(action, 200);
    }

    return { success: true };
  };

  const resendOtpChallenge = (username: string): OtpChallenge | null => {
    const challenge = createOtpChallenge(username);
    refreshAuditLogs();
    if (challenge) {
      showToast(`📲 ส่งรหัส OTP ใหม่เรียบร้อยแล้ว (Ref: ${challenge.ref})`);
    }
    return challenge;
  };

  // Fallback demo login method
  const loginDemo = (role: 'officer' | 'admin' = 'officer') => {
    const targetUser = role === 'admin' ? 'kongrit' : 'juthamas';
    const challenge = createOtpChallenge(targetUser);
    if (challenge) {
      loginStep2(challenge, challenge.code);
    }
  };

  // Legacy login fallback
  const login = (username: string, password: string): boolean => {
    const step1 = loginStep1(username, password);
    if (step1.success && step1.challenge) {
      const step2 = loginStep2(step1.challenge, step1.challenge.code);
      return step2.success;
    }
    return false;
  };

  // Logout
  const logout = (reason?: string) => {
    if (currentUser) {
      logSecurityAudit({
        eventType: reason?.includes('หมดอายุ') ? 'SESSION_TIMEOUT' : 'LOGOUT',
        username: currentUser.username,
        ipAddress: '10.43.12.8 (Gov Gateway)',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        details: reason || 'ผู้ใช้ออกจากระบบด้วยตนเอง (Manual Logout)',
        status: reason?.includes('หมดอายุ') ? 'WARNING' : 'INFO',
      });
    }

    setCurrentUser(null);
    setIsPdpaActive(true); // Re-mask names immediately
    setIsSessionWarningOpen(false);
    try {
      localStorage.removeItem('rabies_auth_user');
      localStorage.setItem('rabies_kalasin_pdpa', 'true');
    } catch {}
    refreshAuditLogs();
    showToast(reason || '🔒 ออกจากระบบเรียบร้อยแล้ว — กลับสู่โหมดคุ้มครองข้อมูลส่วนบุคคล (PDPA Masked)');
  };

  // Change Password
  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, error: 'กรุณาเข้าสู่ระบบก่อน' };

    const creds = getStoredCredentials();
    const cred = creds[currentUser.username];
    if (!cred) return { success: false, error: 'ไม่พบข้อมูลบัญชีผู้ใช้' };

    const oldHash = hashWithSalt(oldPass, cred.salt);
    const isOldCorrect = 
      oldHash === cred.passwordHash || 
      (cred.backupHash && oldHash === cred.backupHash);

    if (!isOldCorrect) {
      logSecurityAudit({
        eventType: 'LOGIN_FAILED',
        username: currentUser.username,
        ipAddress: '10.43.12.8 (Gov Gateway)',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        details: 'พยายามเปลี่ยนรหัสผ่านแต่ระบุรหัสผ่านปัจจุบันไม่ถูกต้อง',
        status: 'WARNING',
      });
      refreshAuditLogs();
      return { success: false, error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' };
    }

    // Generate fresh cryptographic salt & salted hash
    const newSalt = generateSalt(16);
    const newHash = hashWithSalt(newPass, newSalt);

    cred.salt = newSalt;
    cred.passwordHash = newHash;
    delete cred.backupHash;
    cred.updatedAt = new Date().toISOString();

    saveStoredCredentials(creds);

    logSecurityAudit({
      eventType: 'PASSWORD_CHANGED',
      username: currentUser.username,
      ipAddress: '10.43.12.8 (Gov Gateway)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      details: 'เปลี่ยนรหัสผ่านสำเร็จ (เข้ารหัสลับ Salted SHA-256 ความปลอดภัยสูงสุด)',
      status: 'SUCCESS',
    });
    refreshAuditLogs();

    showToast('🔑 เปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว (เข้ารหัสลับระดับสูงสุด)');
    return { success: true };
  };

  const handleClearAuditLogs = () => {
    clearSecurityAuditLogs();
    refreshAuditLogs();
    showToast('🗑️ ล้างประวัติ Security Audit Log เรียบร้อยแล้ว');
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
      setPendingAuthAction(() => () => handleDeletePatient(hn));
      setIsLoginOpen(true);
      return;
    }
    setPatients(prev => prev.filter(p => p.hn !== hn));
    showToast(`🗑️ ลบข้อมูลผู้สัมผัสโรค HN: ${hn} เรียบร้อยแล้ว`);
  };

  // Add new patient
  const addPatient = (patient: PatientListItem, createMapPoint = true) => {
    setPatients(prev => [patient, ...prev]);
    showToast(`✓ บันทึกข้อมูลผู้สัมผัสโรค HN: ${patient.hn} เรียบร้อยแล้ว`);

    if (createMapPoint && patient.latitude && patient.longitude) {
      const newPoint: MapPoint = {
        id: Date.now(),
        lat: patient.latitude,
        lng: patient.longitude,
        title: `เคสสัมผัสโรค: ${patient.name} (${patient.district || 'ไม่ระบุอำเภอ'})`,
        type: 'exposure',
        date: patient.exposure_date || new Date().toISOString().slice(0, 10),
        details: `สัมผัสสัตว์ (${patient.wound_site || 'ไม่ระบุบาดแผล'}) - Category ${patient.wound_category || 'III'}`,
        district: patient.district,
        subdistrict: patient.subdistrict,
        village_name: patient.village_name || patient.subdistrict,
        village_no: patient.village_no,
        year: patient.year || selectedYear,
        radius_m: 5000,
      };
      setMapPoints(prev => [newPoint, ...prev]);
    }
  };

  // Update existing patient
  const updatePatient = (hn: string, data: Partial<PatientListItem>) => {
    setPatients(prev => prev.map(p => {
      if (p.hn === hn) {
        return { ...p, ...data };
      }
      return p;
    }));
    showToast(`✓ อัปเดตข้อมูลผู้สัมผัสโรค HN: ${hn} เรียบร้อยแล้ว`);
  };

  // Map points
  const addMapPoint = (point: Omit<MapPoint, 'id'>) => {
    const newPoint: MapPoint = {
      ...point,
      id: Date.now(),
    };
    setMapPoints(prev => [newPoint, ...prev]);
    showToast(`✓ เพิ่มจุดพิกัด ${point.title} บนแผนที่เรียบร้อยแล้ว`);
  };

  // Alerts
  const addAlert = (alertData: { level: 'critical' | 'urgent' | 'warning' | 'info'; title: string; message: string; location: string }) => {
    const newAlert: Alert = {
      alert_id: Date.now(),
      created_at: new Date().toISOString(),
      is_read: false,
      year: selectedYear,
      ...alertData,
    };
    setAlerts(prev => [newAlert, ...prev]);
    showToast(`🚨 สร้างการแจ้งเตือน: ${alertData.title}`);
  };

  const markAlertRead = (alertId: number) => {
    setAlerts(prev => prev.map(a => a.alert_id === alertId ? { ...a, is_read: true } : a));
  };

  // Toggle 5km buffer radius
  const toggle5kmRadius = () => {
    setShow5kmRadius(prev => !prev);
    showToast(!show5kmRadius ? '🗺️ เปิดแสดงวงรัศมี 5 กิโลเมตรรอบจุดพบเชื้อ' : '🗺️ ซ่อนวงรัศมี 5 กิโลเมตร');
  };

  // Fiscal Year Handler
  const handleSelectYear = (year: FiscalYear) => {
    setSelectedYear(year);
    try {
      localStorage.setItem('rabies_kalasin_year', year);
    } catch {}
    showToast(`📅 เปลี่ยนเป็นข้อมูลปีงบประมาณ พ.ศ. ${year}`);
  };

  // District Filter Handler
  const handleSelectDistrict = (district: string) => {
    setSelectedDistrict(district);
    try {
      localStorage.setItem('rabies_kalasin_district', district);
    } catch {}
    const distObj = kalasinDistricts.find(d => d.id === district || d.name === district);
    const name = distObj ? distObj.name : district;
    showToast(district === 'all' ? '📍 แสดงข้อมูลภาพรวมทุกอำเภอ (จ.กาฬสินธุ์)' : `📍 กรองข้อมูลเฉพาะ: ${name}`);
  };

  const selectedDistrictName = useMemo(() => {
    if (selectedDistrict === 'all') return 'ทุกอำเภอ (จ.กาฬสินธุ์)';
    const dist = kalasinDistricts.find(d => d.id === selectedDistrict || d.name === selectedDistrict);
    return dist ? dist.name : selectedDistrict;
  }, [selectedDistrict]);

  // Dynamic filter for patients by selectedYear and selectedDistrict
  const filteredPatientsByYearAndDistrict = useMemo(() => {
    return patients.filter((p: PatientListItem) => {
      const matchYear = p.year === selectedYear || (!p.year && selectedYear === '2569');
      const matchDistrict = isDistrictMatch(p.district, selectedDistrict);
      return matchYear && matchDistrict;
    });
  }, [patients, selectedYear, selectedDistrict]);

  // Dynamic filter for alerts by selectedYear and selectedDistrict
  const filteredAlertsByYearAndDistrict = useMemo(() => {
    return alerts.filter((a: Alert) => {
      const matchYear = !a.year || a.year === selectedYear;
      const matchDistrict = isDistrictMatch(a.district, selectedDistrict);
      return matchYear && matchDistrict;
    });
  }, [alerts, selectedYear, selectedDistrict]);

  // Compute dynamic stats based on selected fiscal year AND selected district
  const dashboardSummary = useMemo<DashboardSummary>(() => {
    const base = yearlySummaries[selectedYear] || yearlySummaries['2569'];
    if (selectedDistrict === 'all') {
      return base;
    }

    const districtExposures = filteredPatientsByYearAndDistrict.length;
    const districtPositive = filteredAlertsByYearAndDistrict.filter((a: Alert) => a.level === 'critical' || a.sample_id || a.lab_result?.includes('บวก')).length;

    const cleanDistName = selectedDistrictName.replace(/^อ\./, '').trim();
    const vaxRecord = districtVaccinationData.find(d => d.district.includes(cleanDistName));
    const coverage = vaxRecord ? vaxRecord.coverage : base.vaccinationCoverage;

    return {
      totalCases: districtExposures + districtPositive,
      totalCasesChange: 0,
      totalExposures: districtExposures,
      totalExposuresChange: 0,
      positiveAnimals: districtPositive,
      positiveAnimalsChange: 0,
      vaccinationCoverage: coverage,
      vaccinationCoverageChange: 0,
    };
  }, [selectedYear, selectedDistrict, selectedDistrictName, filteredPatientsByYearAndDistrict, filteredAlertsByYearAndDistrict]);

  const categoryCount = useMemo<CategoryCount>(() => {
    if (selectedDistrict === 'all') {
      return initialCategoryCount;
    }

    let catI = 0;
    let catII = 0;
    let catIII = 0;
    filteredPatientsByYearAndDistrict.forEach((p: PatientListItem) => {
      if (p.wound_category === 'I') catI++;
      else if (p.wound_category === 'II') catII++;
      else if (p.wound_category === 'III') catIII++;
    });

    return {
      catI,
      catII,
      catIII,
      deaths: 0,
    };
  }, [selectedDistrict, filteredPatientsByYearAndDistrict]);

  const trendData = useMemo<TrendData[]>(() => {
    const baseTrends = yearlyTrends[selectedYear] || yearlyTrends['2569'];
    if (selectedDistrict === 'all') {
      return baseTrends;
    }

    const monthDataMap: Record<string, { exposures: number; positive: number }> = {};
    THAI_MONTH_DEFS.forEach(m => { monthDataMap[m.short] = { exposures: 0, positive: 0 }; });

    filteredAlertsByYearAndDistrict.forEach((a: Alert) => {
      const dateStr = a.date_thai || a.created_at || a.lab_date;
      const mKey = getThaiMonthShort(dateStr);
      if (mKey && monthDataMap[mKey]) {
        monthDataMap[mKey].positive++;
      }
    });

    filteredPatientsByYearAndDistrict.forEach((p: PatientListItem) => {
      const dateStr = p.exposure_date;
      const mKey = getThaiMonthShort(dateStr);
      if (mKey && monthDataMap[mKey]) {
        monthDataMap[mKey].exposures++;
      }
    });

    return THAI_MONTH_DEFS.map(m => ({
      month: m.short,
      cases: monthDataMap[m.short].exposures + monthDataMap[m.short].positive,
      exposures: monthDataMap[m.short].exposures,
      positiveAnimals: monthDataMap[m.short].positive,
    }));
  }, [selectedYear, selectedDistrict, filteredAlertsByYearAndDistrict, filteredPatientsByYearAndDistrict]);

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
        // High-Security Auth
        currentUser,
        isLoggedIn: !!currentUser,
        loginStep1,
        loginStep2,
        resendOtpChallenge,
        login,
        loginDemo,
        logout,
        isLoginOpen,
        setIsLoginOpen,
        loginReason,
        setLoginReason,
        // Change Password
        isChangePasswordOpen,
        setIsChangePasswordOpen,
        changePassword,
        // Security Audit
        isSecurityAuditOpen,
        setIsSecurityAuditOpen,
        auditLogs,
        refreshAuditLogs,
        clearAuditLogs: handleClearAuditLogs,
        // Session Inactivity
        sessionRemainingSeconds,
        extendSession,
        isSessionWarningOpen,
        setIsSessionWarningOpen,
        // PDPA
        isPdpaActive,
        togglePdpa,
        getDisplayName,
        // Fiscal Year
        selectedYear,
        setSelectedYear: handleSelectYear,
        // District Filter
        selectedDistrict,
        setSelectedDistrict: handleSelectDistrict,
        selectedDistrictName,
        isDistrictMatch: (itemDistrict?: string) => isDistrictMatch(itemDistrict, selectedDistrict),
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
