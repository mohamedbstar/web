import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormData from 'form-data';
import { SERVER_API_URL } from '../creds';
import { useSelector } from 'react-redux';
const EditPost = () => {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [image, setImage] = useState('');
  const [gError, setGError] = useState('');
  const [post, setPost] = useState({});

  const params = useParams();
  const loggedIn = useSelector((state) => state.loggedInSlice);
  const token = useSelector((state) => state.token);
  const decoded_token = useSelector((state) => state.decoded_token);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const id = params.id;
      console.log('In Edit Post FtechData id: =====> ' + id);

      const res = await fetch(SERVER_API_URL + "/posts/" + id);
      const resJson = await res.json();
      console.log('resJson.data =======> ', resJson.data);
      if (resJson.status != 'success') {
        console.log("resJson.status != 'success'");
        console.log('resJson.message: ' + resJson.message);
        navigate('/');
      }


      setPost(resJson.data);
    }
    if (!loggedIn) {
      console.log('!loggedIn');
      navigate('/');
    }

    fetchData();
  }, [])
  useEffect(() => {
    if (post && post.user_id) {
      const post_user_id = post.user_id;
      console.log('Post: ============> ', post);
      if (decoded_token !== post_user_id) {
        console.log('decoded_token != post.user_id');
        console.log('decoded_token ====> ' + decoded_token);
        console.log('post.user_id ======> ' + post.user_id);
  
  
        navigate('/');
      }
    }
  }, [post, decoded_token, navigate]);
  function handleTitle(e) {
    setTitle(e.target.value);
  }
  function handleCat(e) {
    setCat(e.target.value);
  }
  function handleContent(e) {
    setContent(e.target.value);
  }
  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  async function doSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('cat', cat);
    formData.append('image', image);
    formData.append('user_id', decoded_token);

    const res = await fetch(SERVER_API_URL + "/posts/" + post._id, {
      method: 'PUT',
      headers: {
        'Authorization': "Bearer " + token
      },
      body: formData
    });

    const resJson = await res.json();
    if (resJson.status == 'success') {
      console.log('SUCCESS');
      
      navigate('/');
    } else {
      setGError(resJson.message);
    }

  }
  return (
    <div className='create-post'>
      <h2>Edit Post</h2>
      <form className='form' encType='multipart/form-data'>
        {gError && <p className="error-msg">{gError}</p>}
        <input type='text' name='title' id='title' onChange={(event) => {
          handleTitle(event);
        }} placeholder='Enter Title' />

        <input type='text' name='cat' id='cat' onChange={(event) => {
          handleCat(event);
        }} placeholder='Enter Category' />

        <textarea name='content' placeholder='Content' onChange={(event) => {
          handleContent(event);
        }} />

        <input type='file' name='file' accept='png, jpg, jpeg' onChange={(e) => {
          setImage(e.target.files[0]);
        }} />

        <button type='submit' className='btn-nav' onClick={(event) => {
          doSubmit(event);
        }}>Submit</button>
      </form>

    </div>
  )
}

export default EditPost;