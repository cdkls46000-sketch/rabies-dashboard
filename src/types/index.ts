// ===== Core Data Types =====

export interface Case {
  case_id: number;
  case_code: string;
  report_date: string;
  case_type: 'human_exposure' | 'animal_positive' | 'animal_suspect';
  status: 'active' | 'closed' | 'monitoring';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location_id: number;
  description: string;
  created_at: string;
  updated_at: string;
  location?: Location;
  patients?: Patient[];
  animals?: Animal[];
}

export interface Patient {
  patient_id: number;
  case_id: number;
  hn: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  id_card: string;
  phone: string;
  exposure_type: 'bite' | 'scratch' | 'lick' | 'other';
  wound_site: string;
  wound_category: 'I' | 'II' | 'III';
  exposure_date: string;
  risk_level: 'high' | 'medium' | 'low';
  treatments?: Treatment[];
  follow_ups?: FollowUp[];
}

export interface Animal {
  animal_id: number;
  case_id: number;
  species: 'dog' | 'cat' | 'bat' | 'other';
  breed: string;
  ownership: 'owned' | 'stray' | 'unknown';
  owner_name: string;
  animal_status: 'alive' | 'dead' | 'euthanized' | 'escaped';
  is_vaccinated: boolean;
  last_vaccine_date: string | null;
  observation_result: 'normal' | 'symptomatic' | 'dead' | 'pending';
  lab_results?: LabResult[];
}

export interface Treatment {
  treatment_id: number;
  patient_id: number;
  vaccine_type: 'PVRV' | 'PCECV' | 'HDCV';
  vaccine_date: string;
  dose_number: number;
  injection_site: string;
  rig_given: boolean;
  adverse_reaction: string;
  treatment_center: string;
}

export interface LabResult {
  lab_id: number;
  animal_id: number;
  test_method: 'DFA' | 'dRIT' | 'ELISA' | 'PCR';
  sample_date: string;
  result_date: string | null;
  result: 'positive' | 'negative' | 'pending' | 'inconclusive';
  lab_name: string;
  remarks: string;
}

export interface Vaccination {
  vax_id: number;
  animal_id: number;
  vaccine_brand: string;
  vaccine_date: string;
  next_due_date: string;
  vaccinator: string;
  location_id: number;
}

export interface Location {
  location_id: number;
  address: string;
  latitude: number;
  longitude: number;
  sub_district_id: number;
  district_id: number;
  province_id: number;
  province?: Province;
  district?: District;
  sub_district?: SubDistrict;
}

export interface Province {
  province_id: number;
  province_name: string;
  region: string;
}

export interface District {
  district_id: number;
  district_name: string;
  province_id: number;
}

export interface SubDistrict {
  sub_district_id: number;
  sub_district_name: string;
  district_id: number;
}

export interface FollowUp {
  followup_id: number;
  patient_id: number;
  followup_date: string;
  day_number: number;
  status: 'completed' | 'pending' | 'missed';
  notes: string;
  officer_name: string;
}

export interface Alert {
  alert_id: number;
  level: 'critical' | 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  location: string;
  created_at: string;
  is_read: boolean;
  case_id?: number;
  head_no?: number;
  date_thai?: string;
  animal_species?: string;
  lab_result?: string;
  lab_agency?: string;
  sample_id?: string;
  lab_date?: string;
  exposures_count?: number;
  cat1_count?: number;
  cat2_count?: number;
  cat3_count?: number;
  is_recent_1_month?: boolean;
  district?: string;
  subdistrict?: string;
  village_name?: string;
  year?: FiscalYear;
  pdf_url?: string;
}

// ===== Dashboard Summary Types =====

export interface DashboardSummary {
  totalCases: number;
  totalCasesChange: number;
  totalExposures: number;
  totalExposuresChange: number;
  positiveAnimals: number;
  positiveAnimalsChange: number;
  vaccinationCoverage: number;
  vaccinationCoverageChange: number;
}

export interface TrendData {
  month: string;
  cases: number;
  exposures: number;
  positiveAnimals: number;
}

export interface SpeciesData {
  name: string;
  value: number;
  color: string;
}

export interface ProvinceRankData {
  province: string;
  cases: number;
  positiveAnimals?: number;
  exposures?: number;
}

export interface VaccineCoverageData {
  dose: string;
  percentage: number;
}

export interface DistrictVaccinationData {
  district: string;
  target: number;
  vaccinated: number;
  remaining: number;
  coverage: number;
}

export type FiscalYear = '2568' | '2569' | '2570' | '2571';

export interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  title: string;
  type: 'positive' | 'suspect' | 'exposure';
  date: string;
  details: string;
  district?: string;
  subdistrict?: string;
  village_no?: string; // หมู่ที่ เช่น "หมู่ 3"
  village_name?: string; // ชื่อหมู่บ้าน เช่น "บ้านบัวบาน"
  radius_m?: number; // รัศมีควบคุมโรค เช่น 5000 (5 กม.)
  year?: FiscalYear;
}

export interface CategoryCount {
  catI: number;
  catII: number;
  catIII: number;
  deaths: number;
}

export interface PatientListItem {
  hn: string;
  name: string;
  age: number;
  exposure_date: string;
  year?: FiscalYear;
  wound_category: 'I' | 'II' | 'III';
  vaccine_status: string;
  follow_up_status: 'completed' | 'pending' | 'overdue';
  phone?: string;
  district?: string;
  subdistrict?: string;
  village_no?: string; // หมู่ที่ เช่น "หมู่ 2"
  village_name?: string; // ชื่อหมู่บ้าน/ชุมชน เช่น "บ้านดงลิง"
  latitude?: number;
  longitude?: number;
  wound_site?: string;
  exposure_type?: string;
  animal_species?: string;
  animal_status?: string;
  hospital?: string;
  rig_given?: boolean;
  notes?: string;
}

export interface AnimalSummary {
  totalReported: number;
  totalReportedChange: number;
  positive: number;
  positiveChange: number;
  pendingLab: number;
  pendingLabChange: number;
  vaccinated: number;
  vaccinatedChange: number;
}

export interface LabSummary {
  positive: number;
  positivePercent: number;
  negative: number;
  negativePercent: number;
  pending: number;
  pendingPercent: number;
}

export interface AlertSummary {
  critical: number;
  urgent: number;
  warning: number;
  info: number;
}

export interface AuthUser {
  username: string;
  name: string;
  role: 'officer' | 'admin';
  position: string;
  organization: string;
  phoneMasked?: string;
  lastLogin?: string;
  sessionToken?: string;
  mfaVerified?: boolean;
}

export type { SecurityAuditLog } from '@/lib/security';
