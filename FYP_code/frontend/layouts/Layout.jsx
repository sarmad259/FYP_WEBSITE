import { useLocation } from 'react-router-dom';
import { LandingNavbar, Navbar, Footer } from '../src/index';

const Layout = ({ children, role, setRole }) => {
    const location = useLocation();

    const noNavbar = ['/login', '/admin/registration', '/forgot-password', '/admin/workflow', `/${role}/change-password`];
    const noFooterRoutes = ['/admin', '/student', '/login', '/admin/registration', `/${role}/forgot-password`, '/admin/workflow', `/${role}/change-password`];
    const hideFooter = noFooterRoutes.includes(location.pathname);
    const hideNavbar = noNavbar.includes(location.pathname);
    const isLandingPage = location.pathname === '/';

    const showSidebar = !isLandingPage && !hideNavbar;

    return (
        <div className="min-h-screen flex flex-col font-sans text-white relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: '#000000' }} />
            </div>

            {isLandingPage ? (
                null  /* Home.jsx manages its own navbar — no LandingNavbar needed */
            ) : (
                hideNavbar ? null : <Navbar role={role} setRole={setRole} />
            )}

            {/* 
              - Mobile: pt-20 so content clears the fixed top bar.
              - Desktop: sidebar-offset (padding-left: 268px) so content 
                clears the fixed left sidebar.
            */}
            <main className={`flex-grow relative z-10 ${showSidebar ? 'pt-20 md:pt-0 sidebar-offset' : ''}`}>
                {children}
            </main>

            {!hideFooter && <Footer />}
        </div>
    );
};

export default Layout;
