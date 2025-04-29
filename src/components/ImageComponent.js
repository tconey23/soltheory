import React from 'react';

const ImageComponent = ({ src, alt, style, srcSet }) => {
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      style={style}
      loading="lazy"
    />
  );
}

export default ImageComponent