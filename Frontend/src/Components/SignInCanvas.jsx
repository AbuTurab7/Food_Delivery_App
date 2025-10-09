import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import "./signInCanvas.css";
import { serverURL } from "./Home";
import toast from "react-hot-toast";

export default function SignInCanvas({ show, handleClose }) {
  const [login, setLogin] = useState(true); //true
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  // const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(""); //""

  const resetFields = () => {
    setFullname("");
    setEmail("");
    setPassword("");
    setMobile("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordMode("");
    setError(null);
  };

  // const handleError = (data) => {
  //   if (data.errors) {
  //     const firstError = Object.values(data.errors)[0];
  //     setError(firstError);
  //   } else if (data.message) {
  //     setError(data.message);
  //   } else {
  //     setError("Something went wrong!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // setMessage(null);

    try {
      const url = login
        ? `${serverURL}/api/auth/login`
        : `${serverURL}/api/auth/registration`;
      const body = login
        ? { email, password }
        : { fullname, email, password, mobile };

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
      // if (!res.ok) return handleError(data);
      // setMessage(login ? "Login successful!" : "Registration successful!");
      // setMessage(data.message);

      toast.success(data.message);
      handleClose();
      resetFields();
    } catch (err) {
      console.error(`Error during ${login ? "Login" : "Registration"}:`, err);
      alert("Something went wrong!");
    }
  };

  const handleVerifyOtp = async () => {
    console.log("Otp verified succesfully");
  };
  const handleResetPassword = async () => {
    console.log("Reset password succesfully");
  };

  const getTitle = () => {
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
            />
            <button
              className="signIn-button"
              onClick={() => {
                setForgotPasswordMode(2);
                handleSendOtp();
              }}
            >
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
            />
            <button
              className="signIn-button"
              onClick={() => {
                setForgotPasswordMode(3);
                handleVerifyOtp();
              }}
            >
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
              />
              {confirmPassword.length > 0 && checkShowPass()}
            </div>
            <button
              className="signIn-button"
              onClick={() => {
                setForgotPasswordMode("");
                handleResetPassword();
              }}
            >
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
              <p style={{ color: "#02060C", fontSize: "30px" }}>
                {login
                  ? forgotPasswordMode === 1
                    ? "Forget Password"
                    : forgotPasswordMode === 2
                    ? "Verify OTP"
                    : forgotPasswordMode === 3
                    ? "Reset Password"
                    : "Login"
                  : "Sign Up"}
              </p>

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
            {!login && (
              <input
                type="text"
                name="fullname"
                value={fullname}
                placeholder="Name"
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            )}
            {forgotPasswordMode === "" && (
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            {!forgotPasswordMode && (
              <div className="password-input-container">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              />
            )}

            {login && !forgotPasswordMode && (
              <p
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#FF5200",
                  cursor: "pointer",
                  margin: "5px 0",
                }}
                onClick={() => {
                  setForgotPasswordMode(1);
                  setError(null);
                }}
              >
                Forgot Password?
              </p>
            )}

            {!forgotPasswordMode && (
              <button onClick={handleSubmit} className="signIn-button">
                {login ? "Login" : "Sign Up"}
              </button>
            )}

            {forgotPasswordMode && getTitle()}

            {!forgotPasswordMode && (
              <p style={{ color: "#02060C", fontSize: "12px" }}>
                By {login ? "clicking on Login" : "creating an account"}, I
                accept the Terms & Conditions & Privacy Policy
              </p>
            )}
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
