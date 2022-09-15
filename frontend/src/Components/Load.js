import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, ProgressBar, Spinner, Dropdown, Col, Row, Alert } from 'react-bootstrap';
import Pagination from './Pagination';
import filemat from './download/matfile.mat'
import Modali, { useModali } from 'modali';
import ModalInfo from './ModalInfo';

const API = process.env.REACT_APP_BACKEND;

export const Load = () => {

    const [sim, setSim] = useState([]);
    const [extended_data, setExtended_Data] = useState([]);
    const [search, setSearch] = useState('');
    const [searchInput, setsearchInput] = useState('');

    const [currentPage, setCurentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(10);

    const [showd, setShowd] = useState(false);
    const handleClosed = () => setShowd(false);
    const handleShowd = () => setShowd(true);


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [dataDownload, setdataDownload] = useState([]);

    const getSim = async (v) => {
        if (v === 0 || searchInput === '') {

            const res = await fetch(`${API}/Load_data`)
            const data = await res.json();
            setSim(data)
            //console.log(data)
            //console.log(data.length)
            var maxlength = data.length
            var cantpag = Math.trunc(data.length / 10)
            //const maxrow = 10
            console.log(cantpag)

            //console.log(data[1])
            console.log("Consulta all")
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
        setShow(false);
        //const res = await fetch(`${API}/Load_data/${id}`)
        //const datasim = await res.json()

        //console.log(n_emisores)
        if (typeof extended_data === "object") {

            await fetch(`${API}/load_data_PUT/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/Json'
                },
                body: JSON.stringify({
                    n_emitters: extended_data[0]['n_emitter'],
                    n_receivers: extended_data[0]['n_receiver'],
                    sens_distance: extended_data[0]['sensor_distance'],
                    emitter_pitch: extended_data[0]['emitter_pitch'],
                    receiver_pitch: extended_data[0]['receiver_pitch'],
                    sensor_edge_margin: extended_data[0]['sensor_edge_margin'],
                    typical_mesh_size: extended_data[0]['typical_mesh_size'],
                    plate_thickness: extended_data[0]['plate_thickness'],
                    plate_size: extended_data[0]['plate_thickness'],
                    porosity: extended_data[0]['porosity']
                })
            });
        }
    }

    const downloadSimulation = async (id) => {
        setShow(false)
        const resDownload = await fetch(`${API}/Load_data/download/${id}`)
        const aer = await resDownload.json()
        console.log("a", aer)
        setdataDownload(aer)
        //const download = await res.json()
        handleShowd()
    }

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
                <Row>
                    <Col>
                        <Button variant="primary" clasName='justify-content-md-start' href="/input">Start a new Simulation</Button>
                    </Col>
                    <Col>
                        <div className="d-flex flex-row-reverse">
                            <Row xs="auto" >
                                <Col>
                                    <button className='btn btn-primary' onClick={toggleModalInfo}>
                                        Parameters Info
                                    </button>
                                    <Modali.Modal {...modalInfo}>
                                        <ModalInfo/>
                                    </Modali.Modal>
                                </Col>
                                <Col>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" size="md" id="dropdown-basic" >
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
                                        className="form-text form-control"
                                        placeholder={search}
                                        onChange={e => setsearchInput(e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    <Button variant="primary" size="md" onClick={e => getSim(search)} paginate={1}>
                                        Search
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <br/>
                <div className="col md-6">
                    <table className="table table-striped" data-pagination="true" data-show-pagination-switch="true" responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Started at</th>
                                <th>Code</th>
                                <th>N° Emitters</th>
                                <th>N° Receivers</th>
                                <th>Typical Mesh Size</th>
                                <th>Plate Thickness</th>
                                <th>Plate Size</th>
                                <th>Porosity</th>
                                <th>Attenuation</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(currentPosts => (
                                <tr key={currentPosts.id_simulation}>
                                    <td>{currentPosts.id_simulation}</td>
                                    <td>{currentPosts.name_simulation}</td>
                                    <td>{currentPosts.start_datetime}</td>
                                    <td>{currentPosts.cod_simulation}</td>
                                    <td>{currentPosts.n_emitter}</td>
                                    <td>{currentPosts.n_receiver}</td>
                                    <td>{currentPosts.typical_mesh_size}</td>
                                    <td>{currentPosts.plate_thickness}</td>
                                    <td>{currentPosts.plate_size}</td>
                                    <td>{currentPosts.porosity}</td>
                                    <td>{currentPosts.attenuation}</td>
                                    <td>{currentPosts.p_status}</td>
                                    <td>
                                        {/* <Button className="btn btn-primary my-2" onClick={handleShow} >View Info</Button> */}
                                        <Button onClick={() => viewInfo(currentPosts.id_simulation)}>
                                            View Info
                                        </Button>
                                        {/* <a href="TimeSimP6TransIsoW1.0M350" download>
                                            <button type="button" className="btn btn-primary my-2" >
                                                Download results
                                            </button>
                                        </a> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                <div clasName="container">
                    <div className="row">
                        <div className="col">
                            <Button variant="secondary" clasName='justify-content-md-start' href="/">Back to Main Menu</Button>
                        </div>
                        <div className="col">
                            <Pagination postsPerPage={postPerPage} totalPosts={sim.length} paginate={paginate} />
                        </div>
                    </div>

                </div>



                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {extended_data.map(extended_data => (

                            <a key={extended_data.id_simulation}>
                                <div className='container'>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Simulation Name:</label>
                                        </div>
                                        <div className='col-6'>
                                            <label>{extended_data.name_simulation}</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Simulation Code:</label>
                                        </div>
                                        <div className='col-6'>
                                            <label>{extended_data.cod_simulation}</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Sim. Start Date:</label>
                                        </div>
                                        <div className='col-6'>
                                            <label>{extended_data.start_datetime}</label>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>N° Emitters:</label>
                                        </div>
                                        <div className='col-6'>
                                            <label>{extended_data.n_emitter}</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>N° Receivers:</label>
                                        </div>
                                        <div className='col-6'>
                                            <label>{extended_data.n_receiver}</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Emitter Pitch:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.emitter_pitch} </label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Receiver Pitch:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.receiver_pitch}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Distance Between Arrays:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.sensor_distance}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Sensor Edge Margin:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.sensor_edge_margin}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Plate Size:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.plate_size}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Plate Thickness:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.plate_thickness}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Typical Mesh Size:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.typical_mesh_size}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[mm]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Porosity:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.porosity}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[%]</label>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-6'>
                                            <label>Attenuation:</label>
                                        </div>
                                        <div className='col-2'>
                                            <label>{extended_data.attenuation}</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[%]</label>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='row mb-3'>
                                        <div className='col-6'>
                                            <label>Status:</label>
                                        </div>
                                        <div className='col-3'>
                                            <label>{extended_data.p_status}
                                            </label>
                                        </div>
                                        { extended_data.p_status === "In Progress" ?
                                        <div className='col-1'>
                                            <Spinner
                                            as="span"
                                            variant="primary"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            animation="border"/>
                                        </div> : null }
                                    </div>
                                    {extended_data.p_status === "In Progress" ?
                                    <div className='row mb-3'>
                                        <ProgressBar now={75} />
                                    </div> : ( 
                                    extended_data.p_status === "Done" ?
                                    <div className='row mb-3'>
                                        <div className='col-6'>
                                            <label>Time:</label>
                                        </div>
                                        <div className='col-3'>
                                            <label>{extended_data.time}
                                            </label>
                                        </div>
                                    </div> : null )}
                                </div>
                                <Modal.Footer>
                                    {extended_data.p_status === "Not Started" ? <Button onClick={() => startSimultation(extended_data.id_simulation)}> Start Simulation </Button> : (
                                        extended_data.p_status === "Done" ?
                                        <div>
                                            <Button className='me-2' onClick={() => downloadSimulation(extended_data.id_simulation)} >Download
                                            </Button>
                                            <a href={'/results/' + extended_data.id_simulation}  className="btn btn-primary">View Result</a>
                                        </div> : null
                                    )}
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </a>

                        ))}
                    </Modal.Body>
                </Modal>
                <Modal show={showd} onHide={handleClosed}>
                    <Modal.Header closeButton>
                        <Modal.Title>Download</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You will download the result of the selected simulation </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosed}>
                            Close
                        </Button>
                        <Button variant="primary" href={filemat} download={dataDownload}>
                            Download
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};