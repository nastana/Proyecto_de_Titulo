import React, { useEffect, useState } from 'react'

const API = process.env.REACT_APP_BACKEND;

export const Load = () => {

    const [sim, setSim] = useState([])

    const getSim = async () => {
        const res = await fetch(`${API}/Load_data`)
        const data = await res.json();
        setSim(data)
        console.log(data)
    }
    useEffect(() => {
        getSim();
    }, [])
    return (
        <div>
            <div className="col md-5">
                <table className="table table-strip">
                    <thead>
                        <tr>
                            <th>Number of emitters</th>
                            <th>Number of receivers</th>
                            <th>Distance betwen last emitter and first receiver</th>
                            <th>Plate thickness</th>
                            <th>Porosity</th>
                            <th>Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sim.map(sim => (
                            <tr key={sim.id}>
                                <td>${sim.n_transmitter}</td>
                                <td>${sim.n_receiver}</td>
                                <td>${sim.distance}</td>
                                <td>${sim.plate_thickness}</td>
                                <td>${sim.porosity}</td>
                                <td>
                                    <a href="TimeSimP6TransIsoW1.0M350" download>
                                    <button type="button" className="btn btn-primary my-2" >
                                        Download results
                                    </button>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};