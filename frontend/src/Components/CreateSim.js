import React, { useState } from 'react'
import image from '../Imagenes/Untitled Diagram (28).png'
import { Modal, Button } from 'react-bootstrap';

const API = process.env.REACT_APP_BACKEND

export const CreateSim = () => {
    const [n_emitters, setN_emitters] = useState('')
    const [n_receivers, setN_receivers] = useState('')
    const [mesh_size, setMeshSize] = useState('')
    const [plate_thickness, setThickness] = useState('')
    const [porosity, setPorosity] = useState('')
    
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
                n_emitters: parseInt(n_emitters),
                n_receivers: parseInt(n_receivers),
                mesh_size: parseFloat(mesh_size),
                plate_thickness: parseInt(plate_thickness),
                porosity: parseFloat(porosity),
            })
        })
        console.log(response.headers.get('Location'))
        console.log(Location)
        console.log(response.Location)

        return "response"
    }
    const datacheck = async () => {
        if (n_emitters === '' || n_receivers === ''  || plate_thickness === '' || porosity === '') {
            <div className="alert alert-danger">
                <strong>Danger!</strong> Indicates a dangerous or potentially negative action.
            </div>
        } else {
            handleShow()
        }

    }

    return (
        <div className="container p-4">
            <div className="row align-items-center g-lg-5 py-2">
                <div className="col-md-10 align-middle mx-auto col-lg-5">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h5 className="card-title">Enter Simulation Parameters</h5>
                                </div>
                            </div>
                            <hr/>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <div className="row mb-2">
                                        <div className="col-5">
                                            <label htmlFor="n_emisores" className="col-form-label">N° Emitters:</label>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="n_emisores"
                                                placeholder="Enter your emitter number"
                                                onChange={e => setN_emitters(e.target.value)}
                                                value={n_emitters}
                                                min = "0"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row mb-2">
                                        <div className="col-5">
                                            <label htmlFor="n_receptores" className="col-form-label">N° Receivers:</label>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="n_receptores"
                                                placeholder="Enter your receivers number"
                                                onChange={e => setN_receivers(e.target.value)}
                                                value={n_receivers}
                                                min = "0"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row mb-2">
                                        <div className="col-5">
                                            <label htmlFor="distance" className="col-form-label">Typical Mesh Size:</label>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="distance"
                                                placeholder="Enter Typical Mesh Size"
                                                onChange={e => setMeshSize(e.target.value)}
                                                value={mesh_size}
                                                step = "0.1"
                                                min = "0"
                                                required
                                            />
                                        </div>
                                        <div className="col-1">
                                            <label className="d-md-flex justify-content-md-end col-form-label">mm</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row mb-2">
                                        <div className="col-5">
                                            <label htmlFor="espesor" className="col-form-label">Plate Thickness:</label>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="espesor"
                                                placeholder="Enter your plate thickness"
                                                onChange={e => setThickness(e.target.value)}
                                                value={plate_thickness}
                                                min = "0"
                                                required
                                            />
                                        </div>
                                        <div className="col-1">
                                            <label className="d-md-flex justify-content-md-end col-form-label">mm</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="row mb-2">
                                        <div className="col-5">
                                            <label htmlFor="porosidad" className="col-form-label">Porosity</label>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="porosidad"
                                                placeholder="Enter porosity percentage"
                                                onChange={e => setPorosity(e.target.value)}
                                                value={porosity}
                                                min = "0"
                                                required
                                            />
                                        </div>
                                        <div className="col-1">
                                            <label className="d-md-flex justify-content-md-end col-form-label">%</label>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="gap-4 d-md-flex justify-content-md-end">
                                    <a href="/" className="btn btn-secondary my-2">Back</a>
                                    <button className="btn btn-primary my-2" onClick={datacheck}>Send data</button>
                                </div>

                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Success</Modal.Title>
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
                    </div>
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