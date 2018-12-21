import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const Message = props => (
  <div>
    <span>
      <h1>From:#JohnHancock</h1> <h2>April 20th, 2018</h2>
    </span>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book. It has
    </p>
    <button>Reply</button>
  </div>
);

const ComposeMessage = props => (
  <div className="message-form">
    <form>
      <h1>To:</h1>
      <input
        type="text"
        name="sendTo"
        value={props.sendToValue}
        onChange={props.changeHandler}
      />
      <h1>Message:</h1>
      <input
        type="text"
        value={props.inputValue}
        onChange={props.changeHandler}
        name="newMessage"
      />
      <input
        type="submit"
        value="Send"
        name="send"
        onClick={props.sendMessage}
      />
      <input
        type="submit"
        value="Cancel"
        onClick={props.closeForm}
        name="closeForm"
      />
    </form>
  </div>
);

const FirstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};

class Inbox extends React.Component {
  state = {
    showNewMessage: false,

    newMessage: "",

    sendTo: ""
  };

  sendMessage = event => {
    event.preventDefault();
    {
      /* Need to configure back end for messaging, Function would go here */
    }
    this.setState({
      showNewMessage: !this.state.showNewMessage
    });
  };

  closeForm = event => {
    event.preventDefault();
    this.setState({
      showNewMessage: !this.state.showNewMessage
    });
  };

  changeHandler = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  showNewMessage = event => {
    event.preventDefault();
    this.setState({
      showNewMessage: !this.state.showNewMessage
    });
  };

  render() {
    return (
      <div className="inbox-container">
        {!this.state.showNewMessage && (
          <form className="newMessageButton">
            <input
              type="submit"
              value="New Message"
              onClick={this.showNewMessage}
            />
          </form>
        )}
        <ReactCSSTransitionGroup
          transitionName="message-form"
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
          transitionAppearTimeout={1000}
          component={FirstChild}
        >
          {this.state.showNewMessage && (
            <ComposeMessage
              changeHandler={this.changeHandler}
              inputValue={this.state.newMessage}
              sendToValue={this.state.sendTo}
              sendMessage={this.sendMessage}
              closeForm={this.closeForm}
              key="createMessageToggler"
            />
          )}
        </ReactCSSTransitionGroup>
        <div className="messages-container">
          <Message /> {/*Should map*/}
        </div>
      </div>
    );
  }
}

export default Inbox;
