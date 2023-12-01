import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../Components/Styles/AlertModal.css"

const AlertModal = ({ title, body, buttonLabel, variant }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    window.location.href = "/";
  };

  return (
    <>
      <Modal
        className="alertModal"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant={variant} onClick={handleClose}>
            {buttonLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlertModal;
