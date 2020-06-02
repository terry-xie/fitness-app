import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import Log from '../../containers/Log/Log';
import GoalPreview from '../../containers/GoalPreview/GoalPreview';
import './Main.css';
const { Header, Content, Footer } = Layout;


const Main = () => 
  <BrowserRouter>
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', textAlign: 'right' }}>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">
            <Link to="/log">Logs</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/">Preview</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          <Switch>
            <Route path="/log">
              <Log/>
            </Route>
            <Route path="/">
              <GoalPreview/>
            </Route>
          </Switch>
        </div>
      </Content>
    </Layout>
  </BrowserRouter>


export default Main;