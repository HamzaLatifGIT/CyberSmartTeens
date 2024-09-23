import React from 'react'
import topic from  '../assets/topic.jpg'
import './style/Topic.scss'

function Topics() {
  return (
    <div className='topic-container'>
        <h1>Topics</h1>
<div className="items">
    <div className="item"><img src={topic} alt="" /> <h4>topic title</h4><span>cyber</span> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, nesciunt?</p></div>
    <div className="item"><img src={topic} alt="" /> <h4>topic title</h4><span>cyber</span> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, nesciunt?</p></div>
    <div className="item"><img src={topic} alt="" /> <h4>topic title</h4><span>cyber</span> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, nesciunt?</p></div>
</div>
    </div>
  )
}

export default Topics