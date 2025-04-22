import React from 'react';
 
const getPublicUrl = (path) => {
  if (window.__POWERED_BY_QIANKUN__) {
    return window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + path;
  }
  return process.env.PUBLIC_URL + '/' + path;
};
 
const PublicImage = ({ src, alt, ...rest }) => (
  <img src={getPublicUrl(src)} alt={alt} {...rest} />
);
 
export default PublicImage;