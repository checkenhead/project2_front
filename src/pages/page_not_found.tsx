import React from "react";
import { useLocation } from "react-router-dom";

const PageNotFound = () => {
  const location = useLocation()

  return <div>{location.pathname} is not exist</div>;
};

export default PageNotFound;