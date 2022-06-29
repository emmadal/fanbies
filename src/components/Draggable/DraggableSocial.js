/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */

import { memo } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableSocialItem from "./DraggableSocialItem";

const DraggableSocial = memo(({ socialLinks, setSocialLinks, onDragEnd }) => {
  //   const handleChange = (index, event) => {
  //     const data = [...links];
  //     data[index][event.target.name] = event.target.value;
  //     setLinks(data);
  //   };

  // const addTitle = (id, key) => {
  //   const u = items.find((e) => e.id === id);
  //   if (items[key]?.id === u.id) {
  //     setInputLengthTitle(1);
  //     setCurrLinkId(u?.id);
  //     setIsTitle(true);
  //   }
  // };

  const removeLink = () => {
    // links.splice(key, 1);
    // setLinks([...links]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {socialLinks
              .filter((e) => e.isAdded === true)
              .map((item, index) => (
                <DraggableSocialItem
                  setSocialLinks={setSocialLinks}
                  item={item}
                  index={index}
                  key={item.id}
                  removeLink={removeLink}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default DraggableSocial;
