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



  uploadWidget(event) {
    event.preventDefault();
    window.cloudinary.openUploadWidget(
      { cloud_name: "traxn-inc", upload_preset: "userphoto" },
      function(error, result) {
        console.log(result[0].url);
        axios.put("api/users/me", {
            imageUrl: result[0].url
        }).then(data => {
            console.log(data)
        }).catch(error => {
            console.log(error)
        });
           
    
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
