import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useRoutes } from 'react-router'
import SplashScreen from './ui/SplashScreen'
import { routes } from './routes'

const App = () => 
  <Suspense fallback={<SplashScreen />}>
    {useRoutes(routes)}
  </Suspense>

export default () => {
  return (
    <BrowserRouter timeoutMs={8000}>
      <App />
    </BrowserRouter>
  )
}
