import { Outlet, useLocation } from "react-router-dom";

export function PageFadeLayout() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-enter min-h-screen">
      <Outlet />
    </div>
  );
}
