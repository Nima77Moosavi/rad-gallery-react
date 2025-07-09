import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel";
import styles from "./UserPanel.module.css";

const UserPanel = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <aside className={styles.sidebar}>
          <SidebarUserPanel />
        </aside>
        <div className={styles.content}>
          <Outlet />
        </div>
        
      </div>
    </div>
  );
};

export default UserPanel;
