import React from 'react'
import { TbCards } from "react-icons/tb";
import { IoBookOutline } from "react-icons/io5";
import { SiQuizlet } from "react-icons/si";
import './style/InteractiveLearning.scss'


function InteractiveLearning() {
  return (
    <div id='about' className='inter-container'>
        <h1>We Offers</h1>
        <div className="items">
            <div className="item"><span>Flash Card</span> <TbCards size={100} style={{color:'#0052e8'}}/></div>
            <div className="item"><span>Courses</span><IoBookOutline size={100} style={{color:'brown'}}/></div>
            <div className="item"><span>Quizes</span><SiQuizlet size={100} style={{color:'blueviolet'}}/></div>
        </div>
    </div>
  )
}

export default InteractiveLearning