import { useEffect, useState } from 'react';
import { baseURL } from './Url'; // Adjust the import path according to your project structure

const useToken = (user) => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const email = user?.user?.email;
    const displayName = user?.user?.displayName;

    const currentUser = {
      displayName: displayName,
      email: email,
    };

    if (email) {
      fetch(`${baseURL}/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      })
        .then((res) => res.json())
        .then((data) => {
          const accessToken = data?.data?.accessToken;
          localStorage.setItem('accessToken', accessToken);
          setToken(accessToken);
        });
    }
  }, [user]);

  return [token];
};

export default useToken;
