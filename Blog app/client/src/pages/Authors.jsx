import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { SERVER_API_URL, SERVER_ASSET_URL } from '../creds';

const dummy_authors = [
  {
    id: 1,
    num_posts: 20,
    name: "Mohamed Abdelsattar",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"
  },
  {
    id: 2,
    name: "Sayed Omar",
    num_posts: 20,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"
  },
  {
    id: 3,
    num_posts: 20,
    name: "Omar Riad",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"

  },
  {
    id: 4,
    num_posts: 20,
    name: "Mahmoud Khamees",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyzTWQoCUbRNdiyorem5Qp1zYYhpliR9q0Bw&s"
  }
]

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  useEffect(()=>{
    async function fetchData(){
      const res = await fetch(SERVER_API_URL+"/users/");
      const resJson = await res.json();
      console.log(resJson.data);
      
      setAuthors(resJson.data);
    }
    fetchData();
  },[]);
  return (
    <div className="authors">
      {
        authors.map((author) => {
          console.log(author.avatar);
          
          return (
            <div className="author" key={author.id}>
              <img src={SERVER_ASSET_URL+'uploads/' +author.avatar} alt={author.name} />
              <div className="stats">
                <Link to={`/posts/users/${author._id}`} className='btn-prof'>{author.name}</Link>
                <p>Posted {author.numPosts} Times</p>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default Authors;