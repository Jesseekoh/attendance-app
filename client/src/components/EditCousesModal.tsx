import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { api } from '../api/axiosClient';
const EditCousesModal = () => {
  const courseModal = useRef<HTMLDialogElement>(null);
  const { data, isError, isLoading } = useQuery({
    queryKey: ['all-courses'],
    queryFn: async () => {
      return api.get('/courses').then((data) => {
        console.log(data);
        return data.data;
      });
    },
  });

  const openModal = () => {
    courseModal.current?.showModal();
  };
  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Enroll courses
      </button>
      <dialog
        id="my_modal_5"
        ref={courseModal}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <select>{}</select>
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditCousesModal;
