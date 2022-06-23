/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import * as React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableListItem from "./DraggableListItem";

const DraggableList = React.memo(({ items, onDragEnd, setLinks }) => {
  const [currLinkId, setCurrLinkId] = React.useState();
  const [isTitle, setIsTitle] = React.useState(false);
  const [isURL, setIsURL] = React.useState(false);

  const handleChange = (index, event) => {
    const data = [...items];
    data[index][event.target.name] = event.target.value;
    window.console.log(data);
    setLinks(data);
  };

  const addTitle = (id, key) => {
    const u = items.find((e) => e.id === id);
    if (items[key]?.id === u.id) {
      setCurrLinkId(u?.id);
      setIsTitle(!isTitle);
    }
  };

  // const addURL = (id, key) => {
  //   const u = links.find((e) => e.id === id);
  //   if (items[key]?.id === u.id) {
  //     setCurrLinkId(u?.id);
  //     setIsURL(!isURL);
  //   }
  // };

  const removeLink = (key) => {
    items.splice(key, 1);
    setLinks([...items]);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <DraggableListItem
                item={item}
                index={index}
                key={item.id}
                removeLink={removeLink}
                handleChange={handleChange}
                addTitle={addTitle}
                setCurrLinkId={setCurrLinkId}
                currLinkId={currLinkId}
                setIsTitle={setIsTitle}
                isTitle={isTitle}
                setIsURL={setIsURL}
                isURL={isURL}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default DraggableList;
