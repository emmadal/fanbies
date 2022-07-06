/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */

import { memo } from "react";
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
  }) => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <DraggableListItem
                item={item}
                items={items}
                setLinks={setLinks}
                index={index}
                key={item.id}
                setInputLengthTitle={setInputLengthTitle}
                inputLengthTitle={inputLengthTitle}
                inputLengthURL={inputLengthURL}
                setInputLengthURL={setInputLengthURL}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
);

export default DraggableList;
