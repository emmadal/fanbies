import React from "react";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";

const userItem = ({ classData, imgClass, userData }) => {
  const itemList = userData.map((item, i) => {
    return (
      <GridContainer
        className="p-a-lg dark-color"
        justify="space-evenly"
        key={`${item.username}-${i}`}
      >
        <GridItem xs={12} sm={12} md={8} className="pos-static m-b-md">
          <h4
            className={`${
              classData.cardTitle
            } dark-color font-size-xl d-inline-block`}
          >
            Featured
            <span className="icon-stack">
              <i className={"icon-stack-1x fas fa-check"} />
              <i className={"icon-stack-2x fas fa-certificate"} />
            </span>
          </h4>
          <p className="font-size-lg">{item.name}</p>
          <p>{item.bio}</p>
          <Button
            size="lg"
            color="rose"
            onClick={() => window.location.replace(`/user/${item.username}`)}
          >
            <span className="text-capital">View {item.name} Page</span>
          </Button>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <img
            src={item.picture}
            alt={item.username}
            className={`${imgClass} d-inline-block`}
          />
        </GridItem>
      </GridContainer>
    );
  });
  return itemList;
};

export default userItem;
