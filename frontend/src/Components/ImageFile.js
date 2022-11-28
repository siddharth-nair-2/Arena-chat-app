import React from "react";

const ImageFile = (props) => {
  return (
    <img
      style={{ width: 150, height: "auto" }}
      src={props.imageSrc}
      alt={props.fileName}
    />
  );
};

export default ImageFile;
