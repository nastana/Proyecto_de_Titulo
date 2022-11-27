import React from 'react'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const Main = () => (
    <section className="py-5 text-center container">
        <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Welcome</h1>
                <p className="lead text-muted">This is a web platform to run a simulation of wave propagation on a 2D cortical bone map.</p>
                <Row>
                    <Col>
                        <a href="/input" className="btn btn-primary my-2">Enter data</a>
                    </Col>
                    <Col>
                        <a href="/load" className="btn btn-secondary my-2">View data</a>
                    </Col>
                </Row>
            </div>
        </div>
    </section>

);