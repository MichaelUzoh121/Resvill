import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

function Layout() {
  return (
    <div>
      <Toaster position="top-center" />
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout