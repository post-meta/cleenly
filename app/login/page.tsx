'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-center mb-2">CLEENLY</h1>
          <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

          <button
            type="button"
            className="w-full h-11 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 mb-6"
          >
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link href="/signup" className="text-black font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
