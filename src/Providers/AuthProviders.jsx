// src/Contexts/AuthProviders.jsx
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { app } from "../Firebase/firebase.config";
import API_BASE_URL from "../config/apiBase";

// Create Context
export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const blockedAlertShownRef = useRef(false);

  const forceLogoutIfBlocked = useCallback(async (showAlert = false) => {
    if (showAlert && !blockedAlertShownRef.current) {
      blockedAlertShownRef.current = true;
      toast.error("Your account is blocked. Please contact support.");
    }

    try {
      await signOut(auth);
      await axios.get(`${API_BASE_URL}/logout`, {
        withCredentials: true,
      });
    } catch (logoutErr) {
      console.log("Forced logout error ->", logoutErr);
    } finally {
      setUser(null);
    }
  }, []);

  /* =====================
     AUTH FUNCTIONS
  ===================== */

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update Firebase profile (name & photo)
  const updateUserProfile = (name, photoURL = null) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL,
    });
  };

  /* =====================
     PASSWORD RESET (email link)
  ===================== */
  const resetPasswordByEmail = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  /* =====================
     CHANGE PASSWORD (while logged in)
  ===================== */
  const changeUserPassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser?.email) {
      throw new Error("No logged-in user found");
    }

    // Create credential using email + current password
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    // Re-authenticate (Firebase security rule)
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update password
    return updatePassword(auth.currentUser, newPassword);
  };

  /* =====================
     AUTH STATE OBSERVER
  ===================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const fetchJWT = async () => {
        try {
          if (currentUser?.email) {
            await axios.post(
              `${API_BASE_URL}/jwt`,
              { email: currentUser.email },
              { withCredentials: true }
            );
            setUser(currentUser);
            blockedAlertShownRef.current = false;
          } else {
            setUser(null);
            blockedAlertShownRef.current = false;

            await axios.get(`${API_BASE_URL}/logout`, {
              withCredentials: true,
            });
          }
        } catch (err) {
          const status = err?.response?.status;
          console.log("JWT auth error ->", err?.response || err);

          // Blocked user: force immediate logout from Firebase + backend cookie
          if (status === 403) {
            await forceLogoutIfBlocked(true);
          } else {
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchJWT();
    });

    return () => unsubscribe();
  }, [forceLogoutIfBlocked]);

  // Live block-check: auto logout if user gets blocked while already logged in.
  useEffect(() => {
    if (!user?.email) return;

    const intervalId = setInterval(async () => {
      try {
        await axios.get(`${API_BASE_URL}/users/role/${user.email}`, {
          withCredentials: true,
        });
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          await forceLogoutIfBlocked(status === 403);
        }
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user?.email, forceLogoutIfBlocked]);

  /* =====================
     CONTEXT VALUE
  ===================== */
  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
    resetPasswordByEmail,
    changeUserPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProviders;
