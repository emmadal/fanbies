/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */

import { memo, useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SocialMediaContext from "context/SocialMediaContext";
import DraggableSocialItem from "./DraggableSocialItem";

const DraggableSocial = memo(({ onDragEnd }) => {
  const { socialMediaLinks } = useContext(SocialMediaContext);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {socialMediaLinks
              .filter((e) => e.isAdded === true)
              .map((item, index) => (
                <DraggableSocialItem item={item} index={index} key={item.id} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default DraggableSocial;
