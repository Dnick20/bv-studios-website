export default function Working() {
  return (
    <html>
      <head>
        <title>BV Studios - Working Test</title>
      </head>
      <body style={{ 
        margin: 0, 
        padding: '20px', 
        backgroundColor: '#000', 
        color: '#fff',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          textAlign: 'center',
          paddingTop: '100px'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
            ✅ BV Studios
          </h1>
          <p style={{ fontSize: '24px', marginBottom: '40px', color: '#ccc' }}>
            This page should definitely work!
          </p>
          
          <div style={{ 
            backgroundColor: '#333', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#FFD700', marginBottom: '10px' }}>Status Check:</h2>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '5px' }}>✅ Basic HTML rendering</li>
              <li style={{ marginBottom: '5px' }}>✅ Inline CSS working</li>
              <li style={{ marginBottom: '5px' }}>✅ No external dependencies</li>
              <li style={{ marginBottom: '5px' }}>✅ No Tailwind required</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <a 
              href="/api/debug" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#FFD700',
                color: '#000',
                textDecoration: 'none',
                borderRadius: '4px',
                marginRight: '10px'
              }}
            >
              Test API
            </a>
            <a 
              href="/" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#FFD700',
                textDecoration: 'none',
                border: '1px solid #FFD700',
                borderRadius: '4px'
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
} 