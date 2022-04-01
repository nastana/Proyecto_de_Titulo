import React from 'react'

//const API = process.env.REACT_APP_BACKEND;

export const Main = () => (
    <section className="py-5 text-center container">
        <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Welcome</h1>
                <p className="lead text-muted">Wave propagation simulation interface with different representative maps of cortical bone slices.</p>
                <p>
                        <a href="/input" className="btn btn-primary my-2">Enter data</a>
                        <a href="/load" className="btn btn-secondary my-2">View data</a>
                </p>
            </div>
        </div>
    </section>

);