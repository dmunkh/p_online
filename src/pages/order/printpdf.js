// printpdf.js (or whatever the filename is)
import React from "react";
// import { Modal, Button } from "antd";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfModal = ({ show, handleClose, pdfBlob }) => {
  // <Modal show={show} onHide={handleClose} size="lg">
  //   <Modal.Header closeButton>
  //     <Modal.Title>PDF Preview</Modal.Title>
  //   </Modal.Header>
  //   <Modal.Body>
  //     {pdfBlob && (
  //       <Worker
  //         workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}
  //       >
  //         <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
  //       </Worker>
  //     )}
  //   </Modal.Body>
  //   <Modal.Footer>
  //     <Button variant="secondary" onClick={handleClose}>
  //       Close
  //     </Button>
  //   </Modal.Footer>
  // </Modal>
  return <></>;
};

export default PdfModal; // Ensure default export here
