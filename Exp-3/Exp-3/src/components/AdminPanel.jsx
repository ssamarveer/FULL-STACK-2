import { useEffect, useState } from 'react'
import { api } from '../api'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const load = async () => { try { setUsers((await api('/admin/users')).users); setError('') } catch (e) { setError(e.message) } }
  useEffect(() => { load() }, [])
  const changeRole = async (id, role) => { try { await api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }); load() } catch (e) { setError(e.message) } }
  return <main className="utility-page"><div className="utility-card admin-card">
    <div className="auth-kicker">ACCESS CONTROL</div><h1>User & Role Management</h1><p>Admin can see which role every account currently has and change it.</p>
    {error && <div className="auth-error">{error}</div>}
    <div className="admin-table"><div className="admin-row admin-head"><span>Username</span><span>Role</span><span>Created</span><span>Change role</span></div>
      {users.map(u => <div className="admin-row" key={u.id}><b>{u.username}</b><span className={`role-pill role-${u.role.toLowerCase()}`}>{u.role}</span><span>{new Date(u.createdAt).toLocaleString()}</span><select value={u.role} onChange={e => changeRole(u.id, e.target.value)}><option>Admin</option><option>Editor</option><option>Viewer</option></select></div>)}
    </div>
  </div></main>
}
