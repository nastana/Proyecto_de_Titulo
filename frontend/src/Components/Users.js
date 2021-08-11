import React, { useState } from 'react'
//import { Modalconfirm } from './Modal_confirm'
import image from '../Imagenes/Untitled Diagram (28).png'
import { Modal, Button } from 'react-bootstrap';


const API = process.env.REACT_APP_BACKEND;

export const Users = () => {

    const [n_emisores, setN_emisores] = useState('')
    const [n_receptores, setN_receptores] = useState('')
    const [distance, setDistance] = useState('')
    const [espesor, setEspesor] = useState('')
    const [porosidad, setPorosidad] = useState('')

    var imagen = new Image();
    //imagen.onload = imagenCargada;
    imagen.src = "../Imagenes/Untitled Diagram (27).png"
    const handleSubmit = async (e) => {
        //console.log(e)
        e.preventDefault();
        await fetch(`${API}/Input_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                n_transmitter: n_emisores,
                n_receiver: n_receptores,
                distance: distance,
                plate_thickness: espesor,
                porosity: porosidad
            })
        })
        console.log("ok")

    }

    return (
        <div className="container p-4">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-md-10 mx-auto col-lg-5">
                    <form className="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Number of emitters</label>
                            <input
                                type="text"
                                className="form-control"
                                id="n_emisores"
                                placeholder="Enter your emitter number"
                                onChange={e => setN_emisores(e.target.value)}
                                value={n_emisores}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Number of receivers</label>
                            <input
                                type="text"
                                className="form-control"
                                id="n_receptores"
                                placeholder="Enter your receivers number"
                                onChange={e => setN_receptores(e.target.value)}
                                value={n_receptores}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Distance betwen last emitter and first receiver (mm)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="distance"
                                placeholder="Enter your Distance"
                                onChange={e => setDistance(e.target.value)}
                                value={distance}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Plate thickness (mm)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="espesor"
                                placeholder="Enter your plate thickness"
                                onChange={e => setEspesor(e.target.value)}
                                value={espesor}
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2" className="form-label">Porosity (%)</label>
                            <input
                                type="text"
                                className="form-control"
                                id="porosidad"
                                placeholder="Enter your Porosity"
                                onChange={e => setPorosidad(e.target.value)}
                                value={porosidad}
                                autoFocus
                            />
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                            <button type="submit" className="btn btn-primary my-2" >Submit</button>
                            <button type="button" className="btn btn-primary my-2" data-bs-toggle="modal" data-bs-target="#myModal">test</button>
                            <a href="/" className="btn btn-secondary my-2">Back</a>
                        </div>
                    </form>
                </div>
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 mb-3">Image representative</h1>
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