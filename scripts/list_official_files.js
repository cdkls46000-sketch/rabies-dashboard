const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\GRAVITY\\Rabies\\Rabies 2026  ข้อมูล ณ วันที่ 15 ตุลาคม 2569';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push({ path: fullPath, size: stat.size, name: file });
    }
  });
  return results;
}

const files = walk(baseDir);
console.log('Total files found:', files.length);
files.forEach(f => {
  console.log(f.name, '(' + f.size + ' bytes)', path.relative(baseDir, f.path));
});
