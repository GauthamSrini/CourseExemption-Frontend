import React from 'react';
import './styles/error.css'
import img from '/rafiki.svg'

const Error404 = () => {
  return (
    <div className='Page'>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default Error404;