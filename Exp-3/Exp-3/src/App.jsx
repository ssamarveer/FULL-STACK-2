import { useEffect, useState } from 'react'
import PostComposer from './components/PostComposer'
import AdminPanel from './components/AdminPanel'

import { api } from './api'

function Auth({ onLogin }) {
  const [mode,setMode]=useState('login'), [username,setUsername]=useState('admin'), [password,setPassword]=useState('admin123'), [error,setError]=useState('')
  const submit=async e=>{ e.preventDefault(); setError(''); try { if(mode==='register'){ await api('/auth/register',{method:'POST',body:JSON.stringify({username,password})}); setMode('login'); setUsername(''); setPassword(''); return } const data=await api('/auth/login',{method:'POST',body:JSON.stringify({username,password})}); localStorage.setItem('post_composer_jwt',data.token); onLogin(data.user) } catch(err){setError(err.message)} }
  return <div className="auth-shell"><div className="auth-card"><div className="rf-logo">PC</div><div className="auth-kicker">POST COMPOSER</div><h1>{mode==='login'?'Sign in':'Create account'}</h1><p>JWT authentication with role-based post permissions.</p><form onSubmit={submit}><label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)} required/><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>{error&&<div className="auth-error">{error}</div>}<button className="primary-action">{mode==='login'?'Sign in':'Register'}</button></form>{mode==='login'&&<small className="demo-note">Demo Admin: <b>admin</b> / <b>admin123</b></small>}<button className="switch-auth" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create a new Viewer account':'Back to login'}</button></div></div>
}

export default function App(){
 const [user,setUser]=useState(null),[tab,setTab]=useState('composer'),[payload,setPayload]=useState(null)
 const loadMe=()=>api('/auth/me').then(d=>{setUser(d.user);setPayload(d.payload)}).catch(()=>{localStorage.removeItem('post_composer_jwt');setUser(null)})
 useEffect(()=>{if(localStorage.getItem('post_composer_jwt')) loadMe()},[])
 if(!user) return <Auth onLogin={loadMe}/>
 const logout=()=>{localStorage.removeItem('post_composer_jwt');setUser(null)}
 return <div className="app-shell"><header className="app-bar"><div className="app-brand"><span>PC</span><div><b>Post Composer</b><small>Role-based publishing</small></div></div><nav><button className={tab==='composer'?'nav-active':''} onClick={()=>setTab('composer')}>Composer</button><button className={tab==='posts'?'nav-active':''} onClick={()=>setTab('posts')}>Posts</button>{user.role==='Admin'&&<button className={tab==='admin'?'nav-active':''} onClick={()=>setTab('admin')}>Admin</button>}<button className={tab==='payload'?'nav-active':''} onClick={()=>setTab('payload')}>JWT Payload</button></nav><div className="user-area"><span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span><span>{user.username}</span><button className="logout-btn" onClick={logout}>Log out</button></div></header>{tab==='composer'&&<PostComposer user={user}/>} {tab==='posts'&&<PostList user={user}/>} {tab==='admin'&&user.role==='Admin'&&<AdminPanel/>} {tab==='payload'&&<Payload payload={payload}/>}</div>
}

function Payload({payload}){const token=localStorage.getItem('post_composer_jwt');return <main className="utility-page"><div className="utility-card"><div className="auth-kicker">AUTHENTICATION</div><h1>Decoded JWT Payload</h1><p>The API verifies the signed token before returning this payload.</p><pre>{JSON.stringify(payload,null,2)}</pre><h3>Raw JWT</h3><div className="raw-token">{token}</div></div></main>}

function PostList({ user }) {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadPosts = async () => {
      try {
        const data = await api('/posts')

        if (!cancelled) {
          setPosts(data.posts || [])
          setMessage('')
        }
      } catch (e) {
        if (!cancelled) {
          setMessage(e.message)
        }
      }
    }

    loadPosts()

    return () => {
      cancelled = true
    }
  }, [])

  const load = async () => {
    try {
      const data = await api('/posts')
      setPosts(data.posts || [])
      setMessage('')
    } catch (e) {
      setMessage(e.message)
    }
  }

  const remove = async (id) => {
    try {
      await api('/posts/' + id, {
        method: 'DELETE'
      })

      await load()
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <main className="utility-page">
      <div className="utility-card">
        <div className="auth-kicker">PUBLISHED POSTS</div>

        <h1>Saved Posts</h1>

        <p>All posts created in Post Composer.</p>

        {message && (
          <div className="notice">
            {message}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="empty-state">
            No posts yet.{' '}
            {user.role === 'Admin'
              ? 'Create one from Composer.'
              : 'Wait for an Admin to create a post.'}
          </div>
        ) : (
          posts.map((p) => (
            <div className="post-row" key={p.id}>
              <div className="post-main">
                <div className="post-meta">
                  <b>{p.createdBy}</b>

                  <span>
                    {new Date(p.updatedAt).toLocaleString()}
                  </span>

                  <span className="mini-role">
                    {p.platforms.join(', ')}
                  </span>
                </div>

                <div className="post-text">
                  {p.text}
                </div>
              </div>

              {user.role !== 'Viewer' && (
                <div className="post-actions">
                  <button onClick={() => setEditing(p)}>
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() => remove(p.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {editing && (
        <EditModal
          post={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </main>
  )
}
function EditModal({post,onClose,onSaved}){const [text,setText]=useState(post.text),[error,setError]=useState('');const save=async()=>{try{await api('/posts/'+post.id,{method:'PUT',body:JSON.stringify({...post,text})});onSaved()}catch(e){setError(e.message)}};return <div className="modal-backdrop"><div className="modal"><h2>Edit post</h2><textarea value={text} onChange={e=>setText(e.target.value)}/>{error&&<div className="auth-error">{error}</div>}<div className="modal-actions"><button className="ghost-btn" onClick={onClose}>Cancel</button><button className="primary-action" onClick={save}>Save changes</button></div></div></div>}
