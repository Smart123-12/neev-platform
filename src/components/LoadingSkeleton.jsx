// ─── Loading Skeleton ─────────────────────────
import React from 'react';

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="neev-card" style={{ borderLeft: '3px solid rgba(201,168,76,0.3)' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: i === 0 ? 20 : 14,
            width: i === 0 ? '60%' : i % 2 === 0 ? '90%' : '75%',
            marginBottom: 10,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonText({ width = '100%', height = 16 }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: 4, marginBottom: 8 }} />
  );
}

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={i % 2 === 0 ? 3 : 4} />
      ))}
    </div>
  );
}
