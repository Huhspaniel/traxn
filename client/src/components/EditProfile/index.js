import React from "react";
// import { CloudinaryContext, Transformation, Image } from "cloudinary-react";
import axios from "axios";

const UploadImageForm = props => (
  <form>
    <input type="submit" value="Update Profile Image" onClick={props.openWidget} />
  </form>
);

class AccountSettings extends React.Component {
  state = {};

  updateUser = data => {
    axios
      .put("api/users/me", {
        imageUrl: data[0].url
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  uploadWidget(event) {
    event.preventDefault();
    window.cloudinary.openUploadWidget(
      { cloud_name: "traxn-inc", upload_preset: "userphoto" },
      (error, result) => {
        console.log(result);
        this.updateUser(result);
      }
    );
  }

  render() {
    return (
      <div>
        <UploadImageForm openWidget={this.uploadWidget.bind(this)} />
      </div>
    );
  }
}

const EditProfilePage = props => (
  <div className="edit-profile-wrapper">
    <p className="title">Edit Profile</p>

    <div className="inputs">
      <input
        onChange={ props.handleChange }
        type="text"
        name="username"
        maxLength="18"
        value={props.username}
        placeholder="New Username"
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="displayName"
        maxLength="18"
        value={props.displayName}
        placeholder="New Display Name"
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="email"
        value={props.email}
        placeholder="New Email"
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="website"
        value={props.website}
        placeholder="Website"
        maxLength="20"
      />
      <input
        onChange={props.handleChange}
        type="text"
        name="location"
        value={props.location}
        placeholder="Location"
        maxLength="20"
      />
      <input
        onChange={props.handleChange}
        type="date"
        name="birthday"
        value={props.location}
        placeholder="Birthday"
        maxLength="20"
      />
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
    location: "",
    birthday: "",
    currentUsername: "",
    currentDisplayName: "",
    currentEmail: "",
    errorMsg: "",
  };

  saveChanges = () => {
    const { username, displayName, email, website, location, birthday  } = this.state;
    const fields = { username, displayName, email, website, location, birthday };
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
        <AccountSettings />
      </div>
    );
  }
}

export default EditProfile;
