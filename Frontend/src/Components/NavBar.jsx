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
import LocationOffcanvas from "./LocationOffcanvas";
import { Outlet, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Popover from "react-bootstrap/Popover";
import { useState, useEffect, useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Offcanvas from "react-bootstrap/Offcanvas";
import { SiSwiggy } from "react-icons/si";
import { CiSearch } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import toast from "react-hot-toast";

import "./offCanvas.css";
import "./navbar.css";
import { Coordinates } from "./ContextApi";
import SignInCanvas from "./SignInCanvas";

export default function NavBar() {
  const cart = useSelector((state) => state.cartSlice.cartItems);
  const userData = useSelector((state) => state.authSlice.userData);

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

  const [user, setUser] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  async function handleAuth() {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Sign In succesfully");
      const userName = result?.user?.displayName;
      dispatch(addUser(userName));
    } catch (error) {
      console.error("Google sign-in error:", error.code, error.message);
      alert("Login failed: " + error.message);
    }
  }

  async function handleLogOut() {
    try {
      await signOut(auth);
      dispatch(removeUser());
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  // const popover = (
  //   <Popover id="popover-basic">
  //     <Popover.Header as="h3"></Popover.Header>
  //     <Popover.Body>
  //       <button id="logOutBtn" onClick={handleLogOut}>
  //         Log out
  //       </button>
  //     </Popover.Body>
  //   </Popover>
  // );

  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container className="navbarContainer">
          {/* Left side: Logo + Address */}
          <div className="logo-drop-container">
            <Navbar.Brand href="/">
              <div className="logo-container">
                <SiSwiggy />
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
                    <p>Swiggy Corporate</p>
                  </div>
                </Nav.Link>
                <Nav.Link href="*">
                  <div className="search-container">
                    <CiSearch />
                    <p>Search</p>
                  </div>
                </Nav.Link>
                <Nav.Link href="*">
                  <div className="offer-container">
                    <TbCircleDashedPercentage />
                    <p>Offers</p>
                  </div>
                </Nav.Link>
                <Nav.Link href="*">
                  <div className="help-container">
                    <IoHelpBuoyOutline />
                    <p>Help</p>
                  </div>
                </Nav.Link>
                <Nav.Link>
                  <div className="sign-in-container" onClick={handleShowSignIn}>
                    <IoHelpBuoyOutline />
                    <p>Sign in</p>
                  </div>
                </Nav.Link>
                <SignInCanvas
              show={showSignIn}
              handleClose={handleCloseSignIn}
            />
                {/* {user ? (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={popover}
                  >
                    <Nav.Link>
                      <div className="sign-in-container">
                        <IoPersonOutline />
                        <p>{user}</p>
                      </div>
                    </Nav.Link>
                  </OverlayTrigger>
                ) : (
                  <Nav.Link onClick={handleAuth}>
                    <div className="sign-in-container">
                      <IoPersonOutline />
                      <p>Sign In</p>
                    </div>
                  </Nav.Link>
                )} */}
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

      {/* ---- OFFCANVAS (Hamburger Menu for Mobile) ---- */}
      <Offcanvas show={showMenu} onHide={handleMenuClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="*">
              <IoBagOutline /> Swiggy Corporate
            </Nav.Link>
            <Nav.Link href="*">
              <CiSearch /> Search
            </Nav.Link>
            <Nav.Link href="*">
              <TbCircleDashedPercentage /> Offers
            </Nav.Link>
            <Nav.Link href="*">
              <IoHelpBuoyOutline /> Help
            </Nav.Link>
            <Nav.Link>
                  <div className="sign-in-container" onClick={handleShowSignIn}>
                    <IoHelpBuoyOutline />
                    <p>Sign in</p>
                  </div>
                </Nav.Link>
                {/* <SignInCanvas
              show={showSignIn}
              handleClose={handleCloseSignIn}
            /> */}
            {/* ✅ Sign In / User */}
            {/* {user ? (
              <Nav.Link onClick={handleLogOut}>
                <IoPersonOutline /> {user} (Logout)
              </Nav.Link>
            ) : (
              <Nav.Link onClick={handleAuth}>
                <IoPersonOutline /> Sign In
              </Nav.Link>
            )} */}

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
