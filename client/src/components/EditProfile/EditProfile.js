import React from "react";
import { CloudinaryContext, Transformation, Image } from "cloudinary-react";
import axios from "axios";

const UploadImageForm = props => (
  <form>
    <input type="submit" value="Upload" onClick={props.openWidget} />
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

export default AccountSettings;
