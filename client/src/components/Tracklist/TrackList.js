import React from 'react';
import Axios from 'axios';

const Track = props => (
   <div>
       <img src={props.userPic}/>
       <p>{props.TrackContent}</p>
       <button onClick={props.dislike}>Dislike</button>
       <button onClick={props.repost}>Repost</button>
   </div>
);

class TrackList extends React.Component{

    state={
        followingPosts: TrackList,
    }

    getTracks =()=>{
        Axios.get()
    }

    render(){
        return(
            // <div>
            //     {this.state.followingPosts.map((post, i)=>(
                    // <Track 
                    // key={i}
                    // TrackContent={post.text}
                    // userPic={post.profilePic}
                    // dislike={this.dislike}
                    // repost={this.repost} />
            //     ))} 

                
            // </div>
            <div>
            <Track 
            key="test" 
            TrackContent="This is a test post"
            userPic="https://www.gstatic.com/webp/gallery/1.jpg"
            />
            </div>
        )
    }


}

export default TrackList;
