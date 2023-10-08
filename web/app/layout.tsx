import '../styles/globals.css'

export const metadata = {
  title: 'Fireplace: Watch movies with friends',
  description: 'Create watch parties and watch movies with friends online in real time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-neutral-900'>{children}</body>
    </html>
  )
}
