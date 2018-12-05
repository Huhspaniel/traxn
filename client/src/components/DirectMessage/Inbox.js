import React from "react";

const Message = props => (
  <div>
    <span>
      <h1>From:#JohnHancock</h1> <h2>April 20th, 2018</h2>
    </span>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has{" "}
    </p>
    <button>Reply</button>
  </div>
);



const Inbox = props => (
  <div>
    <Message /> {/*Should map*/}
  </div>
);

export default Inbox;
