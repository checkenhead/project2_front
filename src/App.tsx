import '@/styles/common.scss'
import { BrowserRouter } from 'react-router-dom'
import RouterRoot from '@/pages/router_root'
import PopupPortal from '@/components/global/popup_portal'

function App() {

  return (
    <>
      <BrowserRouter>
        <RouterRoot />
        <PopupPortal />
      </BrowserRouter>
    </>
  )
}

export default App
