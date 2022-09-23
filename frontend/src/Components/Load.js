import React, { useEffect, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
//import {Alert} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert';
import Col from "react-bootstrap/Col";
import Dropdown from 'react-bootstrap/Dropdown';
import Row from "react-bootstrap/Row";
import Pagination from './Pagination';

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
                    n_transmitter: extended_data[0]['n_transmitter'],
                    n_receiver: extended_data[0]['n_receiver'],
                    distance: extended_data[0]['distance'],
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
        const resDownload = await fetch(`${API}/Load_data/download/${id}`)
    
       // anchor link
        const element = document.createElement("a");
        element.href = resDownload.url
        element.download = resDownload
    
        // simulate link click
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
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
                                <th>Number of emitters</th>
                                <th>Number of receivers</th>
                                <th>Typical Mesh Size</th>
                                <th>Plate thickness</th>
                                <th>Porosity</th>
                                <th>Results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(currentPosts => (
                                <tr key={currentPosts.id}>
                                    <td>{currentPosts.id}</td>
                                    <td>{currentPosts.n_transmitter}</td>
                                    <td>{currentPosts.n_receiver}</td>
                                    <td>{currentPosts.distance}</td>
                                    <td>{currentPosts.plate_thickness}</td>
                                    <td>{currentPosts.porosity}</td>
                                    <td>
                                        {/* <Button className="btn btn-primary my-2" onClick={handleShow} >View Info</Button> */}
                                        <Button onClick={() => viewInfo(currentPosts.id)}>
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
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Button variant="secondary" className='justify-content-md-start' href="/">Back</Button>
                        </div>
                        <div className="col">
                            <Pagination postsPerPage={postPerPage} totalPosts={sim.length} paginate={paginate} />
                        </div>
                    </div>

                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {extended_data.map(extended_data => (

                            <a key={extended_data.id}>
                                {/* <div class="row">
                                    <div class="col-sm-5">
                                        <div className="form-label">Number of emitters: {extended_data.n_transmitter}</div>
                                        <div className="form-label">Number of receivers: {extended_data.n_receiver}</div>
                                        <div className="form-label">Distance betwen last emitter and first receiver: {extended_data.distance}</div>
                                        <div className="form-label">Plate Thickness: {extended_data.plate_thickness}</div>
                                        <div className="form-label">Porosity: {extended_data.porosity}</div>
                                        <div className="form-label">Status: {extended_data.p_status}</div>
                                    </div>
                                    <div class="col-sm-5">
                                        <div className="form-label">{extended_data.n_transmitter}</div>
                                        <div className="form-label">{extended_data.n_receiver}</div>
                                        <div className="form-label">{extended_data.distance}</div>
                                        <div className="form-label">{extended_data.plate_thickness}</div>
                                        <div className="form-label">{extended_data.porosity}</div>
                                        <div className="form-label">{extended_data.p_status}</div>
                                    </div>
                                </div> */}
                                <div className="col-sm-9">
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td>Number of emitters:</td>
                                                <td>{extended_data.n_transmitter}</td>
                                            </tr>
                                            <tr>
                                                <td>Number of receivers:</td>
                                                <td>{extended_data.n_receiver}</td>
                                            </tr>
                                            <tr>
                                                <td>Typical Mesh Size (mm):</td>
                                                <td>{extended_data.distance}</td>
                                            </tr>
                                            <tr>
                                                <td>Plate Thickness:</td>
                                                <td>{extended_data.plate_thickness}</td>
                                            </tr>
                                            <tr>
                                                <td>Porosity:</td>
                                                <td>{extended_data.porosity}</td>
                                            </tr>
                                            <tr>
                                                <td>Time Ejecution [HH:MM:SS] </td>
                                                <td>{extended_data.time}</td>
                                            </tr>
                                            <tr>
                                                <td>Status:</td>
                                                <td>{extended_data.p_status}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <Modal.Footer>
                                    {/* {if (extended_data.p_status == "not started") { */}
                                    {extended_data.p_status == "Not started"
                                        ? <Button onClick={() => startSimultation(extended_data.id)}> Start Simulation </Button>
                                        : (
                                            extended_data.p_status == "In progress"
                                                ? <Button variant="warning" disabled> Wait </Button>
                                                :
                                                <Button onClick={() => downloadSimulation(extended_data.id)} >Download
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
            </Container>
        </div>
    );
};