import React from 'react';
import './Modal.css';

export default function Modal(props) {
    return (
        <div className="modal">
            <header className="modal__header"><h1>{props.title}</h1></header>
            <section className="modal__content">
                {props.children}
            </section>
            <section className="modal__actions">
                {props.canCancel && <button className="btn" onClick={props.modalCancel}>{props.cancelText}</button>}
                {props.canConfirm && <button className="btn" onClick={props.modalConfirm}>{props.confirmText}</button>}
            </section>
        </div>
    )
}
