// src/pages/Products.tsx or src/components/Products.tsx
import React from 'react';

const Product: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '1.8rem', fontWeight: 600 }}>
        Products Dashboard
      </h1>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '700px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          background: '#fff',
        }}
      >
        <iframe
          src="https://skyblue-admin-two.vercel.app/"
          title="Skyblue Admin Products Panel"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads"
          loading="lazy"
        />
      </div>

      <p style={{ marginTop: '16px', color: '#666', fontSize: '0.9rem' }}>
        This is an embedded admin dashboard for managing products.
      </p>
    </div>
  );
};

export default Product;
