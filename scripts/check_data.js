const fs = require('fs');

const content = fs.readFileSync('src/lib/mock-data.ts', 'utf8');

// Find patientList
const pStart = content.indexOf('export const patientList: PatientListItem[] = [');
const pEnd = content.indexOf('export const vaccineCoverageData:', pStart);
const patientSlice = content.substring(pStart, pEnd);

// Find all "hn": "..."
const hns = [];
const hnRegex = /"hn":\s*"([^"]+)"/g;
let match;
while ((match = hnRegex.exec(patientSlice)) !== null) {
  hns.push(match[1]);
}

console.log('Total HNs in patientList:', hns.length);
console.log('Sample HNs:', hns.slice(0, 10), '...', hns.slice(-10));

// Let's also check categoryCount in mock-data
const catMatch = content.match(/export const categoryCount: CategoryCount = \{[\s\S]*?\};/);
if (catMatch) console.log('categoryCount in mock-data:', catMatch[0]);

// Let's also check yearlySummaries
const yMatch = content.match(/export const yearlySummaries[\s\S]*?\};/);
if (yMatch) console.log('yearlySummaries:', yMatch[0]);

// Let's check yearlyTrends
const tMatch = content.match(/export const yearlyTrends[\s\S]*?^export /m);
if (tMatch) console.log('yearlyTrends:', tMatch[0]);
