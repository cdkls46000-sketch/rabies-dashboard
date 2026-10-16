import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r"D:\GRAVITY\Rabies\Rabies 2026  ข้อมูล ณ วันที่ 15 ตุลาคม 2569\กำกับติดตาม วัคซีน และอาการอันไม่พึงประสง  15 ตค 2569.docx"
out_path = r"D:\GRAVITY\Rabies\scripts\official_summary.txt"

with open(out_path, "w", encoding="utf-8") as out:
    if os.path.exists(docx_path):
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            tables = root.findall('.//w:tbl', ns)
            out.write(f"Total tables found: {len(tables)}\n")
            
            for t_idx, tbl in enumerate(tables):
                out.write(f"\n--- TABLE {t_idx+1} ---\n")
                rows = tbl.findall('.//w:tr', ns)
                for r_idx, row in enumerate(rows):
                    cells = row.findall('.//w:tc', ns)
                    cell_texts = []
                    for cell in cells:
                        texts = [node.text for node in cell.findall('.//w:t', ns) if node.text]
                        cell_texts.append("".join(texts).strip())
                    out.write(f"Row {r_idx}: " + " | ".join(cell_texts) + "\n")
                    
            paragraphs = root.findall('.//w:p', ns)
            out.write(f"\nTotal paragraphs: {len(paragraphs)}\n")
            for p in paragraphs:
                texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
                t = "".join(texts).strip()
                if t:
                    out.write("P: " + t + "\n")
    else:
        out.write(f"File not found: {docx_path}\n")
