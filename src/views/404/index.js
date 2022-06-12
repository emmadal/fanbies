import React from "react";

import DefaultBackgroundCard from "molecules/Cards/BackgroundCards/DefaultBackgroundCard";
import DefaultNavbar from "molecules/Navbars/DefaultNavbar";

// Images
import Bg404Image from "assets/images/fanbies/404.png";

function NoMatch() {
  return (
    <>
      <DefaultNavbar routes={[]} sticky transparent light />
      <DefaultBackgroundCard
        image={Bg404Image}
        action={{
          type: "internal",
          route: "/",
          label: "back to fanbies",
        }}
      />
    </>
  );
}

export default NoMatch;
