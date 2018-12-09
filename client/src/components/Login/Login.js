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
                <p className="send-login" onClick={props.loginHandler}>Login</p>
                <p className="login-btn" onClick={props.toggleHandler}>Close</p>
                    
                </Modal>
            </div>
                
)


class LoginModal extends React.Component {
    state = {
        isActive: false,
        value: '',
        loggedIn: false,
        accessGranted: false
    }

    sendLogin = () => {
        axios
          .post(`/login`)
          .then(user => {
            console.log(user);
            this.setState({ loggedIn: true });
          })
          .catch(err => console.log(err));
      };

    getToken = () => {
        axios
        .get('csrf')
        .then(csrfToken => {
            console.log(csrfToken);
            this.setState({ accessGranted: true })
        })
        .catch(err => console.log(err));
    }

    componentWillMount(){
        Modal.setAppElement('body');
        this.getToken();
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
                loginHandler = {this.sendLogin}
                isActive = {this.state.isActive}
                toggleHandler={this.handleToggle}
                changeHandler={this.handleChange}/>
            </div>
        );
    }
}

export default LoginModal;