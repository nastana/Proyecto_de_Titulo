import React, { useState } from 'react'
//import { Modalconfirm } from './Modal_confirm'
import image from '../Imagenes/Untitled Diagram (28).png'
import { Modal, Button } from 'react-bootstrap';


const API = process.env.REACT_APP_BACKEND
export const Users = () => {

    const [sim_name, setSim_name] = useState('')
    const [sens_distance, setSens_distance] = useState('')
    const [sens_gap, setSens_gap] = useState('')
    const [sens_edge_margin, setSens_edge_margin] = useState('')
    const [n_emisores, setN_emisores] = useState('')
    const [n_receptores, setN_receptores] = useState('')
    const [distance, setDistance] = useState('')
    const [espesor, setEspesor] = useState('')
    const [porosidad, setPorosidad] = useState('')
    const [attenuation, setAttenuation] = useState('')

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
                porosity: porosidad,
                status: "Not started"
            })
        })
        console.log(response.headers.get('Location'))
        console.log(Location)
        console.log(response.Location)

        return "response"
    }
    const datacheck = async () => {
        if (n_emisores === '' || n_receptores === ''  || espesor === '' || porosidad === '') {
            <div className="alert alert-danger">
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
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="card-title">Enter Simulation Parameters</h5>
                            </div>
                            <div className="col-6 d-md-flex justify-content-md-end">
                                <button className="btn btn-primary">Info</button>
                            </div>
                        </div>
                        <hr/>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <div className="row mb-2">
                                    <div className="col-5">
                                        <label htmlFor="sim_name" className="col-form-label">Sim. Name:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="sim_name"
                                            placeholder="Enter a simulation name"
                                            onChange={e => setSim_name(e.target.value)}
                                            value={sim_name}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
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
                                            onChange={e => setN_emisores(e.target.value)}
                                            value={n_emisores}
                                            min = "0"
                                            autoFocus
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
                                            onChange={e => setN_receptores(e.target.value)}
                                            value={n_receptores}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row mb-2">
                                    <div className="col-5">
                                        <label htmlFor="sens_distance" className="col-form-label">Sensor Distance:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sens_distance"
                                            placeholder="Enter the sensor distance"
                                            onChange={e => setSens_distance(e.target.value)}
                                            value={sens_distance}
                                            autoFocus
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
                                        <label htmlFor="sens_gap" className="col-form-label">Sensor Gap:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sens_gap"
                                            placeholder="Enter the sensor gap"
                                            onChange={e => setSens_gap(e.target.value)}
                                            value={sens_gap}
                                            autoFocus
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
                                        <label htmlFor="sens_edge_margin" className="col-form-label">Sensor Edge Margin:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sens_edge_margin"
                                            placeholder="Enter the sensor edge margin"
                                            onChange={e => setSens_edge_margin(e.target.value)}
                                            value={sens_edge_margin}
                                            autoFocus
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
                                        <label htmlFor="distance" className="col-form-label">Typical Mesh Size:</label>
                                    </div>
                                    <div className="col-6">
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
                                            onChange={e => setEspesor(e.target.value)}
                                            value={espesor}
                                            autoFocus
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
                                            placeholder="Enter your Porosity"
                                            onChange={e => setPorosidad(e.target.value)}
                                            value={porosidad}
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    <div className="col-1">
                                        <label className="d-md-flex justify-content-md-end col-form-label">%</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row mb-2">
                                    <div className="col-5">
                                        <label htmlFor="attenuation" className="col-form-label">Attenuation:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="attenuation"
                                            placeholder="Enter the attenuation"
                                            onChange={e => setAttenuation(e.target.value)}
                                            value={attenuation}
                                            autoFocus
                                            disabled
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