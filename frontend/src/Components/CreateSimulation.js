import React, { useState } from 'react'
//import { Modalconfirm } from './Modal_confirm'
import image from '../Imagenes/Untitled Diagram (28).png'
import { Modal, Button } from 'react-bootstrap';
import Modali, { useModali } from 'modali';
import {ModalInfo} from './ModalInfo';

const API = process.env.REACT_APP_BACKEND
export const CreateSimulation = () => {
    const [sim_name, setSim_name] = useState('')
    const [n_emitters, setN_emitters] = useState('')
    const [n_receivers, setN_receivers] = useState('')
    const [sens_distance, setSens_distance] = useState('')
    const [emitters_pitch, setEmitter_pitch] = useState('')
    const [receivers_pitch, setReceivers_pitch] = useState('')
    const [sens_edge_margin, setSens_edge_margin] = useState('')
    const [mesh_size, setMeshSize] = useState('')
    const [plate_thickness, setThickness] = useState('')
    const [porosity, setPorosity] = useState('')
    const [attenuation, setAttenuation] = useState('')
    const [sensor_width, setSensor_width] = useState('')
    
    const [show, setShow] = useState(false);
    // const [showf, setShowf] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [errorAlert, setErrorAlert] = useState(null);
    
    var imagen = new Image();
    //imagen.onload = imagenCargada;
    imagen.src = "../Imagenes/Untitled Diagram (27).png"
    
    const [modalInfo, toggleModalInfo] = useModali({
        animated: true,
        overflow: true,
        centered: true,
        large: true,
        title: "Parameter's Description",
        buttons: [
          <Modali.Button
            label="Close"
            isStyleDefault
            onClick={() => toggleModalInfo()}
          />,
        ],
      });
    
    const handleSubmit = async (e) => {
        //console.log(e)
        e.preventDefault();

        if (errorAlert) {
            return; // Stop execution if there is an error
        }

        const formData = {
            sim_name: sim_name,
            n_emitters: parseInt(n_emitters),
            n_receivers: parseInt(n_receivers),
            sensor_width: parseFloat(sensor_width),
            sens_distance: parseFloat(sens_distance),
            emitters_pitch: parseInt(emitters_pitch),
            receivers_pitch: parseInt(receivers_pitch),
            sens_edge_margin: parseFloat(sens_edge_margin),
            mesh_size: parseFloat(mesh_size),
            plate_thickness: parseInt(plate_thickness),
            porosity: parseFloat(porosity),
            attenuation: attenuation,
            status: 0
        };

        const response = await fetch(`${API}/Input_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                        },
            body: JSON.stringify(formData)
        })

        console.log(JSON.stringify(formData))
        console.log(response.body)
        debugger

        return "response"
    }

    const datacheck = async () => {
        // Limpiar el mensaje de error al iniciar la validación
        setErrorAlert(null);

        if (
            n_emitters === '' ||
            n_receivers === '' ||
            plate_thickness === '' ||
            porosity === '' ||
            attenuation === '' ||
            sensor_width === '' ||
            sens_distance === '' ||
            emitters_pitch === '' ||
            receivers_pitch === '' ||
            sens_edge_margin === '' ||
            mesh_size === ''
        ) {
            setErrorAlert(
                <div className="alert alert-danger">
                    <strong>Please fill all the fields.</strong>
                </div>
            );
            return;
        }
    
        if (parseInt(n_emitters) >= parseInt(n_receivers)) {
            setErrorAlert(
                <div className="alert alert-danger" role="alert">
                    <strong>The number of emitters must be greater than the number of receivers.</strong>
                </div>
            );
            return;
        }

        if (parseFloat(sens_edge_margin) !== parseInt(sens_edge_margin) ||
            parseFloat(emitters_pitch) !== parseInt(emitters_pitch)
            ) {
            setErrorAlert(
                <div className="alert alert-danger" role="alert">
                    <strong>The values of Edge Margin and Emitters Pitch must be integers.</strong>
                </div>
            );
            return;
        }
    
        handleShow();

    }

    return (
        <div className="container p-4">
            <div className="row align-items-center g-lg-5 py-2">
                <div className="col-md-10 mx-auto col-lg-5">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="card-title">Enter Simulation Parameters</h5>
                            </div>
                            <div className="col-6 d-md-flex justify-content-md-end">
                                <button className='btn btn-primary' onClick={toggleModalInfo}>
                                    Info
                                </button>
                                <Modali.Modal {...modalInfo}>
                                    <ModalInfo/>
                                </Modali.Modal>
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
                                            onChange={e => setN_emitters(e.target.value)}
                                            value={n_emitters}
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row mb-2">
                                    <div className="col-5">
                                        <label htmlFor="sens_distance" className="col-form-label">Distance Between Arrays:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sens_distance"
                                            placeholder="Enter the distance between arrays"
                                            onChange={e => setSens_distance(e.target.value)}
                                            value={sens_distance}
                                            step = "0.01"
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                        <label htmlFor="emitters_pitch" className="col-form-label">Emitters Pitch:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="emitters_pitch"
                                            placeholder="Enter the emitter pitch"
                                            onChange={e => setEmitter_pitch(e.target.value)}
                                            value={emitters_pitch}
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                        <label htmlFor="receivers_pitch" className="col-form-label">Receivers Pitch:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="receivers_pitch"
                                            placeholder="Enter the receiver pitch"
                                            onChange={e => setReceivers_pitch(e.target.value)}
                                            value={receivers_pitch}
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                        <label htmlFor="sens_edge_margin" className="col-form-label">Edge Margin:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sens_edge_margin"
                                            placeholder="Enter the edge margin"
                                            onChange={e => setSens_edge_margin(e.target.value)}
                                            value={sens_edge_margin}
                                            step = "0.01"
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                            onChange={e => setMeshSize(e.target.value)}
                                            value={mesh_size}
                                            step = "0.01"
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                        <label htmlFor="width" className="col-form-label">Sensor Width:</label>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="width"
                                            placeholder="Enter your sensor width"
                                            onChange={e => setSensor_width(e.target.value)}
                                            value={sensor_width}
                                            step = "0.01"
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
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
                                            step = "0.01"
                                            min = "0"
                                            required
                                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                            onWheel={e => e.currentTarget.blur()}
                                        />
                                    </div>
                                    <div className="col-1">
                                        <label className="d-md-flex justify-content-md-end col-form-label">%</label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row mb-2 align-items-center">
                                    <div className="col-5">
                                        <label htmlFor="attenuation" className="col-form-label">Attenuation:</label>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="attenuation"
                                                id="attenuationYes"
                                                value="1"
                                                onChange={e => setAttenuation(e.target.value)}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="attenuationYes">Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="attenuation"
                                                id="attenuationNo"
                                                value="0"
                                                onChange={e => setAttenuation(e.target.value)}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="attenuationNo">No</label>
                                        </div>
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
                    <hr />
                    <h1 className="display-4 fw-bold" align="center">Summary Diagram</h1>
                    <img src={image}></img>
                    <hr />
                    <div>
                        {errorAlert}
                    </div>
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