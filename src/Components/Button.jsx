import React from "react";

function Button({ dispatch, value }) {
  return <button onClick={() => dispatch({ value })}>{value}</button>;
}

export default Button;
