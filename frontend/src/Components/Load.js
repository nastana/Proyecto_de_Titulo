import React, { useEffect, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
//import {Alert} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import Col from "react-bootstrap/Col";
import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";
import Pagination from './Pagination';
import Badge from 'react-bootstrap/Badge';

const API = process.env.REACT_APP_BACKEND;
console.log(API);

export const Load = () => {

    const [sim, setSim] = useState([]);
    const [extended_data, setExtended_Data] = useState([]);
    const [search, setSearch] = useState('');
    const [searchInput, setsearchInput] = useState('');

    const [currentPage, setCurentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(10);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [showModalInprogress, setShowModalInProgress] = useState(false);
    const handleCloseModalInProgress = () => setShowModalInProgress(false);
    const handleShowModalInProgress = () => setShowModalInProgress(true);


    const getSim = async (v) => {
        if (v === 0 || searchInput === '') {

            const res = await fetch(`${API}/Load_data`)
            const data = await res.json();
            setSim(data)
            var maxlength = data.length
            var cantpag = Math.trunc(data.length / 10)

        }
        else if (v === "ID") {
            console.log("Consulta Id")
            const res = await fetch(`${API}/Load_data/${searchInput}`)
            const data = await res.json()
            setSim(data)
        }
        else if (v === "Porosity") {
            console.log("Consulta Porosity")
            const res = await fetch(`${API}/Load_data/porosity/${searchInput}`)
            const data = await res.json()
            setSim(data)
        }

        else if (v === "Distance") {
            console.log("Consulta Distancia")
            const res = await fetch(`${API}/Load_data/distance/${searchInput}`)
            const data = await res.json()
            setSim(data)
        }

    }


    useEffect(() => {
        getSim(0);

    }, [])

    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = sim.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumer => setCurentPage(pageNumer)
    console.log(currentPosts)


    const viewInfo = async (id) => {
        setShow(true)

        const res = await fetch(`${API}/Load_data/${id}`)
        const datainfo = await res.json()
        setExtended_Data(datainfo)


    }

    const startSimultation = async (id) => {

        const res = await fetch(`${API}/Active_Simulations`)
        const datainfo = await res.json()

        if (datainfo.count === 0) {
            setShow(false);

            if (typeof extended_data === "object") {

                await fetch(`${API}/load_data_PUT/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/Json'
                    },
                    body: JSON.stringify({
                        n_emitters: extended_data[0]['n_transmitter'],
                        n_receivers: extended_data[0]['n_receiver'],
                        emitters_pitch: extended_data[0]['emitters_pitch'],
                        receivers_pitch: extended_data[0]['receivers_pitch'],
                        sens_edge_margin: extended_data[0]['sensor_edge_margin'],
                        mesh_size: extended_data[0]['typical_mesh_size'],
                        plate_thickness: extended_data[0]['plate_thickness'],
                        plate_length: extended_data[0]['plate_length'],
                        sens_distance: extended_data[0]['sensor_distance'], 
                        sensor_width: extended_data[0]['sensor_width'],                       
                        porosity: extended_data[0]['porosity'],
                        attenuation: extended_data[0]['attenuation']
                    })
                });
            }
            
        } else {
            handleClose()
            handleShowModalInProgress()
        }

    }

    const deleteSimultation = async (id) => {
        setShow(false);
        if (window.confirm("Are you sure you \nwant to delete this simulation?")) {
            if (typeof extended_data === "object") {
                await fetch(`${API}/delete_sim/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'content-Type': 'application/json'
                    }
                })
                .then(console.log("Deleted"))
                .catch(err => console.log(err));
            }
            window.location.reload(false);
        }
    }

    const downloadSimulation = async (id) => {
        const resDownload = await fetch(`${API}/Load_data/download/${id}`)
    
       // anchor link
        const element = document.createElement("a");
        element.href = resDownload.url
        element.download = resDownload
    
        // simulate link click
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    const simulationStatus = (status)=>{
      console.log(status);
        switch(status){
            case "0": 
              return (<Badge bg="danger">Not started</Badge>) 
              break;
            case "1": 
              return (<Badge bg="warning">In Progress</Badge>) 
              break;
            case "2": 
              return (<Badge bg="success">Finished</Badge>) 
              break;
            
            default:
            return (<p>Error</p>)
        }

    }


    return (
        <div>
            <Container fluid>
                <Alert variant="success">
                    <Alert.Heading>Hey, nice to see you</Alert.Heading>
                    <p>
                        In order to start the simulation, you must find the parameters you have entered and click on start simulation. In case your simulation is already running, you have to wait until the simulation is finished.
                        Once the simulation is finished, you can download the data.
                    </p>
                    <hr />
                </Alert>
                <div className="d-flex flex-row-reverse">
                    <Row xs="auto" >
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic" >
                                    Select your search
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={e => setSearch('ID')}>ID</Dropdown.Item>
                                    <Dropdown.Item onClick={e => setSearch('Porosity')}>Porosity</Dropdown.Item>
                                    <Dropdown.Item onClick={e => setSearch('Distance')}>Distance</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs>
                            <input
                                type="number"
                                placeholder={search}
                                onChange={e => setsearchInput(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <Button variant="primary" size="sm" onClick={e => getSim(search)} paginate={1}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="col md-6">
                    <table className="table table-striped" data-pagination="true" data-show-pagination-switch="true" responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Code Simulation</th>
                                <th>Simulation Name</th>                                
                                <th>Number of emitters</th>
                                <th>Number of receivers</th>
                                <th>Emitters Pitch</th>
                                <th>Receivers Pitch</th>
                                <th>Distance</th>
                                <th>Edge Margin</th>
                                <th>Mesh Size</th>
                                <th>Plate thickness</th>
                                <th>Porosity</th>
                                <th>Status</th>
                                <th>Results</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(currentPosts => (
                                <tr key={currentPosts.id}>
                                    <td>{currentPosts.id}</td>
                                    <td>{currentPosts.code_simulation}</td>
                                    <td>{currentPosts.name_simulation}</td>                                    
                                    <td>{currentPosts.n_transmitter}</td>
                                    <td>{currentPosts.n_receiver}</td>
                                    <td>{currentPosts.emitters_pitch}</td>
                                    <td>{currentPosts.receivers_pitch}</td>
                                    <td>{currentPosts.sensor_distance}</td>
                                    <td>{currentPosts.sensor_edge_margin}</td>
                                    <td>{currentPosts.typical_mesh_size}</td>
                                    <td>{currentPosts.plate_thickness}</td>
                                    <td>{currentPosts.porosity}</td>
                                    <td>{simulationStatus(currentPosts.p_status)}</td>
                                    <td>
                                        <Button size="sm" onClick={() => viewInfo(currentPosts.id)}>
                                            View Info
                                        </Button>
                                    </td>
                                    <td>
                                        <Button size="sm" variant="danger" onClick={() => deleteSimultation(currentPosts.id)}> 
                                            Delete 
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="row">
                    <div className="col">
                        <Button variant="secondary" className='justify-content-md-start' href="/">Back</Button>
                    </div>
                    <div className="col">
                        <Pagination postsPerPage={postPerPage} totalPosts={sim.length} paginate={paginate} />
                    </div>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {extended_data.map(extended_data => (
                            <a key={extended_data.id}>
                                <div className="col-sm-9">
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td>N° Emitters:</td>
                                                <td>{extended_data.n_transmitter}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>N° Receivers:</td>
                                                <td>{extended_data.n_receiver}</td>
                                                <td></td>
                                            </tr>
                                           <tr>
                                                <td>Emitters Pitch:</td>
                                                <td>{extended_data.emitters_pitch}</td>
                                                <td>[mm]</td>
                                            </tr>
                                           <tr>
                                                <td>Receivers Pitch:</td>
                                                <td>{extended_data.receivers_pitch}</td>
                                                <td>[mm]</td>
                                            </tr>
                                           <tr>
                                                <td>Sensor Gap:</td>
                                                <td>{extended_data.sensor_gap}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>Typical Mesh Size:</td>
                                                <td>{extended_data.typical_mesh_size}</td>
                                                <td>
                                                    <label>[mm]</label>
                                                </td>
                                            </tr>
                                           <tr>
                                                <td>Plate Length:</td>
                                                <td>{extended_data.plate_length}</td>
                                                <td>
                                                    <label>[mm]</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Plate Thickness:</td>
                                                <td>{extended_data.plate_thickness}</td>
                                                <td>
                                                    <label>[mm]</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Porosity:</td>
                                                <td>{extended_data.porosity}</td>
                                                <td>
                                                    <label>[%]</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Time Ejecution</td>
                                                <td>{extended_data.time}</td>
                                                
                                            </tr>
                                            <tr>
                                                <td>Status:</td>
                                                <td>{simulationStatus(extended_data.p_status)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <Modal.Footer>
                                    {extended_data.p_status == 0
                                        ? <Button onClick={() => startSimultation(extended_data.id)}> Start Simulation </Button>
                                        : (
                                            extended_data.p_status == 1
                                                ? <Button variant="warning" disabled> Wait </Button>
                                                :
                                                <Button onClick={() => downloadSimulation(extended_data.id)} className="btn-success" >Download
                                                </Button>
                                        )}
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </a>
                        ))}
                    </Modal.Body>
                </Modal>

                <Modal show={showModalInprogress} onHide={handleCloseModalInProgress}>
                    <Modal.Header closeButton>
                        <Modal.Title>Simulation In Progress</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>There is a simulation in progress, please wait and try again later.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModalInProgress}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};