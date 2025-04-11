import React, { useState } from 'react'
import "./Home.css"
import betterCallSaul from '../photos/better-call-saul'
import breakingBad from '../photos/breaking-bad'
import prisonBreak from '../photos/prison-break'
import squidGame from '../photos/squid-game'
import {ClipLoader} from "react-spinners"
const allMovies = [betterCallSaul, breakingBad, prisonBreak, squidGame]
const moviesCover = [betterCallSaul[0], breakingBad[0], prisonBreak[0], squidGame[0]]
const moviesNames = ['Better Call Saul', 'Breaking bad', 'Prison Break', 'Squid Game'];

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [curMovieIdx, setCurMovieIdx] = useState(0);
    const [curMovieImages, setCurMovieImages] = useState(allMovies[0]);
    const [curMovieCurPhoto, setCurMovieCurPhoto] = useState(0);
    return (
        <div className='home'>
            <div className='display'>
                <div className='movie-display'>
                    <div className='movie-info'>
                        <p>Netflix Photos</p>
                        <h1>Badman returns Again</h1>
                        <p>Coming Novermber, 1st 2026</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div className='movie-main-photo'>
                        <img src={`${curMovieImages[curMovieCurPhoto]}`} alt="Cover" />
                    </div>
                </div>
                <div className='movie-all-photos'>
                    {
                        curMovieImages.map((image, index) => {
                            return (
                                <div className={`movie-photo ${index == curMovieCurPhoto? 'cur-movie-cur-photo' : ''}`}
                                onClick={()=>{
                                    setCurMovieCurPhoto(index)
                                }}
                                >
                                    <img src={`${image}`} alt="Photo" />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='slider'>
                {
                    moviesCover.map((cover, index) => {
                        return (
                            <div className={`cover ${index == curMovieIdx ? 'cur-cover' : ''}`}
                                onClick={() => {
                                    setCurMovieIdx(index);
                                    setCurMovieImages(allMovies[index]);
                                    setCurMovieCurPhoto(0);
                                }}
                            >
                                <img src={cover} alt="cover" />
                                <p className='movie-name'>{moviesNames[index]}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Home