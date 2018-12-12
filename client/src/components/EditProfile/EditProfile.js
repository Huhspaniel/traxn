import React from "react";
import axios from "axios";

const EditProfilePage = props => (
  <div className="edit-profile-wrapper">
    <p className="title">Edit Profile</p>

    <div className="inputs">
      <input
        onChange={ props.handleChange }
        maxLength={props.max_chars} required
        type="text"
        name="username"
        maxLength="18"
        value={props.username}
        placeholder={props.user ? props.user.username : ""}
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="displayName"
        maxLength="18"
        value={props.displayName}
        placeholder={props.user ? props.user.displayName : ""}
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="email"
        value={props.email}
        placeholder={props.user ? props.user.email : ""}
      />
      {/* <input
        onChange={props.handleChange}
        type="text"
        name="website"
        value={props.website}
        placeholder={props.user ? props.user.website : ''}
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="location"
        value={props.location}
        placeholder={props.user ? props.user.location : ''}
      /> */}
    </div>
    <p>{props.errorMsg}</p>
    <button onClick={props.saveBtn} className="save-changes">
      Save Changes
    </button>
  </div>
);

class EditProfile extends React.Component {
  state = {
    username: "",
    displayName: "",
    email: "",
    website: "",
    birthday: "",
    currentUsername: "",
    currentDisplayName: "",
    currentEmail: "",
    errorMsg: "",
  };

  saveChanges = () => {
    const { username, displayName, email } = this.state;
    const fields = { username, displayName, email };
    const update = {};
    for (let prop in fields) {
      if (fields[prop]) {
        update[prop] = fields[prop];
      }
    }
    this.props.axios
      .put("api/users/me", update)
      .then(res => {
        if (res.data.error) {
          this.setState({ errorMsg: "You didn't change anything." });
          console.log(res.data.error);
        } else {
          console.log(res.data);
          this.props.authJWT();
          this.props.setRedirect("/");
        }
      });
  };

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div className="edit-profile">
        <EditProfilePage
          saveBtn={this.saveChanges}
          handleChange={this.changeHandler}
          user={this.props.user}
        />
      </div>
    );
  }
}

export default EditProfile;
