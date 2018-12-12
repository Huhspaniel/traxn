import React from "react";
import axios from "axios";

const EditProfilePage = props => (
  <div className="edit-profile-wrapper">
    <p className="title">Edit Profile</p>

    <div className="inputs">
      <input
        onChange={props.handleChange}
        type="text"
        name="username"
        value={props.username}
        placeholder={props.user ? props.user.username : ''}
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="displayName"
        value={props.displayName}
        placeholder={props.user ? props.user.displayName : ''}
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="email"
        value={props.email}
        placeholder={props.user ? props.user.email : ''}
      />
      <input
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
      />
    </div>
    <button className="save-changes">Save Changes</button>
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
    currentEmail: ""
  };

  saveChanges = () => {
      this.props.axios
      .put('api/users/me', {
          username: this.state.username,
          displayName: this.state.displayName,
          email: this.state.email
      }).then({
          
      })
  }

  changeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div className="edit-profile">
        <EditProfilePage
            handleChange={this.changeHandler}
            user={this.props.user}
        />
      </div>
    );
  }
}

export default EditProfile;
