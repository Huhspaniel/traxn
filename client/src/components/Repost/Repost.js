import React from 'react';
import axios from 'axios';

const RepostComponent = (props) => (

    <i className="fa fa-retweet" onClick={props.repostHandler} />
)
    

class Repost extends React.Component {
    state = {
        
    }

    handleRepost = () => {
        axios.post('/repost/:5c0c183fa737125f8ee738ed')
        .then((res) => {
            console.log(res);
        }).catch((err) => {console.log(err)});
    }

    render() {
        return(
            <p>
                <RepostComponent 
                repostHandler = {this.handleRepost}
                />
            </p>
        )
    }
}

export default Repost;