/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */

import { useState, memo } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableListItem from "./DraggableListItem";

const DraggableList = memo(
  ({
    items,
    onDragEnd,
    setLinks,
    setInputLengthTitle,
    inputLengthTitle,
    setInputLengthURL,
    inputLengthURL,
  }) => {
    const [currLinkId, setCurrLinkId] = useState();
    const [isTitle, setIsTitle] = useState(false);
    const [isURL, setIsURL] = useState(false);

    const handleChange = (index, event) => {
      const data = [...items];
      if (event.target.name === "title") {
        data[index][event.target.name] = event.target.value;
        setInputLengthTitle(event.target.value.length);
        setLinks(data);
      }
      if (event.target.name === "url") {
        data[index][event.target.name] = event.target.value;
        setInputLengthURL(event.target.value.length);
        setLinks(data);
      }
    };

    const addTitle = (id, key) => {
      const u = items.find((e) => e.id === id);
      if (items[key]?.id === u.id) {
        setInputLengthTitle(1);
        setCurrLinkId(u?.id);
        setIsTitle(true);
      }
    };

    const addURL = (id, key) => {
      const u = items.find((e) => e.id === id);
      if (items[key]?.id === u.id) {
        setInputLengthURL(1);
        setCurrLinkId(u?.id);
        setIsURL(true);
      }
    };

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
                  setInputLengthTitle={setInputLengthTitle}
                  inputLengthTitle={inputLengthTitle}
                  currLinkId={currLinkId}
                  setIsTitle={setIsTitle}
                  isTitle={isTitle}
                  setIsURL={setIsURL}
                  isURL={isURL}
                  inputLengthURL={inputLengthURL}
                  setInputLengthURL={setInputLengthURL}
                  addURL={addURL}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
);

export default DraggableList;
