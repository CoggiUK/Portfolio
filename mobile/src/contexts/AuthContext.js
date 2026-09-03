import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut,
  sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider,
} from '@firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

const MESSAGES = {
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/user-not-found': 'Không tìm thấy tài khoản này.',
  'auth/wrong-password': 'Mật khẩu không đúng.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/too-many-requests': 'Sai quá nhiều lần. Thử lại sau ít phút.',
  'auth/network-request-failed': 'Mất kết nối mạng.',
  'auth/weak-password': 'Mật khẩu mới cần tối thiểu 6 ký tự.',
  'auth/requires-recent-login': 'Vui lòng đăng nhập lại rồi đổi mật khẩu.',
};

export const authMessage = (err) => MESSAGES[err?.code] || err?.message || 'Đã có lỗi xảy ra.';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setInitializing(false);
      }),
    []
  );

  const signIn = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return cred.user;
  }, []);

  const signOut = useCallback(() => fbSignOut(auth), []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email.trim()), []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const u = auth.currentUser;
    if (!u?.email) throw new Error('Chưa đăng nhập.');
    await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, currentPassword));
    await updatePassword(u, newPassword);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, uid: user?.uid || null, initializing, signIn, signOut, resetPassword, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải nằm trong <AuthProvider>');
  return ctx;
};
