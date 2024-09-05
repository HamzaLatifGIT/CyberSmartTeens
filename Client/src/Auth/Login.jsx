import { React, useState } from 'react'
import { useNavigate } from "react-router-dom"

// ANT-D :
import { Button, Input } from 'antd'

// Assets | ICONS :
import zeropark from '../assets/zeropark-logo-color-cm.svg'

// APIs :
import { LoginAPI } from '../Api/auth';

// Helpers :
import toast from 'react-hot-toast';

// CSS :
import './style/auth.scss'


function Login() {
    const Navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);

    const enteringFormData = (event) => {
        let { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const onSubmit = async (event) => {
        event?.preventDefault();
        setIsLoading(true);

        const res = await LoginAPI({ email: formData.email, password: formData?.password });
        if (res.error != null) {
            toast.error(res.error)
        } else {
            let Token = res.data?.data?.accessToken
            console.log(Token)
            localStorage.setItem('CyberTeensToken', Token)
            localStorage.setItem("CyberTeensUserData", JSON.stringify(res.data?.data?.user))
            toast.success(res.data?.message)
            setTimeout(() => {
                window.location.href = "/"
            }, 2000);
        }
        setIsLoading(false);
    };
    return (
        <div className='auth'>
            <div className="auth-container">
                <div className="form">
                    <div className="logo"><img src={zeropark} alt="" /></div>
                    <div className='form-box' onSubmit={onSubmit}>

                        <h3>Welcome to Cyber Teens</h3>
                        <h7>Please enter your detail to continue.</h7>
                        <Input placeholder='Enter email' name='email' onChange={enteringFormData} type='text' />
                        <Input placeholder='Password' name='password' onChange={enteringFormData} type='password' />
                        <Button
                            disabled={isLoading}
                            loading={isLoading}
                            type="submit"
                            onClick={onSubmit}>Sign in</Button>
                        <p>Don't have a account yet?</p>
                        <p>Click here to <span style={{cursor:"pointer"}} onClick={() => Navigate("/signup")}>Register </span></p>

                    </div>
                </div>
                <div className="left-box">
                    <div className="login-image"> <div className='login-contact-btn'> <p>Contact us</p></div></div>
                    <div className='detail'> <p>Cybersecurity is crucial in today's digital age as it protects sensitive data from malicious attacks, ensuring the privacy and security of personal and organizational information. By safeguarding systems against breaches, it helps maintain trust and prevent financial losses. </p>
                        <span> Please see more information <strong>here</strong></span>
                        <hr />
                        <div><span>Cookies Policy</span> <span>Privacy Policy</span> <span>DPA</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login