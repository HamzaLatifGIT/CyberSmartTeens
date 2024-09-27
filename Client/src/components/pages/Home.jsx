import React from 'react'
import Navbar from '../Navbar'
import HeroSection from '../HeroSection'
import bg from '../../assets/file.mp4'
import About from '../About'
import BrandsConnect from '../About'
import Topics from '../Topics'
import Quizes from '../QuizList'
import InteractiveLearning from '../InteractiveLearning'
import Footer from '../Footer'

function Home() {
    return (
        <>
            <Navbar />
            <HeroSection  url={bg} title={<h2>Cyber Smart <br/> Teens</h2> } text={'Interactive Lerning Platform'}/>
            <About/>
            <Topics/>
            <Quizes/>
            <InteractiveLearning/>
            <Footer/>
            
        </>
    )
}

export default Home