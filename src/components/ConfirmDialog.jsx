import Modal from './Modal.jsx';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onClose, children }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{message}</p>
      {children}
      <div className="acts">
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'd' : 'p'}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
