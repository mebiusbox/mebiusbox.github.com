import React from 'react';

export default function Highlight({children, color = "var(--ifm-color-primary-dark)"}) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '2px',
        color: 'var(--ifm-color-emphasis-0)',
        padding: '0.2rem 0.4rem',
        margin: '0 0.4rem',
        fontFamily: 'var(--ifm-font-family-monospace)',
      }}>
      {children}
    </span>
  );
}