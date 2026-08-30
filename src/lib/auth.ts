import { authOptions } from '@/auth/config';
import { getServerSession } from 'next-auth'

import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    return session 
  } catch (error) {
    return null
  }
}

export async function requireUser() {
  const session = await getCurrentUser()
  if (!session) redirect('/login')
  return session
}


