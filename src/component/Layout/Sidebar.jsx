import React, { useState } from 'react';
import { Layout, Menu, Image } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { sidebarMenus, sidebarMenusAll } from '../../routes';
import logo from '../../public/logo.png';
import { ThemeContext } from '../../context';

const { Sider } = Layout;

function getKeyByPath(array, path) {
  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    if (item.children && item.children.length > 0) {
      const key = getKeyByPath(item.children, path);
      if (key) {
        return key;
      }
    } else if (path === item.key) {
      return item.key;
    }
  }
  return null;
}

function getOpenKeys(array, pathname) {
  const currentKey = getKeyByPath(array, pathname); // '/form/pro-form'
  const keys = currentKey.split('/'); // ['', 'form', 'pro-form']
  const openKeys = keys.length > 2 ? keys.slice(1, 2) : [];

  return openKeys;
}

export default () => {
  const { theme, collapsed, toggleCollapsed, fixedSidebar } = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(getOpenKeys(sidebarMenusAll, location.pathname));
  const onSelect = (e) => {
    navigate(`${e.key}`);

    setOpenKeys(getOpenKeys(sidebarMenusAll, e.key));
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => toggleCollapsed(value)}
      className={`site-layout-sider ${fixedSidebar ? 'site-layout-sider-fixed' : ''}`}
      theme={theme}
    >
      <div className="logo-wrap justify-center">
        {/* <img src={logo} className="app-logo" alt="logo" /> */}
        {!collapsed && (
          <div className={`logo-title logo-title-${theme}`}>
            <Image src={logo} height={60} alt="logo" preview={false} />
          </div>
        )}
      </div>
      <Menu
        defaultSelectedKeys={[getKeyByPath(sidebarMenusAll, location.pathname)]}
        openKeys={openKeys}
        mode="inline"
        items={sidebarMenus}
        onClick={onSelect}
        onSelect={onSelect}
        theme={theme}
        onOpenChange={(keys) => setOpenKeys(keys)}
      />
    </Sider>
  );
};
