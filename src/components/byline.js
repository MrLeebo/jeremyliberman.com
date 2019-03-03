import React from "react";
import avatar from "../images/avatar.png";

export default function Byline({ date, timeToRead }) {
  return (
    <small className="f5 f4-ns nearly-black">
      <img
        src={avatar}
        className="w2 ba br-100 mb0 v-btm"
        alt="Jeremy Liberman"
      />{" "}
      <em>
        Posted: {date} &middot; {timeToRead || 1}m read
      </em>
    </small>
  );
}
