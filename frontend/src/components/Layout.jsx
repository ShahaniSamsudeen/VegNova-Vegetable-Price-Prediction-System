import Header from "./Header";
import Footer from "./Footer";
import ResponsiveWrapper from "../components/ResponsiveWrapper";

function Layout({ children }) {
  return (
    <>
      <Header />

{children}


  <Footer />

    </>
  );
}

export default Layout;