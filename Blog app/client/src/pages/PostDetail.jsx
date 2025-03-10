import React from 'react'
import { Link } from 'react-router-dom';
const PostDetail = () => {
  const post = {
    "id": 20,
    "title": "DANVOUY Womens T Shirt Casual Cotton Short",
    "price": 12.99,
    "author": "Mohamed Abdelsattar",
    "description": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
    "rating": {
      "rate": 3.6,
      "count": 145
    }
  }
  return (
    <section className='post-detail'>
      <div className="post-container">

        <div className="post-header">
          <div className="post-author">
            <Link to={`profile/mohamed}`}><img src={post.image} /></Link>
            <div className="author-stamp">
              <h3 className='btn-nav'>Mohamed Abdelsattar</h3>
              <p>Just Now</p>
            </div>
          </div>
          <div className="post-buttons">
            <Link to={`posts/1/edit`} className='btn-primary'>Edit</Link>
            <Link to={`posts/1/delete`} className='btn-danger'>Delete</Link>
          </div>
        </div>
        <div className="post-content">
          <h2>This is the post title</h2>
          <div className="post-thumbnail">
            <img src={post.image} />
          </div>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry'sstandard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
            software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>

          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry'sstandard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
            software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry'sstandard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
            software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry'sstandard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing
            software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>

      </div>
    </section>
  )
}

export default PostDetail