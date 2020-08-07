import React , {useState}from 'react';
import Modal from '../cmpnt/modal/Modal'
import Backdrop from '../cmpnt/backdrop/Backdrop'
export default function Events() {

    const [modalState, setModalState] = useState(false);

    const startEventModal = () => {
        setModalState(!modalState);
    }
    const endEventModal = () => {
        setModalState(!modalState);
    }

    return (
        <>
        <div>
            <h2>Events</h2>
            <button className="btn" onClick={startEventModal}> Add Event</button>
        </div>
        {modalState && <Backdrop />}
        {modalState && <Modal title="Add Event" canCancel canConfirm endEventModal = {endEventModal}>huh</Modal>}
        </>
    )
}
