import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="main-content">
      <div className="content-overlay" />
      <div className="content-wrapper">
        <section className="auth-height">
          <div className="container-fluid">
            <div className="row full-height-vh">
              <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="row">
                  <div className="col-12 text-center flex flex-col items-center justify-center">
                    <img
                      src="/img/error.png"
                      alt="not found"
                      className="img-fluid error-img mt-2"
                      height={300}
                      width={400}
                    />
                    <h1 className="mt-4">404 - Хуудас олдсонгүй!</h1>
                    <div className="w-75 error-text mx-auto mt-4">
                      <p>
                        Таны хайж буй хуудсыг устгасан, нэрийг нь өөрчилсөн,
                        хандах эрх хүрэхгүй эсвэл түр ашиглах боломжгүй байна.
                      </p>
                    </div>

                    <Link
                      to={"/"}
                      className="btn btn-warning my-2 tracking-wider"
                    >
                      Буцах
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(NotFound);
