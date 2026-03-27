// src/app/login/page.js (or wherever your login page is located)
'use client'

import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { authAPI, setCookie } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Client-side validation
    if (!email || !password) {
      setError('Please enter both email and password.')
      toast.error('Please enter both email and password.')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      toast.error('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(email, password)

      console.log('Login successful:', response)

      // The token is now stored automatically in the login function
      // But let's double-check
      if (response.token) {
        console.log('Token stored successfully')
      }

      toast.success('Login Successful!')

      // Redirect based on user role
      if (response.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/admin')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err?.message || 'Invalid email or password. Please try again.')
      toast.error(
        err?.message || 'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-white p-8'>
      <Toaster position='top-center' reverseOrder={false} />

      {/* Left Panel */}
      <div className='hidden lg:flex w-1/2 bg-[#ffffff] items-center border-[2px] border-[#036BB4] justify-center p-8'>
        <div className='text-center'>
          <img
            src='/admin-logo.png'
            alt='TikaFood Logo'
            className='mx-auto mb-4 max-w-full h-auto'
            onError={e => {
              e.currentTarget.src =
                'https://placehold.co/600x400/BA2721/FFFFFF?text=Image+Not+Found'
            }}
          />
        </div>
      </div>

      {/* Right Login Panel */}
      <div className='w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-8'>
        <div className='md:w-[564px] bg-white p-10 rounded-[15px] flex flex-col justify-center items-center gap-10'>
          <div className='self-stretch flex flex-col justify-start items-center gap-[30px]'>
            <div className='self-stretch flex flex-col justify-center items-center gap-[30px]'>
              <div className='w-full flex flex-col justify-start items-center gap-[18px]'>
                <h2 className='self-stretch text-center text-[#036BB4] text-2xl font-bold font-[Open_Sans]'>
                  Login to Account
                </h2>
                <p className='self-stretch text-center text-[#5C5C5C] text-sm font-normal font-[Open_Sans]'>
                  Please enter your email and password to continue
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className='w-full flex flex-col items-end gap-[18px]'
              >
                <div className='self-stretch flex flex-col justify-start items-start gap-[18px]'>
                  {/* Email Input */}
                  <div className='self-stretch flex flex-col justify-start items-start gap-2'>
                    <label
                      htmlFor='email'
                      className='self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]'
                    >
                      Email address
                    </label>
                    <input
                      type='email'
                      id='email'
                      className='self-stretch h-10 w-full px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]'
                      placeholder='Enter your email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {/* Password Input */}
                  <div className='self-stretch flex flex-col justify-start items-start gap-2'>
                    <label
                      htmlFor='password'
                      className='self-stretch text-[#5C5C5C] text-sm font-normal font-[Open_Sans]'
                    >
                      Password
                    </label>
                    <input
                      type='password'
                      id='password'
                      className='self-stretch h-10 px-3 py-2.5 bg-white rounded-md border border-[#DCDCDC] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#BB2821] font-[Open_Sans]'
                      placeholder='Enter your password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className='self-stretch flex justify-between items-center mt-2'>
                  <label
                    htmlFor='rememberMe'
                    className='flex items-center gap-3 cursor-pointer select-none'
                  >
                    <input
                      type='checkbox'
                      id='rememberMe'
                      className='hidden peer'
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <div className='w-[18px] h-[18px] bg-white peer-checked:bg-[#036BB4] rounded-[2px] border border-[#DCDCDC] peer-checked:border-[#036BB4] flex items-center justify-center relative'>
                      {rememberMe && (
                        <svg
                          className='w-3 h-3 text-white absolute'
                          fill='none'
                          viewBox='0 0 14 11'
                          stroke='currentColor'
                          strokeWidth='2'
                        >
                          <path d='M1 5.5L4.95263 9.5L13 1.5' />
                        </svg>
                      )}
                    </div>
                    <span className='text-[#5C5C5C] text-xs font-normal font-[Open_Sans]'>
                      Remember Password
                    </span>
                  </label>
                  <a
                    href='/forgot-password'
                    className='text-[#036BB4] text-xs font-normal font-[Open_Sans] hover:underline'
                  >
                    Forgot Password?
                  </a>
                </div>

                {error && (
                  <p className='text-red-500 text-sm text-center mt-2 font-[Open_Sans]'>
                    {error}
                  </p>
                )}

                {/* Sign In Button */}
                <button
                  type='submit'
                  className={`w-28 h-10 mx-auto mt-4 bg-[#036BB4] text-white rounded-md text-sm font-normal font-[Open_Sans] shadow-[0px_4px_4px_rgba(189,189,189,0.25)] flex justify-center items-center transition duration-300 ease-in-out hover:bg-red-700 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
