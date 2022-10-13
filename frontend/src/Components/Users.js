import React, { useState } from 'react'
//import { Modalconfirm } from './Modal_confirm'
import image from '../Imagenes/Untitled Diagram (28).png'
import { Modal, Button } from 'react-bootstrap';


const API = process.env.REACT_APP_BACKEND
export const Users = () => {

    const [n_emisores, setN_emisores] = useState('')
    const [n_receptores, setN_receptores] = useState('')
    const [distance, setDistance] = useState('')
    const [espesor, setEspesor] = useState('')
    const [porosidad, setPorosidad] = useState('')

    const [show, setShow] = useState(false);
    // const [showf, setShowf] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    var imagen = new Image();
    //imagen.onload = imagenCargada;
    imagen.src = "../Imagenes/Untitled Diagram (27).png"
    const handleSubmit = async (e) => {
        //console.log(e)
        e.preventDefault();
        const response = await fetch(`${API}/Input_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Expose-Headers': Location,
                        },
            body: JSON.stringify({
                n_transmitter: n_emisores,
                n_receiver: n_receptores,
                distance: distance,
                plate_thickness: espesor,
                porosity: porosidad
            })
        })
        console.log(response.headers.get('Location'))
        console.log(Location)
        console.log(response.Location)

        return "response"
    }
    const datacheck = async () => {
        if (n_emisores === '' || n_receptores === ''  || espesor === '' || porosidad === '') {
            <div class="alert alert-danger">
                <strong>Danger!</strong> Indicates a dangerous or potentially negative action.
            </div>
        } else {
            handleShow()
        }

    }


    return (
        <div className="container p-4">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-md-10 mx-auto col-lg-5">
                    <form className="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Number of emitters</label>
                            <input
                                type="number"
                                className="form-control"
                                id="n_emisores"
                                placeholder="Enter your emitter number"
                                onChange={e => setN_emisores(e.target.value)}
                                value={n_emisores}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Number of receivers</label>
                            <input
                                type="number"
                                className="form-control"
                                id="n_receptores"
                                placeholder="Enter your receivers number"
                                onChange={e => setN_receptores(e.target.value)}
                                value={n_receptores}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Typical Mesh Size (mm)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="distance"
                                placeholder="Enter Typical Mesh Size"
                                onChange={e => setDistance(e.target.value)}
                                value={distance}
                                autoFocus
                                step = "0.1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Plate thickness (mm)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="espesor"
                                placeholder="Enter your plate thickness"
                                onChange={e => setEspesor(e.target.value)}
                                value={espesor}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Porosity (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                id="porosidad"
                                placeholder="Enter your Porosity"
                                onChange={e => setPorosidad(e.target.value)}
                                value={porosidad}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                            <button className="btn btn-primary my-2" onClick={datacheck}>Send data</button>
                            <a href="/" className="btn btn-secondary my-2">Back</a>
                        </div>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Succes</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>You have submitted the data for your simulation.
                                To start the simulation, you must initialise it from the view data section.</Modal.Body>
                            <Modal.Footer>
                                {/* <Button onClick={() => startSimultation(extended_data.id)}> Start Simulation </Button> */}
                                <Button variant = "primary" href="/load">Go to simulation</Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>

                            </Modal.Footer>
                        </Modal>
                    </form>

                </div>
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold" align="center">Summary Diagram</h1>
                    <img src={image}></img>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};