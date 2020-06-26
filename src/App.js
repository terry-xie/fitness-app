import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import GoalPreview from './containers/GoalPreview/GoalPreview';
import Log from './containers/Log/Log';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Oauth from './components/Oauth/Oauth';
import { Layout, Menu, Result } from 'antd';
import './App.css';
import Withings from './components/Withings/Withings';
import { getSession } from './redux/selectors';
import { useSelector } from 'react-redux';
const { Header, Content } = Layout;

function App() {
  const sessionInfo = useSelector(getSession);

  return (
      <BrowserRouter>
        <Layout style={{minHeight: "100vh"}}>
          <Header style={{ position: 'fixed', zIndex: 2, width: '100%', textAlign: 'right' }}>
            <Menu theme="dark" mode="horizontal">
              {/* <Menu.Item key="1">
                <Link to="/preview">Preview</Link>
              </Menu.Item> */}
              {
                !sessionInfo.isSignedIn &&
                <Menu.Item key="4">
                  <Link to="/login">Login</Link>
                </Menu.Item>
              }
              {
                sessionInfo.isSignedIn &&
                  <Menu.Item key="2">
                    <Link to="/log">Log</Link>
                  </Menu.Item>
              }
              {
                sessionInfo.isSignedIn &&
                  <Menu.Item key="3">
                    <Logout/>
                  </Menu.Item>
              }
            </Menu>
          </Header>
          <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64}}>
            <div className="site-layout-background" style={{ padding: 24, marginBottom: 64}}>
              <Switch>
                <Route path="/log">
                  <ProtectedRoute>
                    {
                      sessionInfo.oauthProvider === 'google' ? <Log/> : <Withings/>
                    }
                  </ProtectedRoute>
                </Route>
                <Route path="/withings">
                  <Withings/>
                </Route>
                <Route exact path="/login">
                  <Login/>
                </Route>
                <Route exact path="/preview">
                  <GoalPreview/>
                </Route>
                <Route exact path="/oauth">
                  <Oauth/>
                </Route>
                <Route exact path="/error">
                  <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, something went wrong."
                    extra={<Link to="/">Back Home</Link>}
                  />
                </Route>
                <Route exact path="/">
                  {
                    sessionInfo.isSignedIn ? <Log/> : <Login/>
                  }
                </Route>
                <Route>
                  <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visted does not exist."
                    extra={<Link to="/">Back Home</Link>}
                  />
                </Route>
              </Switch>
            </div>
          </Content>
        </Layout>
      </BrowserRouter>
  )
}

export default App;
