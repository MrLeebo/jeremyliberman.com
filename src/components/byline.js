import React from "react";
import Image from "./image";

export default function Byline({ date, timeToRead }) {
  return (
    <small className="f5 f4-ns dark-gray">
      <Image />{" "}
      <em>
        {date} &middot; {timeToRead || 1} min read
      </em>
    </small>
  );
}
