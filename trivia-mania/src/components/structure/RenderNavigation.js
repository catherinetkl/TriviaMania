import { Link, Route, Routes, useLocation } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { nav } from "./navigation";
import logoLong from "../../assets/logoLong.png";
import styles from "./RenderNavigation.module.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

export const RenderRoutes = () => {
  const { user } = AuthData();

  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && user.isAuthenticated) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return null;
      })}
    </Routes>
  );
};

export const RenderMenu = () => {
  const [navIsExpanded, setNavIsExpanded] = useState(false);
  const { user } = AuthData();

    // Check if the current page is the homepage ("/")
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const MenuItem = ({ r }) => {
    return (
      <li className={styles.menuItem} onClick={() => setNavIsExpanded(false)}>
        <Link to={r.path} >{r.name}</Link>
      </li>
    );
  };

  const hasRegisterLink = nav.some((r) => r.path === "/register");


  // handle onclick outside of menu > close menu

  const ref = useRef();
  useEffect(() => {
    const handler = (event) => {
      if (navIsExpanded &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setNavIsExpanded(false);
      }

    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [navIsExpanded]);


  return (
    <nav ref={ ref }>
      {/* Mobile Burger Menu */}
      {/* icon from heroicons.com */}
      <button
        className={styles.hamburger}
        onClick={() => {
          setNavIsExpanded((prev) => !prev);
        }}
      >
        {navIsExpanded ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>)  : (<svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
             >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
          />
          </svg>)
        }

      </button>

      <div
        className={styles.logo}
        style={{ display: isHomepage ? "none" : "block" }}
      >
        <Link to="/">
          <img src={logoLong} alt="Trivia Mania Logo" />
        </Link>
      </div>

      <ul className={navIsExpanded ? styles.expanded : ""}>
        <div className={styles.navbar_left}>
          {nav.map((r, i) => {
            if (
              !r.isPrivate &&
              r.isMenu
              // || (r.path === "/register" && !user.isAuthenticated)
            ) {
              return <MenuItem key={i} r={r} />;
            } else if (user.isAuthenticated && r.isMenu) {
              return <MenuItem key={i} r={r} />;
            } else return null;
          })}
        </div>

        
          {user.isAuthenticated ? (
            <li className={styles.menuItem} onClick={() => setNavIsExpanded(false)}>
              <Link to="/account">My Account</Link>
            </li>
          ) : (
            <div className={styles.navbar_right}>
              <li className={styles.menuItem} onClick={() => setNavIsExpanded(false)}>
                <Link to="/login">Login</Link>
              </li>
              <span>&nbsp;|&nbsp;</span>
              <li className={styles.menuItem} onClick={() => setNavIsExpanded(false)}>
                <Link to="/register">Sign Up</Link>
              </li>
            </div>
          )}

          {!user.isAuthenticated && !hasRegisterLink && (
            <li className={styles.menuItem} onClick={() => setNavIsExpanded(false)}>
              <Link to="/register"> Register</Link>
            </li>
          )}
        
      </ul>
    </nav>
  );
};
