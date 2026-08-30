import { authOptions } from '@/auth/config';
import {getServerSession} from 'next-auth'

import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  let session;

  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    return null   
  }

  if (!session) redirect('/login') 

  return session
}


