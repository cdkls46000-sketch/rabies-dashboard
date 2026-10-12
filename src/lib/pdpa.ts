/**
 * ระบบจัดการความปลอดภัยและคุ้มครองข้อมูลส่วนบุคคล (PDPA Compliance)
 * ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
 */

/**
 * ปกปิด/อำพรางชื่อ-นามสกุล (Name Masking)
 * ตัวอย่าง: "สมชาย ภูแล่นดี" -> "ส*** ภ***"
 *          "นายสมหมาย ศรีกาฬสินธุ์" -> "น*** ศ***"
 */
export function maskThaiName(name: string): string {
  if (!name) return '-';
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    const single = parts[0];
    if (single.length <= 1) return single + '*';
    return single.charAt(0) + '***';
  }

  return parts
    .map((part) => {
      if (!part) return '';
      return part.charAt(0) + '***';
    })
    .join(' ');
}

/**
 * ปกปิดหมายเลขโทรศัพท์ (Phone Masking)
 * ตัวอย่าง: "081-234-5678" -> "081-***-5678"
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '-';
  const clean = phone.replace(/[^\d]/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 3)}-***-${clean.slice(7)}`;
  }
  if (clean.length === 9) {
    return `${clean.slice(0, 2)}-***-${clean.slice(6)}`;
  }
  return '***-***-****';
}

/**
 * ปกปิดเลขประจำตัวประชาชน 13 หลัก (Citizen ID Masking)
 * ตัวอย่าง: "1-4099-00123-45-6" -> "1-****-*****-**-6"
 */
export function maskCitizenId(id?: string): string {
  if (!id) return '-';
  const clean = id.replace(/[^\d]/g, '');
  if (clean.length === 13) {
    return `${clean.charAt(0)}-****-*****-**-${clean.slice(-1)}`;
  }
  return '*-****-*****-**-*';
}
