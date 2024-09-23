import React from 'react'

// css :
import './style/Brandsconnect.scss'

// Assets | Icons | Logo :
import icon1 from '../assets/icons/ico-capture.svg'
import icon2 from '../assets/icons/ico-omnichannel.svg'
import icon3 from '../assets/icons/ico-cookies.svg'

function About() {
    return (
        <div className='brandconnect'>
            <div className="brandconnect__container max-width">
                <div className='heading' data-aos='fade-up' data-aos-delay='100'> <h2>We help Students connect with Teachers <br />And Learn in all stages.</h2> <p>we help students to discover  and familiar with technology  .</p></div>
                <div className='brandconnect__box'>
                    <div className='text' data-aos='fade-up' data-aos-delay='200'><p style={{fontWeight:'700'}}>our platform offers interactive quizzes and study tools to help students test their knowledge and track progress.</p><p data-aos='fade-up' data-aos-delay='300'> Whether you're preparing for exams, revising topics, or exploring new subjects, our comprehensive study tools and personalized learning dashboard ensure a dynamic and user-friendly environment for all learners.</p></div>
                    <div className="icons">
                        <div className="icon" data-aos='fade-up' data-aos-delay='300'><img src={icon1} alt="" data-aos='fade-in' data-aos-delay='600' /><span> customers Support </span></div>
                        <div className="icon" data-aos='fade-up' data-aos-delay='400'><img src={icon2} alt="" data-aos='fade-in' data-aos-delay='700' /><span>Seamless experience</span></div>
                        <div className="icon" data-aos='fade-up' data-aos-delay='500'><img src={icon3} alt="" data-aos='fade-in' data-aos-delay='800' /> <span>Progress Tracking</span></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default About