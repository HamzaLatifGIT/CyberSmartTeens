import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Antd :
import { Button, Input } from 'antd'

// Assets | ICONS :
import zeropark from '../assets/zeropark-logo-color-cm.svg'

// APIs :
import { RegisterAPI } from '../Api/auth';

// Helpers :
import toast from 'react-hot-toast';

// CSS :
import './style/auth.scss'



function Signup() {
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [loading, setLoading] = useState(false)

  const enteringFormData = (event) => {
    let { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }


  const onSubmit = async (event) => {
    event?.preventDefault();
    setLoading(true)

    const { firstName, lastName, email, password } = formData;

    let res = await RegisterAPI({ email, password, firstName, lastName })
    if (res.error != null) {
      toast.error(res.error)
    } else {
      toast.success(res.data?.message)
      setTimeout(() => {
        Navigate("/login")
      }, 2000);
    }
    setLoading(false)
  };
  return (
    <div className='auth'>
      <div className="auth-container">
        <div className="form">
          <div className="logo"><img src={zeropark} alt="" /></div>
          <div className='form-box' >
            <h3>Sign up to Cyber Smart Teens</h3>
            <h7> Please fill in the required information to start your application process. </h7>
            <Input placeholder='First name*'
              id="username"
              type="text"
              name="firstName"
              onChange={enteringFormData} />
            <Input placeholder='Last name*'
              id="username"
              type="text"
              name="lastName"
              onChange={enteringFormData} />
            <Input placeholder='Email'
              id="email"
              type="email"
              name="email"
              onChange={enteringFormData}
            />
            <Input placeholder='Password'
              id="password"
              type="password"
              name="password"
              onChange={enteringFormData} />
            <Button
              loading={loading}
              onClick={onSubmit}>Sign up</Button>
            <p>Alerady have a ?<span onClick={()=> Navigate("/login")}>Login in</span></p>

          </div>
        </div>
        <div className="left-box">
          <div className="signup-image"> <div className='login-contact-btn'> <p>Contact us</p></div></div>
          <div className='detail'> <p> our reliance on digital platforms growing, understanding how to safeguard systems and data is vital for preventing breaches, ensuring privacy, and maintaining the integrity of critical infrastructure. Additionally, expertise in cybersecurity opens up numerous career opportunities in a field that is in high demand and crucial for the future of technology and society.</p>
            <span> Please see more information <strong>here</strong></span>
            <hr />
            <div><span>Cookies Policy</span> <span>Privacy Policy</span> <span>DPA</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup