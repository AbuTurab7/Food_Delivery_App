import {
  IoBagOutline,
  IoHelpBuoyOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { addUser, removeUser } from "../Utilities/authSlice";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { auth, provider } from "../config/firebaseAuth";
import { TbCircleDashedPercentage } from "react-icons/tb";
import { signInWithPopup, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import NavDropdown from "react-bootstrap/NavDropdown";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import LocationOffcanvas from "./LocationOffcanvas";
import { Outlet, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Popover from "react-bootstrap/Popover";
import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import toast from "react-hot-toast";
import { SiQuicktime } from "react-icons/si";

import "./offCanvas.css";
import "./navbar.css";
import SignInCanvas from "./SignInCanvas";
import { serverURL } from "./Home";

export default function NavBar() {
  const cart = useSelector((state) => state.cartSlice.cartItems);
  const userData = useSelector((state) => state.authSlice.userData);
  // console.log(userData);

  const [address, setAddress] = useState("Lucknow, Uttar Pradesh 4800");

  /*  State for LocationOffcanvas */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddress = (data) => setAddress(data);

  /*  State for SignIncanvas */
  const [showSignIn, setShowSignIn] = useState(false);
  const handleCloseSignIn = () => setShowSignIn(false);
  const handleShowSignIn = () => setShowSignIn(true);

  /*  State for Hamburger Offcanvas */
  const [showMenu, setShowMenu] = useState(false);
  const handleMenuClose = () => setShowMenu(false);
  const handleMenuShow = () => setShowMenu(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogOut() {
    try {
      await signOut(auth);

      const res = await fetch(`${serverURL}/api/auth/logout`, {
        credentials: "include",
      });
      const data = await res.json();
      dispatch(removeUser());
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3"></Popover.Header>
      <Popover.Body>
        <button id="logOutBtn" onClick={handleLogOut}>
          Log out
        </button>
      </Popover.Body>
    </Popover>
  );

  if (userData?.role === "owner" || userData?.role === "deliveryBoy") {
    return (
      <>
        <div className="ownerNavbar-main-container">
          <Navbar.Brand href="/">
            <div className="logo-container">
              <SiQuicktime />
            </div>
          </Navbar.Brand>
          <div className="navLinks-container">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover}
            >
              <Nav.Link>
                <div className="sign-in-container">
                  <IoPersonOutline style={{ fontSize: "22px" }} />
                  <p style={{ fontSize: "16px" }}>{userData?.fullname}</p>
                </div>
              </Nav.Link>
            </OverlayTrigger>
          </div>
        </div>

        <Outlet />
      </>
    );
  }

  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container className="navbarContainer">
          <div className="logo-drop-container">
            <Navbar.Brand href="/">
              <div className="logo-container">
                <SiQuicktime />
              </div>
            </Navbar.Brand>

            <NavDropdown
              onClick={handleShow}
              title={
                <div className="navbar-address-container">
                  <p
                    id="navbar-other"
                    style={{ fontSize: "14px", textDecoration: "underline" }}
                  >
                    Other
                  </p>
                  <p id="navbar-address">{address.substring(0, 31)}...</p>
                  <RiArrowDropDownLine id="arrow" />
                </div>
              }
              id="dropdown-split-basic"
            ></NavDropdown>
            <LocationOffcanvas
              show={show}
              handleClose={handleClose}
              handleAddress={handleAddress}
            />
          </div>

          {/* ---- MOBILE HAMBURGER ---- */}
          <div className="hamburger-container d-lg-none">
            <GiHamburgerMenu onClick={handleMenuShow} />
          </div>

          {/* Desktop Navbar Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="navLink-container">
              <Nav className="me-auto">
                <Nav.Link href="*">
                  <div className="corporate-container">
                    <IoBagOutline />
                    <p>QuickBite</p>
                  </div>
                </Nav.Link>
                <Nav.Link href="*">
                  <div className="search-container">
                    <CiSearch />
                    <p>Search</p>
                  </div>
                </Nav.Link>
                <Nav.Link href="/my-orders">
                  <div className="offer-container">
                    <IoBagCheckOutline />
                    <p>My Orders</p>
                  </div>
                </Nav.Link>
                <Nav.Link href="*">
                  <div className="help-container">
                    <IoHelpBuoyOutline />
                    <p>Help</p>
                  </div>
                </Nav.Link>
                {userData ? (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={popover}
                  >
                    <Nav.Link>
                      <div className="sign-in-container">
                        <IoPersonOutline />
                        <p>{userData?.fullname}</p>
                      </div>
                    </Nav.Link>
                  </OverlayTrigger>
                ) : (
                  <>
                    <Nav.Link>
                      <div
                        className="sign-in-container"
                        onClick={handleShowSignIn}
                      >
                        <IoPersonOutline />
                        <p>Sign in</p>
                      </div>
                    </Nav.Link>
                    <SignInCanvas
                      show={showSignIn}
                      handleClose={handleCloseSignIn}
                    />
                  </>
                )}
                <Nav.Link href="/restaurant/cart">
                  <div className="cart-container">
                    <p>[{cart.length}] Cart</p>
                  </div>
                </Nav.Link>
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* OFFCANVAS (Hamburger Menu for Mobile) */}
      <Offcanvas show={showMenu} onHide={handleMenuClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="*">
              <IoBagOutline /> QuickBite
            </Nav.Link>
            <Nav.Link href="*">
              <CiSearch /> Search
            </Nav.Link>
            <Nav.Link href="/my-orders">
              <IoBagCheckOutline />
              <p>My Orders</p>
            </Nav.Link>
            <Nav.Link href="*">
              <IoHelpBuoyOutline /> Help
            </Nav.Link>

            {userData ? (
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popover}
              >
                <Nav.Link>
                  <IoPersonOutline /> {userData?.fullname}
                </Nav.Link>
              </OverlayTrigger>
            ) : (
              <>
                <Nav.Link onClick={handleShowSignIn}>
                  <IoPersonOutline /> Sign In
                </Nav.Link>
                <SignInCanvas
                  show={showSignIn}
                  handleClose={handleCloseSignIn}
                />
              </>
            )}

            {/* ✅ Cart */}
            <Nav.Link href="/restaurant/cart">
              <IoBagOutline /> Cart [{cart.length}]
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <Outlet />
    </>
  );
}
