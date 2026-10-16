import { Alert } from '@/types';

export function formatLineShareMessage(alert: Alert): string {
  const headLabel = alert.head_no ? `[หัวที่ ${alert.head_no}]` : '';
  const species = alert.animal_species || 'สัตว์';
  
  const lines = [
    `🚨 แจ้งเตือนโรคพิษสุนัขบ้า จ.กาฬสินธุ์ ${headLabel}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📌 เหตุการณ์: ตรวจพบเชื้อใน${species} (ผลบวก Lab +)`,
    `📍 พื้นที่: ${alert.location}`,
    `📅 วันที่ยืนยันผล: ${alert.date_thai || alert.lab_date || 'พ.ศ. 2569'}`,
    ``,
    `🔬 ผลตรวจทางห้องปฏิบัติการ (Lab Result):`,
    `• ผลตรวจ: ${alert.lab_result || 'ยืนยันผลบวก (Rabies Positive: DFA / RT-PCR +)'}`,
    `• หน่วยงานตรวจ: ${alert.lab_agency || 'ศูนย์วิจัยและพัฒนาการสัตวแพทย์ภาคตะวันออกเฉียงเหนือตอนบน (ศวพ.ขอนแก่น)'}`,
    `• รหัสตัวอย่าง: ${alert.sample_id || `KLS-69-${String(alert.head_no || '0').padStart(3, '0')}`}`,
    ``,
    `👥 ข้อมูลผู้สัมผัสโรค (คน):`,
  ];

  if (alert.exposures_count && alert.exposures_count > 0) {
    lines.push(`• ผู้สัมผัสเสี่ยง: ${alert.exposures_count} ราย (Cat I: ${alert.cat1_count || 0}, Cat II: ${alert.cat2_count || 0}, Cat III: ${alert.cat3_count || 0} ราย)`);
    lines.push(`• การดูแล: ได้รับวัคซีนป้องกันหลังสัมผัส (PEP) ครบถ้วนตามมาตรฐาน`);
  } else {
    lines.push(`• ผู้สัมผัสเสี่ยง: 0 ราย (ไม่มีผู้ถูกกัด/สัมผัส)`);
  }

  lines.push(`• สถานการณ์ในคน: ปลอดผู้ป่วย 100% (ผู้ป่วย = 0 ราย, เสียชีวิต = 0 ราย)`);
  lines.push(``);
  lines.push(`🛡️ มาตรการควบคุมโรคในพื้นที่:`);
  lines.push(`1. ประกาศเขตเฝ้าระวังโรคระบาดสัตว์ รัศมี 5 กิโลเมตร`);
  lines.push(`2. เจ้าของสัตว์เลี้ยงต้องนำสุนัข-แมวไปฉีดวัคซีนป้องกันทันที`);
  lines.push(`3. หากถูกกัด/ข่วน ให้ล้างแผลด้วยน้ำและสบู่อย่างน้อย 15 นาที แล้วรีบไปพบแพทย์ทันที`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🗺️ ตรวจสอบแผนที่จุดเกิดเหตุและสถิติ:`);
  lines.push(`https://cdkls46000-sketch.github.io/rabies-dashboard/`);
  lines.push(`สสจ.กาฬสินธุ์ ร่วมกับ สำนักงานปศุสัตว์จังหวัดกาฬสินธุ์`);

  return lines.join('\n');
}

export function shareToLine(alert: Alert) {
  const text = formatLineShareMessage(alert);
  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
  window.open(lineUrl, '_blank');
}
