'use client';

import { useEffect, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useData } from '@/context/data-context';

// Fix for default marker icons in React Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const getIcon = (color: string, label?: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        background-color: ${color}; 
        width: 18px; 
        height: 18px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 6px rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="background-color: white; width: 4px; height: 4px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const iconPositive = getIcon('#ef4444'); // red
const iconSuspect = getIcon('#f59e0b'); // amber
const iconExposure = getIcon('#3b82f6'); // blue

export default function MapInner() {
  const { mapPoints, show5kmRadius, selectedYear } = useData();

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl,
      iconUrl: iconUrl,
      shadowUrl: shadowUrl,
    });
  }, []);

  // Filter map points by selected fiscal year
  const displayPoints = mapPoints.filter(p => p.year === selectedYear || (!p.year && selectedYear === '2569'));

  return (
    <MapContainer 
      center={[16.5800, 103.5800]} 
      zoom={9} 
      style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {displayPoints.map((point) => {
        let icon = iconExposure;
        let strokeColor = '#3b82f6';
        let typeBadge = 'ผู้สัมผัสโรค (คน)';
        let typeBadgeBg = '#dbeafe';
        let typeBadgeText = '#1e40af';

        if (point.type === 'positive') {
          icon = iconPositive;
          strokeColor = '#ef4444';
          typeBadge = '🔴 สัตว์ติดเชื้อผลบวก';
          typeBadgeBg = '#fee2e2';
          typeBadgeText = '#991b1b';
        } else if (point.type === 'suspect') {
          icon = iconSuspect;
          strokeColor = '#f59e0b';
          typeBadge = '🟡 สัตว์สงสัยเฝ้าระวัง';
          typeBadgeBg = '#fef3c7';
          typeBadgeText = '#92400e';
        } else {
          typeBadge = '🔵 ผู้สัมผัสโรค (คน)';
        }

        const radius = point.radius_m || 5000;

        return (
          <Fragment key={`point-group-${point.id}`}>
            {/* วงรัศมี 5 กิโลเมตร (ข้อ 3: แสดงวงรัศมี 5 กิโลเมตรรอบจุด) */}
            {show5kmRadius && (
              <Circle
                center={[point.lat, point.lng]}
                radius={radius}
                pathOptions={{
                  color: strokeColor,
                  fillColor: strokeColor,
                  fillOpacity: 0.12,
                  weight: 1.5,
                  dashArray: '5, 5',
                }}
              />
            )}

            {/* จุดสีแสดงบนแผนที่ */}
            <Marker 
              position={[point.lat, point.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-1 min-w-[210px] space-y-1.5 font-sans">
                  {/* Type Badge */}
                  <div className="flex items-center justify-between gap-1 border-b pb-1">
                    <span 
                      style={{ backgroundColor: typeBadgeBg, color: typeBadgeText }}
                      className="px-2 py-0.5 rounded text-[11px] font-bold"
                    >
                      {typeBadge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      ปี พ.ศ. {point.year || selectedYear}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xs text-slate-900 leading-tight">
                    {point.title}
                  </h3>

                  {/* Village-level information (ข้อ 2: ย่อยถึงระดับหมู่บ้าน) */}
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[11px] space-y-0.5">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <span>🏘️</span>
                      <span>
                        {point.village_no ? `${point.village_no} ` : ''}
                        {point.village_name || 'ในเขตพื้นที่หมู่บ้าน'}
                      </span>
                    </div>
                    <div className="text-slate-600 pl-4">
                      {point.subdistrict ? `${point.subdistrict} ` : ''}
                      {point.district || 'จ.กาฬสินธุ์'}
                    </div>
                  </div>

                  {/* 5km Radius Zone info (ข้อ 3) */}
                  <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                    <span>⭕</span>
                    <span>วงรัศมีควบคุมโรค: <strong>{(radius / 1000).toFixed(1)} กม.</strong> (5,000 ม.)</span>
                  </div>

                  {/* Date and details */}
                  <div className="text-[11px] text-slate-600 leading-snug pt-0.5">
                    <div className="text-slate-500 text-[10px] mb-0.5">วันที่รายงาน: {point.date}</div>
                    <div>{point.details}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </Fragment>
        );
      })}
    </MapContainer>
  );
}
