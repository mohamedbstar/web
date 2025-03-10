import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { SERVER_API_URL, SERVER_ASSET_URL } from '../creds';

const PostItem = (props) => {
    const post = props.post;
    const postTitle = post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title;
    const postDesc = post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content;
    const [user, setUser] = useState({});

    useEffect(()=>{
        async function fetchData(){
            console.log(post);
            
            const res = await fetch(SERVER_API_URL + "/users/" + post.user_id);
            const resJson = await res.json();
            console.log(res);
            
            setUser(resJson.data);
        }
        fetchData();
    }, [])
    return (
        <div className="post-item">
            <img src={SERVER_ASSET_URL + "uploads/" + post.image} />
            <h3><Link to={`/posts/${post.id}`} className='post-item-title'>{postTitle}</Link></h3>
            <p className='post-item-desc'>{postDesc}</p>
            <div className='post-item-footer'>
                <div className="info">
                    <Link to={`/posts/users/${post.user_id}`}><img src={SERVER_ASSET_URL + "uploads/" + user.avatar} /></Link>
                    <div className="author-stamp">
                        <Link to={`/posts/users/${post.user_id}`}><h3 className='btn-prof'>{user.name}</h3></Link>
                        <p>Just Now</p>
                    </div>
                </div>
                <div className="cat">
                    <Link to={`/posts/categories/${post.category}`} className='btn-nav'>{post.category}</Link>
                </div>
            </div>
        </div>
    )
}

export default PostItem