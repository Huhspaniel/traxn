import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const Login = (props) => (
            <div className="login-div">
                <p onClick={props.toggleHandler}>Login</p>
                <Modal isOpen={props.isActive}>
                <input onChange={props.changeHandler} 
                type="text" name={props.name} 
                value={props.value} placeholder="username" />
                <input onChange={props.changeHandler} 
                type="text" name="username"
                value={props.value} placeholder="password" />

                <p className="login-btn" onClick={props.toggleHandler}>Login</p>
                    
                </Modal>
            </div>
                
)


class LoginModal extends React.Component {
    state = {
        isActive: false,
        value: '',
        loggedIn: false
    }

    getPublic = () => {
        axios
          .get(`/api/users`)
          .then(res => {
            console.log(res);
            this.setState({ loggedIn: res.data });
          })
          .catch(err => console.log(err));
      };

    componentWillMount(){
        Modal.setAppElement('body');
    }

    handleToggle = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    handleChange = (event) => {
        console.log(event.target.name)
      this.setState({ 
          [event.target.name]: event.target.value
       });
    }

    render() {
        return (
            <div className='login-modal'>
                <Login 
                isActive = {this.state.isActive}
                toggleHandler={this.handleToggle}
                changeHandler={this.handleChange}/>
            </div>
        );
    }
}

export default LoginModal;