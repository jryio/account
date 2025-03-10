import React, { useState } from "react";
import HamburgerMenu from "react-hamburger-menu";
import "./Nav.css";
import { Link } from "react-router-dom";

function Nav(props) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  function makeLink(k, i) {
    return (
      <div className="navEl" key={i}>
        <Link
          to={"/" + k}
          onClick={() => {
            setHamburgerOpen(false);
          }}
          className="navEl"
        >
          {k}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="burger">
        <HamburgerMenu
          isOpen={hamburgerOpen}
          menuClicked={() => setHamburgerOpen(hamburgerOpen ? false : true)}
          width={30}
          height={25}
          strokeWidth={4}
          borderRadius={2}
          rotate={0}
          animationDuration={0.2}
          className="burgerComponent"
          color="slategray"
        />
      </div>
      <div id="nav" key="nav" className={"hamburger-" + hamburgerOpen}>
        <div id="inner-nav">{[Object.keys(props.textVars).map(makeLink)]}</div>
      </div>
    </>
  );
}

export default Nav;
