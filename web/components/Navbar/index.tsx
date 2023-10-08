import { Session } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'

import LogoutButton from './LogoutButton'

interface NavbarProps {
  session: Session | null
}

const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className='bg-neutral-900 flex justify-between items-center px-10 pt-2'>
      <Link
        href={session ? '/app' : '/'}
      >
        <Image
          src="/Logo.png"
          alt="fireplace logo"
          height={50}
          width={160}
        />
      </Link>

      {session ? <LogoutButton /> : null } 
    </nav>
  )
}


export default Navbar
