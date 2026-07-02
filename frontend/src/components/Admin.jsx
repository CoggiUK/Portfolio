import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Lock, 
  Cpu, 
  Save, 
  LogOut, 
  Plus, 
  Trash2, 
  Globe, 
  TrendingUp, 
  Settings, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Trash,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { api } from '../api';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';


const Github = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Admin({ token, expiresAt, onLogout, onUpdateData }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', title: '', bio: '', email: '', phone: '', location: '', company: '', facebook: '', avatar: '', github: '', linkedin: '', behance: '' });
  const [projects, setProjects] = useState([]);
  
  // State for adding/editing project
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    subtitle: '',
    role: '',
    tech: '',
    efficiency: '',
    loadTime: '',
    roi: '',
    details: '',
    live: '',
    github: '',
    figma: ''
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Status banners
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [draggedGroupIdx, setDraggedGroupIdx] = useState(null);

  // Time remaining on token calculation
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Fetch initial admin config data from Firestore
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'settings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profile) setProfile(data.profile);
          if (data.projects) setProjects(data.projects);
        }
      } catch (err) {
        showError('Không thể tải dữ liệu từ Firestore.');
      }
    };

    fetchData();

    // Timer for Firebase session
    const updateTimer = () => {
      if (auth.currentUser) {
        setTimeRemaining(`Đăng nhập: ${auth.currentUser.email}`);
      } else {
        setTimeRemaining('Không hoạt động');
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 3000);
    return () => clearInterval(timerInterval);
  }, [onLogout]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'main');
      await setDoc(docRef, { profile }, { merge: true });
      
      showSuccess('Hồ sơ cá nhân đã được lưu thành công.');
      onUpdateData(); // Trigger app refetch
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Skills Save
  const handleSaveSkills = async (updatedSkillGroups) => {
    setLoading(true);
    try {
      const updatedProfile = {
        ...profile,
        skillGroups: updatedSkillGroups
      };
      
      const docRef = doc(db, 'settings', 'main');
      await setDoc(docRef, { profile: updatedProfile }, { merge: true });
      
      setProfile(updatedProfile);
      showSuccess('Danh sách kỹ năng đã cập nhật thành công.');
      onUpdateData(); // Trigger app refetch
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reorder skill groups
  const moveGroup = (idx, direction) => {
    const newGroups = [...(profile.skillGroups || [])];
    if (direction === 'up' && idx > 0) {
      const temp = newGroups[idx];
      newGroups[idx] = newGroups[idx - 1];
      newGroups[idx - 1] = temp;
    } else if (direction === 'down' && idx < newGroups.length - 1) {
      const temp = newGroups[idx];
      newGroups[idx] = newGroups[idx + 1];
      newGroups[idx + 1] = temp;
    }
    setProfile({ ...profile, skillGroups: newGroups });
  };

  // Reorder skill items within a group
  const moveSkill = (groupIdx, itemIdx, direction) => {
    const newGroups = [...(profile.skillGroups || [])];
    const items = [...(newGroups[groupIdx].items || [])];
    if (direction === 'left' && itemIdx > 0) {
      const temp = items[itemIdx];
      items[itemIdx] = items[itemIdx - 1];
      items[itemIdx - 1] = temp;
    } else if (direction === 'right' && itemIdx < items.length - 1) {
      const temp = items[itemIdx];
      items[itemIdx] = items[itemIdx + 1];
      items[itemIdx + 1] = temp;
    }
    newGroups[groupIdx] = { ...newGroups[groupIdx], items };
    setProfile({ ...profile, skillGroups: newGroups });
  };

  // Read an image file, center-crop to a square and downscale to 320px before
  // storing as a base64 data URL in profile.avatar (kept small for db.json).
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError('Vui lòng chọn một tệp ảnh hợp lệ.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 320;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProfile((p) => ({ ...p, avatar: dataUrl }));
        showSuccess('Đã tải ảnh lên. Nhấn "Lưu hồ sơ cá nhân" để cập nhật.');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Initials fallback when no avatar image is set
  const adminInitials = (profile.name || '').trim().split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase() || '✦';

  // Set project editor form from project object
  const selectProjectForEdit = (project) => {
    setSelectedProjectId(project.id);
    setProjectForm({
      title: project.title || '',
      subtitle: project.subtitle || '',
      role: project.role || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : '',
      efficiency: project.metrics?.efficiency || '',
      loadTime: project.metrics?.loadTime || '',
      roi: project.metrics?.roi || '',
      details: Array.isArray(project.details) ? project.details.join('\n') : '',
      live: project.links?.live || '',
      github: project.links?.github || '',
      figma: project.links?.figma || ''
    });
  };

  // Reset project form for new project creation
  const handleNewProject = () => {
    setSelectedProjectId('new');
    setProjectForm({
      title: '',
      subtitle: '',
      role: '',
      tech: '',
      efficiency: '',
      loadTime: '',
      roi: '',
      details: '',
      live: '',
      github: '',
      figma: ''
    });
  };

  // Save projects to backend
  const handleSaveProjects = async (updatedProjects) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'main');
      await setDoc(docRef, { projects: updatedProjects }, { merge: true });
      
      setProjects(updatedProjects);
      setSelectedProjectId(null);
      showSuccess('Danh sách dự án đã cập nhật thành công.');
      onUpdateData();
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit project form changes
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    
    const submittedProject = {
      id: selectedProjectId === 'new' ? `project-${Date.now()}` : selectedProjectId,
      title: projectForm.title,
      subtitle: projectForm.subtitle,
      role: projectForm.role,
      tech: projectForm.tech.split(',').map(s => s.trim()).filter(s => s !== ''),
      metrics: {
        efficiency: projectForm.efficiency,
        loadTime: projectForm.loadTime,
        roi: projectForm.roi
      },
      details: projectForm.details.split('\n').map(s => s.trim()).filter(s => s !== ''),
      links: {
        live: projectForm.live,
        github: projectForm.github,
        figma: projectForm.figma
      }
    };

    let updatedList;
    if (selectedProjectId === 'new') {
      updatedList = [...projects, submittedProject];
    } else {
      updatedList = projects.map(p => p.id === selectedProjectId ? submittedProject : p);
    }

    handleSaveProjects(updatedList);
  };

  // Delete project
  const handleDeleteProject = (projectId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      const updatedList = projects.filter(p => p.id !== projectId);
      handleSaveProjects(updatedList);
    }
  };

  // Password change submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error('Chưa đăng nhập hệ thống.');
      }
      const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordForm.currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      
      showSuccess('Mật khẩu đã được thay đổi thành công.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', position: 'relative', zIndex: 10, minHeight: '90vh' }}>
      {/* Top Banner and Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 className="glow-text-purple" style={{ fontSize: '2.2rem', textAlign: 'left' }}>Admin Control Panel</h1>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.95rem' }}>Quản lý dữ liệu Portfolio và xác thực chữ ký Token.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onLogout} className="btn-secondary" style={{ borderColor: '#f87171', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          padding: '16px',
          borderRadius: '12px',
          color: 'var(--primary-color)',
          marginBottom: '24px',
          fontSize: '0.95rem'
        }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '16px',
          borderRadius: '12px',
          color: '#f87171',
          marginBottom: '24px',
          fontSize: '0.95rem'
        }}>
          <AlertTriangle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Admin Console Layout Grid */}
      <div className="grid-2" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'start' }}>
        
        {/* SIDE BAR NAVIGATION */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => { setActiveTab('profile'); setSelectedProjectId(null); }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              border: activeTab === 'profile' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: activeTab === 'profile' ? 'rgba(0,255,136,0.05)' : 'none',
              color: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--text-main)'
            }}
          >
            <User size={16} /> Hồ sơ cá nhân
          </button>
          
          <button 
            onClick={() => { setActiveTab('projects'); }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              border: activeTab === 'projects' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: activeTab === 'projects' ? 'rgba(0,255,136,0.05)' : 'none',
              color: activeTab === 'projects' ? 'var(--primary-color)' : 'var(--text-main)'
            }}
          >
            <Briefcase size={16} /> Quản lý dự án
          </button>
          
          <button 
            onClick={() => { setActiveTab('skills'); setSelectedProjectId(null); }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              border: activeTab === 'skills' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: activeTab === 'skills' ? 'rgba(0,255,136,0.05)' : 'none',
              color: activeTab === 'skills' ? 'var(--primary-color)' : 'var(--text-main)'
            }}
          >
            <Cpu size={16} /> Quản lý kỹ năng
          </button>
          
          <button 
            onClick={() => { setActiveTab('security'); setSelectedProjectId(null); }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              border: activeTab === 'security' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: activeTab === 'security' ? 'rgba(0,255,136,0.05)' : 'none',
              color: activeTab === 'security' ? 'var(--primary-color)' : 'var(--text-main)'
            }}
          >
            <Lock size={16} /> Đổi mật khẩu
          </button>
          
          <button 
            onClick={() => { setActiveTab('jwt'); setSelectedProjectId(null); }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              border: activeTab === 'jwt' ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: activeTab === 'jwt' ? 'rgba(0,255,136,0.05)' : 'none',
              color: activeTab === 'jwt' ? 'var(--primary-color)' : 'var(--text-main)'
            }}
          >
            <Cpu size={16} /> Logs & Trạng thái JWT
          </button>

          {/* Session Expiry Indicator */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '16px',
            marginTop: '16px',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phiên đăng nhập JWT còn:</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cyan-accent)' }}>{timeRemaining}</p>
          </div>
        </div>

        {/* WORKSPACE DETAIL PANELS */}
        <div className="glass-card" style={{ padding: '32px', textAlign: 'left', position: 'relative' }}>
          <div className="spotlight" />

          {/* TAB 1: PROFILE FORM */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }} className="glow-text">Cấu hình hồ sơ cá nhân</h2>

              {/* Avatar uploader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'radial-gradient(circle at 30% 30%, #1a1a2e, #0c0c16)',
                    border: '2px solid rgba(255,255,255,0.12)',
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)'
                  }}>
                    {profile.avatar
                      ? <img src={profile.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : adminInitials}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Ảnh đại diện</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <label className="btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                      <Camera size={14} /> {profile.avatar ? 'Đổi ảnh' : 'Tải ảnh lên'}
                      <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    </label>
                    {profile.avatar && (
                      <button type="button" className="btn-secondary btn-sm" onClick={() => setProfile((p) => ({ ...p, avatar: '' }))}>
                        <Trash size={14} /> Xoá ảnh
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ảnh sẽ tự cắt vuông & nén về 320px. Nhớ nhấn "Lưu hồ sơ".</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Họ và tên</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Chức danh công việc</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Giới thiệu ngắn (Bio)</label>
                <textarea
                  rows="4"
                  className="glass-input"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Email liên hệ</label>
                  <input
                    type="email"
                    className="glass-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Số điện thoại</label>
                  <input
                    type="tel"
                    className="glass-input"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Facebook Link</label>
                  <input
                    type="url"
                    className="glass-input"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Khu vực / Địa điểm</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Công ty / Tổ chức hiện tại</label>
                <input
                  type="text"
                  className="glass-input"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn-neon" 
                style={{ width: 'fit-content', marginTop: '8px' }}
                disabled={loading}
              >
                <Save size={16} /> {loading ? 'Đang lưu...' : 'Lưu hồ sơ cá nhân'}
              </button>
            </form>
          )}

          {/* TAB 5: SKILLS MANAGEMENT */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem' }} className="glow-text">Quản lý nhóm kỹ năng</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Chỉnh sửa các nhóm kỹ năng và danh sách kỹ năng lẻ hiển thị trên trang Portfolio.
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    const currentGroups = profile.skillGroups || [];
                    const newGroups = [...currentGroups, { label: 'Nhóm kỹ năng mới', items: [] }];
                    setProfile({ ...profile, skillGroups: newGroups });
                  }} 
                  className="btn-neon" 
                  style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  <Plus size={16} /> Thêm nhóm mới
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {(profile.skillGroups || []).length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có nhóm kỹ năng nào. Hãy thêm nhóm mới.</p>
                ) : (
                  (profile.skillGroups || []).map((group, groupIdx) => {
                    return (
                      <div 
                        key={groupIdx} 
                        className="glass-card" 
                        draggable={true}
                        onDragStart={(e) => {
                          setDraggedGroupIdx(groupIdx);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedGroupIdx !== null && draggedGroupIdx !== groupIdx) {
                            const newGroups = [...(profile.skillGroups || [])];
                            const draggedGroup = newGroups[draggedGroupIdx];
                            newGroups.splice(draggedGroupIdx, 1);
                            newGroups.splice(groupIdx, 0, draggedGroup);
                            setProfile({ ...profile, skillGroups: newGroups });
                          }
                          setDraggedGroupIdx(null);
                        }}
                        onDragEnd={() => setDraggedGroupIdx(null)}
                        style={{ 
                          padding: '24px', 
                          border: draggedGroupIdx === groupIdx ? '1px dashed var(--primary-color)' : '1px solid rgba(255,255,255,0.05)', 
                          background: draggedGroupIdx === groupIdx ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.01)',
                          opacity: draggedGroupIdx === groupIdx ? 0.6 : 1,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          cursor: 'grab'
                        }}
                      >
                        {/* Group Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1 }}>
                            <GripVertical size={20} style={{ color: 'var(--text-muted)', cursor: 'grab', flexShrink: 0, marginTop: '22px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Tên nhóm kỹ năng</label>
                              <input
                                type="text"
                                className="glass-input"
                                value={group.label || ''}
                                onChange={(e) => {
                                  const newGroups = [...(profile.skillGroups || [])];
                                  newGroups[groupIdx] = { ...newGroups[groupIdx], label: e.target.value };
                                  setProfile({ ...profile, skillGroups: newGroups });
                                }}
                                placeholder="Ví dụ: UI/UX Design, Lập trình..."
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ 
                              marginTop: '22px', 
                              borderColor: 'rgba(239, 68, 68, 0.3)', 
                              color: '#f87171',
                              padding: '10px'
                            }}
                            onClick={() => {
                              const newGroups = (profile.skillGroups || []).filter((_, i) => i !== groupIdx);
                              setProfile({ ...profile, skillGroups: newGroups });
                            }}
                            title="Xóa nhóm kỹ năng này"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Skills Items (Pills Layout) */}
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            Danh sách kỹ năng
                          </label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {(group.items || []).length === 0 ? (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa có kỹ năng nào trong nhóm này.</span>
                            ) : (
                              (group.items || []).map((item, itemIdx) => (
                                <div 
                                  key={itemIdx}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    color: 'var(--secondary-color)',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500
                                  }}
                                >
                                  <button
                                    type="button"
                                    disabled={itemIdx === 0}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: itemIdx === 0 ? 'rgba(255,255,255,0.1)' : 'var(--text-muted)',
                                      cursor: itemIdx === 0 ? 'default' : 'pointer',
                                      padding: 0,
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                    onClick={() => moveSkill(groupIdx, itemIdx, 'left')}
                                    title="Di chuyển sang trái"
                                  >
                                    <ChevronLeft size={14} />
                                  </button>

                                  <span>{item}</span>

                                  <button
                                    type="button"
                                    disabled={itemIdx === group.items.length - 1}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: itemIdx === group.items.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--text-muted)',
                                      cursor: itemIdx === group.items.length - 1 ? 'default' : 'pointer',
                                      padding: 0,
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                    onClick={() => moveSkill(groupIdx, itemIdx, 'right')}
                                    title="Di chuyển sang phải"
                                  >
                                    <ChevronRight size={14} />
                                  </button>

                                  <button
                                    type="button"
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--text-muted)',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      marginLeft: '4px'
                                    }}
                                    onClick={() => {
                                      const newGroups = [...(profile.skillGroups || [])];
                                      const newItems = (newGroups[groupIdx].items || []).filter((_, i) => i !== itemIdx);
                                      newGroups[groupIdx] = { ...newGroups[groupIdx], items: newItems };
                                      setProfile({ ...profile, skillGroups: newGroups });
                                    }}
                                    title="Xóa kỹ năng này"
                                  >
                                    <Trash2 size={12} style={{ color: '#f87171' }} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Add Skill Item Input */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                            <input
                              type="text"
                              id={`new-skill-input-${groupIdx}`}
                              className="glass-input"
                              placeholder="Thêm kỹ năng mới (Ví dụ: Figma, Git, Claude...)"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = e.target.value.trim();
                                  if (!val) return;
                                  const newGroups = [...(profile.skillGroups || [])];
                                  const currentItems = newGroups[groupIdx].items || [];
                                  if (!currentItems.includes(val)) {
                                    newGroups[groupIdx] = { ...newGroups[groupIdx], items: [...currentItems, val] };
                                    setProfile({ ...profile, skillGroups: newGroups });
                                  }
                                  e.target.value = '';
                                }
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              const input = document.getElementById(`new-skill-input-${groupIdx}`);
                              const val = input ? input.value.trim() : '';
                              if (!val) return;
                              const newGroups = [...(profile.skillGroups || [])];
                              const currentItems = newGroups[groupIdx].items || [];
                              if (!currentItems.includes(val)) {
                                newGroups[groupIdx] = { ...newGroups[groupIdx], items: [...currentItems, val] };
                                setProfile({ ...profile, skillGroups: newGroups });
                              }
                              if (input) input.value = '';
                            }}
                            style={{ padding: '12px 16px' }}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn-neon"
                  onClick={() => handleSaveSkills(profile.skillGroups || [])}
                  disabled={loading}
                >
                  <Save size={16} /> {loading ? 'Đang lưu...' : 'Lưu thay đổi kỹ năng'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div>
              {selectedProjectId === null ? (
                // PROJECTS LIST TABLE VIEW
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.5rem' }} className="glow-text">Danh sách dự án đã tạo</h2>
                    <button onClick={handleNewProject} className="btn-neon" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                      <Plus size={16} /> Thêm dự án mới
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {projects.map((proj) => (
                      <div 
                        key={proj.id} 
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.01)',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{proj.title}</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{proj.subtitle}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Vai trò: {proj.role}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => selectProjectForEdit(proj)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Chỉnh sửa
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(proj.id)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: '#ef4444', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // PROJECT EDITOR FORM VIEW
                <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      type="button"
                      onClick={() => setSelectedProjectId(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer' }}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: '1.5rem' }} className="glow-text">
                      {selectedProjectId === 'new' ? 'Thêm dự án mới' : 'Chỉnh sửa dự án'}
                    </h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Tên dự án</label>
                      <input
                        type="text"
                        className="glass-input"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Vai trò của bạn</label>
                      <input
                        type="text"
                        className="glass-input"
                        value={projectForm.role}
                        onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                        placeholder="Ví dụ: Product Designer & Developer"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Mô tả ngắn/Phụ đề</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={projectForm.subtitle}
                      onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Công nghệ (phân cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={projectForm.tech}
                      onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      placeholder="Figma, Node.js, AI, BigQuery"
                      required
                    />
                  </div>

                  {/* METRICS CONFIG */}
                  <div style={{
                    background: 'rgba(255,255,255,0.01)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary-color)' }}>Chỉ số đo lường hiệu suất (Metrics)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Chỉ số Tăng trưởng (Lục)</label>
                        <input
                          type="text"
                          className="glass-input"
                          value={projectForm.efficiency}
                          onChange={(e) => setProjectForm({ ...projectForm, efficiency: e.target.value })}
                          placeholder="Ví dụ: +40% Conversion"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Chỉ số Tốc độ (Lam)</label>
                        <input
                          type="text"
                          className="glass-input"
                          value={projectForm.loadTime}
                          onChange={(e) => setProjectForm({ ...projectForm, loadTime: e.target.value })}
                          placeholder="Ví dụ: -1.2s Load Time"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Chỉ số Tài chính/Chuyển đổi (Tím)</label>
                        <input
                          type="text"
                          className="glass-input"
                          value={projectForm.roi}
                          onChange={(e) => setProjectForm({ ...projectForm, roi: e.target.value })}
                          placeholder="Ví dụ: +25% ROI"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Chi tiết triển khai (Mỗi dòng một ý)</label>
                    <textarea
                      rows="5"
                      className="glass-input"
                      value={projectForm.details}
                      onChange={(e) => setProjectForm({ ...projectForm, details: e.target.value })}
                      placeholder="Thiết kế UX/UI cho Dashboard...&#10;Tích hợp API quảng cáo...&#10;Phân tích phễu chuyển đổi..."
                      required
                    />
                  </div>

                  {/* PROJECT LINKS */}
                  <div style={{
                    background: 'rgba(255,255,255,0.01)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--cyan-accent)' }}>Liên kết dự án (Links)</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Live Demo URL</label>
                        <input
                          type="url"
                          className="glass-input"
                          value={projectForm.live}
                          onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>GitHub Repo URL</label>
                        <input
                          type="url"
                          className="glass-input"
                          value={projectForm.github}
                          onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>Figma Preview URL</label>
                        <input
                          type="url"
                          className="glass-input"
                          value={projectForm.figma}
                          onChange={(e) => setProjectForm({ ...projectForm, figma: e.target.value })}
                          placeholder="https://figma.com/file/..."
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn-neon" disabled={loading}>
                      <Save size={16} /> {loading ? 'Đang lưu...' : 'Lưu dự án'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSelectedProjectId(null)}
                      className="btn-secondary"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }} className="glow-text">Thay đổi mật khẩu quản trị</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  className="glass-input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Mật khẩu mới</label>
                <input
                  type="password"
                  className="glass-input"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-sub)' }}>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  className="glass-input"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-neon" 
                style={{ width: 'fit-content', marginTop: '8px', background: 'var(--secondary-color)', borderColor: 'var(--secondary-color)', color: '#fff' }}
                disabled={loading}
              >
                <Lock size={16} /> {loading ? 'Đang đổi mật khẩu...' : 'Xác nhận Đổi mật khẩu'}
              </button>
            </form>
          )}

          {/* TAB 4: JWT LOGS & DIAGNOSTICS */}
          {activeTab === 'jwt' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }} className="glow-text">Trạng thái Xác thực JWT</h2>
                <p style={{ color: 'var(--text-sub)' }}>Đặc tả Token bảo mật đang hoạt động trong phiên làm việc.</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Thuật toán ký khóa</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>HMAC SHA256</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Thời gian tồn tại của Token</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)' }}>2 giờ (7200 giây)</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trạng thái Token</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--cyan-accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> Verified Active
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-sub)' }}>JSON Web Token hiện tại (Bearer Header)</p>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-sub)',
                  wordBreak: 'break-all',
                  userSelect: 'all'
                }}>
                  {token}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-sub)' }}>Giải mã Header & Payload (Decoded JWT)</p>
                <pre style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--primary-color)',
                  overflowX: 'auto'
                }}>
{JSON.stringify({
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    username: "designer_admin",
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(expiresAt / 1000)
  }
}, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
