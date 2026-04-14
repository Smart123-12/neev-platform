// ─── MapView — Google Maps ────────────────────
import React, { useEffect, useRef } from 'react';

const URGENCY_COLORS = {
  High:   '#ef4444', // red
  Medium: '#f59e0b', // amber
  Low:    '#3b82f6', // blue
};

let mapsLoaded = false;

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    if (mapsLoaded) {
      const check = setInterval(() => {
        if (window.google?.maps) { clearInterval(check); resolve(); }
      }, 200);
      return;
    }
    mapsLoaded = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function MapView({ needs }) {
  const mapRef   = useRef(null);
  const mapObj   = useRef(null);
  const markers  = useRef([]);
  const apiKey   = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    async function init() {
      if (!apiKey) return; // Map placeholder shown instead
      try {
        await loadGoogleMaps(apiKey);
        if (!mapRef.current) return;

        mapObj.current = new window.google.maps.Map(mapRef.current, {
          center:    { lat: 20.5937, lng: 78.9629 }, // India center
          zoom:      5,
          styles:    NEEV_MAP_STYLE,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      } catch (e) {
        console.error('Google Maps failed to load', e);
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // Add/update markers when needs change
  useEffect(() => {
    if (!mapObj.current || !window.google) return;

    // Clear existing
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    needs.forEach((need) => {
      if (!need.location?.lat) return;

      const pinColor = URGENCY_COLORS[need.urgency] || '#6b7280';

      const marker = new window.google.maps.Marker({
        position: { lat: need.location.lat, lng: need.location.lng },
        map: mapObj.current,
        title: need.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: pinColor,
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:'DM Sans',sans-serif;padding:4px;min-width:200px">
            <h4 style="color:#0d1f35;font-family:'Playfair Display',serif;margin:0 0 4px;font-size:0.95rem">${need.title}</h4>
            <p style="color:#3d5166;font-size:0.78rem;margin:0 0 4px">${need.ngoName} · ${need.location.city}</p>
            <p style="font-size:0.78rem;margin:0 0 6px">👥 ${need.volunteersNeeded} volunteers needed</p>
            <a href="/ngo" style="color:#c9a84c;font-size:0.78rem;font-weight:600">View Details →</a>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapObj.current, marker);
      });

      markers.current.push(marker);
    });
  }, [needs]);

  if (!apiKey) {
    return (
      <div
        style={{
          height: '100%',
          background: 'var(--neev-mist)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: '3rem' }}>🗺️</span>
        <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', color: 'var(--neev-slate)', fontSize: '1rem', textAlign: 'center', maxWidth: 320 }}>
          Google Maps is not configured.
          <br />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontStyle: 'normal' }}>
            Add your <code>VITE_GOOGLE_MAPS_API_KEY</code> to .env to enable the map.
          </span>
        </p>
        {/* Demo: render a static list of locations */}
        <div className="flex flex-col gap-2" style={{ marginTop: 8 }}>
          {needs.map((n) => (
            <div key={n.id} style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: URGENCY_COLORS[n.urgency], display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: 'var(--neev-navy)', fontWeight: 600 }}>{n.title}</span>
              <span style={{ color: 'var(--neev-slate)' }}>{n.location?.city}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 8 }} />;
}

// Custom NEEV map style (subtle navy/cream)
const NEEV_MAP_STYLE = [
  { elementType: 'geometry',        stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#3d5166' }] },
  { featureType: 'water',           elementType: 'geometry', stylers: [{ color: '#c9d9ef' }] },
  { featureType: 'road',            elementType: 'geometry', stylers: [{ color: '#e8dcc8' }] },
  { featureType: 'road.highway',    elementType: 'geometry', stylers: [{ color: '#c9a84c' }] },
  { featureType: 'poi',             stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',         stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative',  elementType: 'geometry', stylers: [{ color: '#0d1f35' }] },
];
