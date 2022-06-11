import React from "react";

import DefaultBackgroundCard from "molecules/Cards/BackgroundCards/DefaultBackgroundCard";

// Images
import Bg404Image from "assets/images/fanbies/404.png";

function NoMatch() {
  return (
    <DefaultBackgroundCard
      image={Bg404Image}
      action={{
        type: "internal",
        route: "/",
        label: "back to home",
      }}
    />
  );
}

export default NoMatch;
