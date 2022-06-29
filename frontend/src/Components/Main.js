import React from 'react'

//const API = process.env.REACT_APP_BACKEND;

export const Main = () => (
    <section className="py-5 text-center container">
        <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Welcome</h1>
                <p className="lead text-muted">Wave propagation simulation interface with different representative maps of cortical bone slices.</p>
                <div className='row'>
                    <div className='col-6'>
                        <a href="/input" className="btn btn-primary">Enter data</a>
                    </div>
                    <div className='col-6'>
                        <a href="/load" className="btn btn-secondary">View data</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

);