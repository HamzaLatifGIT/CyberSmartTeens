import { React, useEffect, useState } from 'react';

// ANT-D :
import { Button, Upload, Input } from 'antd';

// Assets | ICONS :
import { PlusOutlined } from '@ant-design/icons';

// APIs :
import { UpdateProfileAPI } from '../Api/auth';
// Redux :
import { useDispatch, useSelector } from 'react-redux';

// CSS :
import './style/Profile.scss';
import toast from 'react-hot-toast';
import { userDataActions } from '../Redux/Slice/userData';
import ImgURL from '../Utils/ImgUrlGen';





function Profile() {
    const Dispatch = useDispatch()

    const UserData = useSelector(state => state.userData)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        city: "",
        state: "",
        zip: "",
        country: ''
    })
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false)

    const EnteringFormData = (event) => {
        let { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }
    const onChangee = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => setPreviewImage(reader.result);
        } else {
            setPreviewImage(null);
        }
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const imgWindow = window.open(src);
        imgWindow?.document.write(`<img src="${src}" alt="preview" />`);
    };
    console.log("++++++++++++++++++", fileList);

    const UpdateProfile = async () => {
        setLoading(true)
        let Payload = new FormData()
        Object.keys(formData).map(key => {
            Payload.append(key, formData[key])
        })

        if (fileList && fileList.length >= 1) {
            Payload.append("file", fileList[0].originFileObj)
        }

        let res = await UpdateProfileAPI(Payload)
        if (res.error != null) {
            toast.error(res?.error)
        } else {
            toast.success(res.data?.message)

            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        setLoading(false)
    }

    useEffect(() => {
        if (UserData) {
            setFormData({
                firstName: UserData?.firstName,
                lastName: UserData?.lastName,
                email: UserData?.email,
                phone: UserData?.phone,
                age: UserData?.age,
                city: UserData?.city,
                state: UserData?.state,
                zip: UserData?.zip,
                country: UserData?.country,
            })
            setPreviewImage(ImgURL(UserData?.profileImage))
        }
    }, [UserData])

    return (
        <div className="profile-content">
            <h2>Profile </h2>
            <div className="profile-picture">
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    fileList={fileList}
                    multiple={false}
                    onChange={onChangee}
                    onPreview={onPreview}
                    showUploadList={false}
                >
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <PlusOutlined style={{}} />
                    )}
                </Upload>
            </div>
            <form>
                <div className="flex">
                    <div className="form-group">
                        <label>First Name</label>
                        <Input type="text" name='firstName' placeholder='First Name' value={formData.firstName} onChange={EnteringFormData} />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <Input type="text" name='lastName' placeholder='Last Name' value={formData.lastName} onChange={EnteringFormData} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <Input type="email" name='email' placeholder='Email' value={formData.email} onChange={EnteringFormData} />
                </div>
                <div className="form-group">
                    <label>Contacts Number</label>
                    <Input type="text" name='phone' placeholder='Phone No' value={formData.phone} onChange={EnteringFormData} />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <Input type="text" name='age' placeholder='Age' value={formData.age} onChange={EnteringFormData} />
                </div>
                <div className="flex"> <div className="form-group">
                    <label>City</label>
                    <Input type="text" placeholder='City' name='city' value={formData.city} onChange={EnteringFormData} />
                </div>
                    <div className="form-group">
                        <label>State</label>
                        <Input type="text" name='state' placeholder='State' value={formData.state} onChange={EnteringFormData} />
                    </div>
                    <div className="form-group">
                        <label>Zip code</label>
                        <Input type="text" name='zip' placeholder='Zip Code' value={formData.zip} onChange={EnteringFormData} />
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <Input type="text" name='country' placeholder='Country' value={formData.country} onChange={EnteringFormData} />
                    </div>
                </div>
                {/* <div className="form-group">
                    <label>Password</label>
                    <input type="password" />
                </div> */}
                <Button type="submit" className="save-btn" onClick={UpdateProfile}>Update</Button>
            </form>
        </div>
    )
}

export default Profile