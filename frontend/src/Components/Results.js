import React, { useState } from 'react';
import Graph from './../Imagenes/result_test_1.png';
import { Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";

const API = process.env.REACT_APP_BACKEND;

export const Results = () => {

    const [dataDownload, setdataDownload] = useState([]);
    const { id } = useParams();

    console.log(id);

    const downloadSimulation = async (id) => {
        const resDownload = await fetch(`${API}/Load_data/download/${id}`)
        const aer = await resDownload.json()
        console.log("a", aer)
        setdataDownload(aer)
    }


    return (
        <section className="py-5 container">
            <div className='row'>
                <div className='col'>
                    <h2> Graphs for Simulation: </h2>
                </div>
                <div className='col d-md-flex justify-content-md-end'>
                    <Button className='me-3' variant="primary" onClick={() => downloadSimulation(id)}>Download</Button>{' '}
                    <a href="/load" className="btn btn-secondary">Go Back</a>
                </div>
            </div>
            <hr />
            <div class="row mb-5">
                <div class="col">
                    <div class="card mb-3">
                        <img src={Graph} className="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title text-center">Figure 1: Description</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3">
                        <img src={Graph} className="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title text-center">Figure 1: Description</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3">
                        <img src={Graph} className="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title text-center">Figure 1: Description</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col">
                    <div class="card mb-3">
                        <img src={Graph} className="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title text-center">Figure 1: Description</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3">
                        <img src={Graph} className="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title text-center">Figure 1: Description</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3">
                        <img src={Graph} className="card-img-top" alt="..."/>
                        <div class="card-body">
                            <h5 class="card-title text-center">Figure 1: Description</h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};