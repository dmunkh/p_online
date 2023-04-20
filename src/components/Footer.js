import React from "react";

const Footer = () => {
  return (
    // <footer className="footer undefined undefined">
    //   <p className="clearfix text-muted m-0">
    //     © {new Date().getFullYear()} <i>ХМТА цех</i>
    //   </p>
    // </footer>
    // <footer className="footer">
    //   <p className="clearfix text-muted m-0">
    //     © {new Date().getFullYear()} ХМТАЦ, Зохиогчийн эрхээр хамгаалагдсан.
    //   </p>
    // </footer>
    <div className="flex justify-center">
      
      © {new Date().getFullYear()} <i>ХМТА цех</i>
    </div>
  );
};

export default React.memo(Footer);
