import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UserDetail.css"
// import axios from 'axios';



const UserDetail = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const backend_url = 'http://26.170.181.245:8080/api/users/info';
        const token = localStorage.getItem('token');
        const token_type = localStorage.getItem('token_type');
        const headers = {
            'Authorization': `${token_type} ${token}`
        };
        const fetchUserData = async () => {
            try {
                const response = await axios.get(backend_url, { headers });
                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUserData();
        console.log(user);
        // setUser({
        //     name: localStorage.getItem('username'),
        //     email: localStorage.getItem('email'),
        //     phone: localStorage.getItem('phone'),
        //     address: localStorage.getItem('address'),
        // });
        
    }, []);

    return (
        <div className="UserDetailWrapper">
            <p>{user.name}</p>
            <p>{localStorage.getItem('token')}</p>
            <p>{localStorage.getItem('token_type')}</p>
        </div>
    )
}

export default UserDetail