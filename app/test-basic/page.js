export default function TestBasic() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅ Basic Test</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#ccc' }}>
          If you can see this, the basic Next.js setup is working!
        </p>
        <div style={{ color: '#FFD700' }}>
          No Tailwind, no custom CSS, just basic HTML and inline styles.
        </div>
      </div>
    </div>
  )
} 