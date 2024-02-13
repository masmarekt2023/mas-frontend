import React, { Suspense, Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'
import { routes } from 'src/routes'
import {UserContextProvider} from 'src/context/User'
import PageLoading from 'src/component/PageLoading'
import AuthGuard from 'src/component/AuthGuard'
import { ThemeProvider } from '@material-ui/core'
import { CreateTheme } from 'src/theme'
import ConnectWallet from 'src/views/pages/Profile/connectWallet';
import { WalletProvider } from 'src/views/pages/Profile/WalletContext';

const RenderRoutes = routes.map((route, i) => {
  const Component = route.element
  const Guard = route.guard ? AuthGuard : Fragment
  const Layout = route.layout || Fragment
  return <Route
      key={i}
      path={route.path}
      element={
        <Guard>
          <Suspense fallback={<PageLoading />}>
            <Layout>
              <Component />
            </Layout>
          </Suspense>
        </Guard>
      }
    />
})


function App() {
  const theme = CreateTheme();
  return (
    <WalletProvider>
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <Routes>
          {RenderRoutes}
        </Routes>
      </UserContextProvider>
    </ThemeProvider>
    </WalletProvider>
  )
}

export default App
