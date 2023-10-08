import dynamic from 'next/dynamic'

const ComponentWithNoSSR = dynamic(() => import('../components/Login'), {
  ssr: false
})

export default function LoginPage() {
  return (
    <div>
      <ComponentWithNoSSR />
    </div>
  )
}
