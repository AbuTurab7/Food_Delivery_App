import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import "./signInCanvas.css";
import { serverURL } from "./Home";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebaseAuth";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Utilities/authSlice";

export default function SignInCanvas({ show, handleClose }) {
  const [login, setLogin] = useState(true); //true
  const [googleSignIn, setGoogleSignIn] = useState(false); //false
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("user");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [error, setError] = useState(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(""); //""

  const userData = useSelector((state) => state.authSlice.userData);

  const dispatch = useDispatch();

  const resetFields = () => {
    setFullname("");
    setEmail("");
    setPassword("");
    setMobile("");
    setRole("user");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordMode("");
    setError(null);
  };


  const validateMobile = () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!login && !validateMobile()) return;
    // setMessage(null);

    try {
      const url = login
        ? `${serverURL}/api/auth/login`
        : `${serverURL}/api/auth/registration`;
      const body = login
        ? { email, password }
        : { fullname, email, password, mobile, role };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      dispatch(addUser(data.user));

      toast.success(data.message);
      handleClose();
      resetFields();
    } catch (err) {
      console.error(`Error during ${login ? "Login" : "Registration"}:`, err);
      setError(`There's a issue in ${login ? "Login" : "Sing up"}`);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setOtp("");
    try {
      const res = await fetch(`${serverURL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      toast.success(data.message);
      setForgotPasswordMode(2);
    } catch (error) {
      console.error(`Error in sending OTP : `, error);
      setError("There's a issue in sending OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${serverURL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      toast.success(data.message);
      setForgotPasswordMode(3);
    } catch (error) {
      console.error(`Error in OTP verification : `, error);
      setError("There's a issue in OTP verification");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${serverURL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      toast.success(data.message);
      resetFields();
    } catch (error) {
      console.error(`Error in resetting password : `, error);
      setError("There's a issue in resetting password");
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isGoogleLogin && !validateMobile()) return;

    try {
      const result = await signInWithPopup(auth, provider);
      if (!result) setError("Google server error");

      const res = await fetch(`${serverURL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: result.user.displayName,
          email: result.user.email,
          mobile: mobile || "",
          role: role || "user",
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      dispatch(addUser(data.user));
      toast.success(data.message);
      resetFields();
      handleClose();
    } catch (error) {
      console.error("Google sign-in error:", error.code, error.message);
      setError("There's a issue in Google Server");
    }
  };

  const getTitle = () => {
    if (googleSignIn) return "Google Sign Up";

    switch (forgotPasswordMode) {
      case 1:
        return "Forget Password";
      case 2:
        return "Verify OTP";
      case 3:
        return "Reset Password";
      default:
        return login ? "Login" : "Sign Up";
    }
  };

  const getInputs = () => {
    switch (forgotPasswordMode) {
      case 1:
        return (
          <>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
            <button className="signIn-button" onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        );
      case 2:
        return (
          <>
            <input
              type="text"
              name="otp"
              value={otp}
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
              autoComplete="off"
            />
            <p className="resend-btn" onClick={handleSendOtp}>
              Resend ?
            </p>
            <button className="signIn-button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        );
      default:
        return (
          <>
            <div className="password-input-container">
              <input
                type={showPass ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="off"
              />
              {newPassword.length > 0 && checkShowPass()}
            </div>
            <div className="password-input-container">
              <input
                type={showPass ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="off"
              />
              {confirmPassword.length > 0 && checkShowPass()}
            </div>
            <button className="signIn-button" onClick={handleResetPassword}>
              Reset password
            </button>
          </>
        );
    }
  };

  const checkShowPass = () => {
    return showPass ? (
      <FaEye id="eye" onClick={() => setShowPass(false)} />
    ) : (
      <FaEyeSlash id="eye" onClick={() => setShowPass(true)} />
    );
  };

  return (
    <Offcanvas
      show={show}
      onHide={() => {
        resetFields();
        handleClose();
      }}
      className="custom-offcanvas signIn-offcanvas"
      placement="end"
    >
      <Offcanvas.Header closeButton></Offcanvas.Header>
      <Offcanvas.Body>
        <div className="offCanvas-main-container">
          <div className="header-container">
            <div className="details">
              <p style={{ color: "#02060C", fontSize: "30px" }}>{getTitle()}</p>
              <p>
                or{" "}
                <span
                  style={{
                    color: "#FF5200",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setLogin(!login);
                    setGoogleSignIn(false);
                    resetFields();
                  }}
                >
                  {login ? "create an account" : "login to your account"}
                </span>
              </p>
            </div>
            <div className="signIn-img">
              <img
                height="100px"
                width="100px"
                style={{ borderRadius: "50%" }}
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/Image-login_btpq7r"
                alt=""
              />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {/* {message && <p className="success-msg">{message}</p>} */}

          <div className="form-container">
            {!login && !googleSignIn && (
              <input
                type="text"
                name="fullname"
                value={fullname}
                placeholder="Name"
                onChange={(e) => setFullname(e.target.value)}
                required
                autoComplete="off"
              />
            )}
            {forgotPasswordMode === "" && !googleSignIn && (
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
            )}

            {!forgotPasswordMode && !googleSignIn && (
              <div className="password-input-container">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
                {password.length > 0 && checkShowPass()}
              </div>
            )}

            {!login && (
              <input
                type="text"
                name="mobile"
                value={mobile}
                placeholder="Mobile number"
                onChange={(e) => setMobile(e.target.value)}
                required
                autoComplete="off"
              />
            )}

            {login && !forgotPasswordMode && (
              <p
                className="resend-btn"
                onClick={() => {
                  setForgotPasswordMode(1);
                  setError(null);
                }}
              >
                Forgot Password ?
              </p>
            )}

            {!login && !forgotPasswordMode && (
              <div className="select-container">
                <select
                  name="role"
                  id="role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="deliveryBoy">Delivery Boy</option>
                </select>
              </div>
            )}

            {!forgotPasswordMode && !googleSignIn ? (
              <button onClick={handleSubmit} className="signIn-button">
                {login ? "Login" : "Sign Up"}
              </button>
            ) : (
              !forgotPasswordMode && (
                <button className="signIn-button" onClick={handleGoogleAuth}>
                  Sign up with google
                </button>
              )
            )}

            {!forgotPasswordMode && !googleSignIn && login && (
              <button
                className="google-btn"
                onClick={(e) => {
                  setIsGoogleLogin(true);
                  handleGoogleAuth(e);
                }}
              >
                <FcGoogle id="googleLogo" /> Log in with google
              </button>
            )}

            {!forgotPasswordMode && !login && !googleSignIn && (
              <button
                onClick={() => setGoogleSignIn(true)}
                className="google-btn"
              >
                <FcGoogle id="googleLogo" />
                Sign up with google
              </button>
            )}

            {forgotPasswordMode && getInputs()}

            {forgotPasswordMode === 1 ? (
              <p style={{ color: "#02060C", fontSize: "12px" }}>
                An OTP will be send to your email account.
              </p>
            ) : (
              !forgotPasswordMode && (
                <p style={{ color: "#02060C", fontSize: "12px" }}>
                  By {login ? "clicking on Login" : "creating an account"}, I
                  accept the Terms & Conditions & Privacy Policy
                </p>
              )
            )}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
