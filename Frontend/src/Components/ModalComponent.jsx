import { Modal} from "react-bootstrap";
import "./modal.css";
export default function ModalComponent({ show, onHide, deal }) {
  if (!deal) return null;

  const { header, description} = deal.info;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <span style={{ fontSize: "20px", color: "black" }}>Get {header}</span>
          <br />
          <small style={{ fontSize: "14px", color: "#555" }}>
            {description}
          </small>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ fontSize: "14px", color: "#02060CBF" }}>
        <p>Terms and Conditions</p>
        <ul className="modal-body-ul">
          <li>
             Offer will be applicable automatically.
          </li>
          <li>
             Offer is only valid on select restaurants.
          </li>
          <li>
             Other T&Cs may apply.
          </li>
          <li>
            Offer valid till Jul 31, 2025 11:59 PM.
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  );
}
