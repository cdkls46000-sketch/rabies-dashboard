import { Alert } from '@/types';

export const DASHBOARD_URL = 'https://cdkls46000-sketch.github.io/rabies-dashboard/';

/**
 * ข้อความสรุปกระชับหน้าเดียวสำหรับส่งเข้า LINE
 * (ออกแบบให้แสดงผลครบถ้วนในแชต LINE หน้าจอเดียว ไม่ถูกตัด ไม่ติดปุ่ม "See more")
 */
export function formatSingleScreenLineMessage(alert: Alert): string {
  const headNo = alert.head_no || alert.alert_id;
  const species = alert.animal_species || 'สุนัข';
  const isCow = species === 'โค';
  const isStray = alert.title.includes('จรจัด') || (!alert.title.includes('มีเจ้าของ') && !isCow);
  const animalType = isCow ? 'โค (สัตว์เกษตรกร)' : (isStray ? 'สุนัขจรจัด' : 'สุนัขมีเจ้าของ');
  
  const loc = alert.location || 'จ.กาฬสินธุ์';
  const dateStr = alert.date_thai || alert.lab_date || 'ต.ค. 2569';
  const sampleId = alert.sample_id ? ` (รหัส: ${alert.sample_id})` : '';
  
  const exposures = alert.exposures_count && alert.exposures_count > 0
    ? `${alert.exposures_count} ราย (รับวัคซีน PEP ครบ/คนป่วย 0)`
    : '0 ราย (ไม่มีผู้สัมผัสถูกกัด/คนป่วย 0)';

  const lines = [
    `🚨 แจ้งเตือนพิษสุนัขบ้า จ.กาฬสินธุ์ [หัวที่ ${headNo}]`,
    `📌 ตรวจพบเชื้อ: ${animalType} (ผลบวก DFA/PCR)`,
    `📍 จุดเกิดเหตุ: ${loc} (เขตควบคุม 5 กม.)`,
    `📅 วันที่ยืนยัน: ${dateStr} (ศวพ.ขอนแก่น)${sampleId}`,
    `👥 ผู้สัมผัสโรค: ${exposures}`,
    `🛡️ มาตรการ: ปูพรมฉีดวัคซีนรอบจุดเกิดเหตุ & กักสัตว์ 14 วัน`,
    `📄 ผล Lab (PDF) & แผนที่: ${DASHBOARD_URL}`
  ];

  return lines.join('\n');
}

/**
 * Alias สำหรับข้อความกระชับ
 */
export const formatConciseLineMessage = formatSingleScreenLineMessage;

/**
 * ค่าเริ่มต้นสำหรับการคัดลอกและแชร์ LINE: ใช้แบบหน้าเดียว (ไม่ติด See more)
 */
export const formatLineShareMessage = formatSingleScreenLineMessage;

/**
 * ข้อความรายงานสถานการณ์ฉบับเต็มอย่างเป็นทางการ
 * (สำหรับคัดลอกลง Clipboard ไปใช้ในหนังสือราชการหรือเอกสารรายงานทางการ)
 */
export function formatFullAlertMessage(alert: Alert): string {
  const headLabel = alert.head_no ? `[หัวที่ ${alert.head_no}]` : '';
  const species = alert.animal_species || 'สัตว์';
  
  const lines = [
    `🚨 รายงานแจ้งเตือนเหตุการณ์โรคพิษสุนัขบ้า จ.กาฬสินธุ์ ${headLabel}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 เหตุการณ์: ยืนยันผลบวกตรวจพบเชื้อใน${species} (Rabies Positive)`,
    `📍 พื้นที่เกิดเหตุ: ${alert.location}`,
    `📅 วันที่ยืนยันผล: ${alert.date_thai || alert.lab_date || 'พ.ศ. 2569'}`,
    ``,
    `🔬 ข้อมูลผลตรวจทางห้องปฏิบัติการ (Lab Result):`,
    `  • ผลตรวจ: ${alert.lab_result || 'ยืนยันผลบวก (Rabies Positive: DFA / RT-PCR +)'}`,
    `  • วิธีตรวจ: DFA (Direct Fluorescent Antibody) / RT-PCR`,
    `  • หน่วยงานตรวจ: ${alert.lab_agency || 'ศูนย์วิจัยและพัฒนาการสัตวแพทย์ภาคตะวันออกเฉียงเหนือตอนบน (ศวพ.ขอนแก่น)'}`,
    `  • รหัสตัวอย่าง Lab: ${alert.sample_id || `KLS-69-${String(alert.head_no || '0').padStart(3, '0')}`}`,
    ``,
    `👥 ข้อมูลผู้สัมผัสโรค (คน):`,
  ];

  if (alert.exposures_count && alert.exposures_count > 0) {
    lines.push(`  • จำนวนผู้สัมผัสเสี่ยง: ${alert.exposures_count} ราย (Cat I: ${alert.cat1_count || 0}, Cat II: ${alert.cat2_count || 0}, Cat III: ${alert.cat3_count || 0} ราย)`);
    lines.push(`  • การดูแลรักษา: ได้รับวัคซีนป้องกันหลังสัมผัส (PEP) ครบถ้วนตามมาตรฐาน`);
  } else {
    lines.push(`  • จำนวนผู้สัมผัสเสี่ยง: 0 ราย (ไม่มีผู้ถูกกัดหรือสัมผัสเชื้อ)`);
  }

  lines.push(`  • สถานการณ์ในคน: ปลอดผู้ป่วย 100% (ผู้ป่วย = 0 ราย, เสียชีวิต = 0 ราย)`);
  lines.push(``);
  lines.push(`🛡️ มาตรการควบคุมโรคในพื้นที่:`);
  lines.push(`  1. ประกาศเขตเฝ้าระวังโรคระบาดสัตว์ รัศมี 5 กิโลเมตร`);
  lines.push(`  2. ระดมปูพรมฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าในสุนัขและแมวรอบจุดเกิดเหตุ`);
  lines.push(`  3. กักสังเกตอาการสัตว์ในพื้นที่ 14 วัน`);
  lines.push(`  4. หากถูกกัด/ข่วน ให้ล้างแผลด้วยน้ำและสบู่ 15 นาที แล้วรีบพบแพทย์ทันที`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🗺️ ตรวจสอบแผนที่จุดเกิดเหตุและข้อมูลระบาดวิทยา:`);
  lines.push(`${DASHBOARD_URL}`);
  lines.push(`กลุ่มงานควบคุมโรคติดต่อ สสจ.กาฬสินธุ์ ร่วมกับ สำนักงานปศุสัตว์จังหวัดกาฬสินธุ์`);

  return lines.join('\n');
}

/**
 * LINE Web Share URL (เฉพาะ URL ไม่มี Text เพื่อไม่ให้ชนขีดจำกัดความยาวของเซิร์ฟเวอร์ LINE ซึ่งทำให้เกิด HTTP ERROR 400)
 */
export function getLineWebShareUrl(_alert?: Alert): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(DASHBOARD_URL)}`;
}

/**
 * Deep Link สำหรับเปิด LINE App บน Desktop/Mobile (ใช้ข้อความกระชับหน้าเดียว ไม่ติด See more)
 */
export function getLineAppDeepLink(alert: Alert): string {
  const concise = formatSingleScreenLineMessage(alert);
  return `line://msg/text/${encodeURIComponent(concise)}`;
}

/**
 * Native Share API (สำหรับโทรศัพท์มือถือ หรือเบราว์เซอร์ที่รองรับ Web Share)
 */
export async function shareNative(alert: Alert): Promise<boolean> {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({
        title: `แจ้งเตือนพิษสุนัขบ้า จ.กาฬสินธุ์ หัวที่ ${alert.head_no || ''}`,
        text: formatSingleScreenLineMessage(alert),
        url: DASHBOARD_URL,
      });
      return true;
    } catch {
      // User cancelled or unsupported
      return false;
    }
  }
  return false;
}

/**
 * ฟังก์ชันแชร์สำรอง: คัดลอกข้อความกระชับลงคลิปบอร์ด
 */
export function shareToLine(alert: Alert, onNotify?: (message: string) => void) {
  const text = formatSingleScreenLineMessage(alert);
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (onNotify) {
        onNotify(`📋 คัดลอกข้อความกระชับ (หน้าเดียว) หัวที่ ${alert.head_no || ''} แล้ว นำไปวาง (Ctrl+V) ใน LINE ได้ทันที`);
      }
    }).catch(() => {});
  }
}
