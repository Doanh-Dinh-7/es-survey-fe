import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const MainLayout: React.FC = () => {
  const location = useLocation();
  //   const isFooterRequired = location.pathname !== "/";

  function smoothScrollToTop(duration = 800) {
    const start = window.scrollY;
    const startTime = performance.now();

    function scrollStep(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // từ 0 -> 1
      const easeInOutQuad =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, start * (1 - easeInOutQuad));

      if (elapsed < duration) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  }

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    smoothScrollToTop(1000);
  }, [location.pathname]);

  return (
    <Box
      width="100%"
      minHeight="100vh"
      bg="background"
      boxShadow="lg"
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Header />
      <div style={{ width: "100%", height: "100%", padding: "20px" }}>
        <Outlet />
      </div>
      <Footer />
    </Box>
  );
};

export default MainLayout;
