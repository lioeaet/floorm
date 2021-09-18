import React from 'react'
import { Link } from 'react-router-dom'

const Page = ({ children }) =>
  <>
    <Link to='/'>index</Link>
    <div style={{ margin: '0 auto' }}>
      {children}
    </div>
    <br />
    <Link to='/'>index</Link>
  </>

export default Page
