import Modal from "./Modal";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure?",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >

      <p className="text-gray-600 mb-6">
        {message}
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Confirm
        </button>

      </div>

    </Modal>
  );
};

export default ConfirmModal;