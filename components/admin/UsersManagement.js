'use client'

export default function UsersManagement({ 
  users, 
  showUserModal, 
  setShowUserModal, 
  showEditUserModal, 
  setShowEditUserModal,
  userForm,
  setUserForm,
  editingUser,
  handleUserAction,
  handleCreateUser,
  handleUpdateUser
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#00ff00', fontSize: '1.5rem' }}>User Management</h2>
        <button
          onClick={() => setShowUserModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00ff00',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Add New User
        </button>
      </div>

      <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '10px', color: '#00ff00' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '10px', color: '#00ff00' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '10px', color: '#00ff00' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '10px', color: '#00ff00' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '10px', color: '#00ff00' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '10px' }}>{user.name}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>{user.role}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    backgroundColor: user.status === 'active' ? '#00ff00' : '#ff0000',
                    color: user.status === 'active' ? '#000' : '#fff'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleUserAction('edit', user.id)}
                    style={{
                      marginRight: '5px',
                      padding: '5px 10px',
                      backgroundColor: '#0066ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleUserAction('delete', user.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff0000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333',
            width: '400px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#00ff00' }}>Add New User</h3>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Name:</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Email:</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Role:</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#111',
            padding: '30px',
            borderRadius: '10px',
            border: '1px solid #333',
            width: '400px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#00ff00' }}>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Name:</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Email:</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Role:</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#ccc' }}>Status:</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#222',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    color: '#fff'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00ff00',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 