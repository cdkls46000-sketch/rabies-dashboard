import zipfile
import xml.etree.ElementTree as ET

docx_path = r"D:\GRAVITY\Rabies\Rabies 2026  ข้อมูล ณ วันที่ 15 ตุลาคม 2569\กำกับติดตาม วัคซีน และอาการอันไม่พึงประสง  15 ตค 2569.docx"
out_path = r"D:\GRAVITY\Rabies\scripts\cells_out.txt"

with open(out_path, "w", encoding="utf-8") as out:
    with zipfile.ZipFile(docx_path) as z:
        xml_content = z.read('word/document.xml')
        root = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        tables = root.findall('.//w:tbl', ns)
        for t_idx, tbl in enumerate(tables, 1):
            out.write(f"\n================ TABLE {t_idx} ================\n")
            rows = tbl.findall('.//w:tr', ns)
            for r_idx, row in enumerate(rows):
                cells = row.findall('.//w:tc', ns)
                row_vals = []
                for c_idx, cell in enumerate(cells):
                    texts = [node.text for node in cell.findall('.//w:t', ns) if node.text]
                    val = "".join(texts).strip()
                    row_vals.append(f"C{c_idx}:{val}")
                out.write(f"R{r_idx:02d} ({len(cells)} cols): " + " ; ".join(row_vals) + "\n")
