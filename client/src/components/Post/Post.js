import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const Post = (props) => (
    <div className="post-wrapper">
    <i onClick={props.toggleHandler} className="far fa-edit"></i>
    <Modal isOpen={props.isActive}>
    <textarea name='content' type="text"
    onChange={props.changeHandler}
    value={props.inputValue}
    placeholder="what would you like to say..."/>
    <button className="post-btn" onClick={props.postHandler}>Post</button>

    <button className="close" onClick={props.toggleHandler}>Close</button>
    </Modal>
    </div>

    
)

const ErrorMessage = props => (
    <p>Content must be between 1 and 333 characters. </p>
);

class PostModal extends React.Component {
    state = {
        isActive: false,
        value: '',
        content: '',
        showError: false
    }

    handlePost = () => {
        axios.post('/api/tracks', {
            content: this.state.content
        }).then(res => {
            console.log(res);
            if(!res.data.error)
            this.setState({
                isActive: false
            })
            else if(res.data.error){
                this.setState({
                    showError: true
                })
            }
        }).catch(err => console.log(err));
    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    handleToggle = () => {
        this.setState({
            isActive: !this.state.isActive,
            showError: false
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
            <div className="post-modal">
            {this.state.showError && (<ErrorMessage/>)}
            <Post 
            postHandler = {this.handlePost}
            toggleHandler = {this.handleToggle}
            changeHandler = {this.handleChange}
            isActive={this.state.isActive}
            />
            
            </div> 
        )
    }
}

export default PostModal;