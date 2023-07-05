import React, { useState } from "react";

const FullSelect = () => {
  const [data, setdata] = useState(false);
  return <div onClick={() => setdata(!data)}>{data?.toString()}</div>;
};

export default FullSelect;
