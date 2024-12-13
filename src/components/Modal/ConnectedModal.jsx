import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modalSlice';
import Modal from './Modal';

function ConnectedModal() {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  // Check that modal.content exists and is an array
  const content = Array.isArray(modal.content) ? modal.content : [];

  return (
    <Modal isOpen={modal.isOpen} onClose={handleClose}>
      <h2>{modal.title}</h2>
      <div>
        {content.map((p, index) => (
          <p key={index}>{p}</p>
        ))}
        {/* <div dangerouslySetInnerHTML={{__html: modal.content}}/>  */}
        {/* dangerous way */}
      </div>
    </Modal>
  );
}

export default ConnectedModal;
