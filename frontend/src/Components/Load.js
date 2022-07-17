import React, { useEffect, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
//import {Alert} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import Col from "react-bootstrap/Col";
import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";
import Pagination from './Pagination';
import filemat from './download/matfile.mat'

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
                    plate_thickness: extended_data[0]['plate_thickness'],
                    porosity: extended_data[0]['porosity']
                })
            });
        }


        // var dataArray = new Array();
        // for (var o in extended_data) {
        //     dataArray.Push(extended_data[o]);
        // }
        // console.log(extended_data)
        // console.log(extended_data['n_transmitter'])
        //console.log(JSON.parse(extended_data[]))




        //console.log("okis")

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
                    {/*<script src="https://unpkg.com/bootstrap-table@1.18.3/dist/bootstrap-table-locale-all.min.js"></script>*/}
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
                            <Button variant="secondary" clasName='justify-content-md-start' href="/">Back</Button>
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
                                            <label>{extended_data.attenuation} %</label>
                                        </div>
                                        <div className='col-1'>
                                            <label>[%]</label>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='row mb-2'>
                                        <div className='col-5'>
                                            <label>Status:</label>
                                        </div>
                                        <div className='col-7'>
                                            <label>{extended_data.p_status}</label>
                                        </div>
                                    </div>
                                    {
                                        extended_data.p_status === "In Progress" ?
                                        <div className='row mb-2'>
                                            <div class="progress">
                                                <div class="progress-bar" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div> : null
                                    }
                                </div>
                                <Modal.Footer>
                                    {/* {if (extended_data.p_status == "not started") { */}
                                    {extended_data.p_status === "Not Started" ? <Button onClick={() => startSimultation(extended_data.id_simulation)}> Start Simulation </Button> : (
                                        extended_data.p_status === "In Progress" ? <Button variant="warning" disabled> Wait </Button> :
                                            <Button onClick={() => downloadSimulation(extended_data.id_simulation)} >Download
                                            </Button>
                                        /* <a download="TimeSimP6TransIsoW1.0M350" href="/path/to/image" title="ImageName"><Button variant="success" download> donwload </Button></a> */
                                    )}
                                    {/* } */}
                                    {/* {customButton} */}
                                    {/* <Button onClick={() => test()}> Test </Button> */}
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