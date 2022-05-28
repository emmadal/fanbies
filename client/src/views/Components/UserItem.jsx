import React from "react";
import { Link } from "react-router-dom";
import GridItem from "components/Grid/GridItem.jsx";

const userItem = ({ classData, imgClass, userData }) => {
  const itemList = userData.map((item, i) => {
    return (
      <GridItem xs={6} sm={3} md={3} key={`${item.username}-${i}`}>
        <div className="m-a-lg">
          <Link to={{ pathname: `/user/${item.username}` }}>
            <img
              src={item.picture}
              alt={item.username}
              className={`${imgClass} transparent-icon`}
            />
            <div className="card-list-info">
              <h4
                className={`${
                  classData.cardTitle
                } font-xs font-bold min-width-xs min-height-xxxs`}
              >
                {item.name}
              </h4>
            </div>
          </Link>
        </div>
      </GridItem>
    );
  });
  return itemList;
};

export default userItem;
