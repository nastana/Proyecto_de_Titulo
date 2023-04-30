import React from 'react';

export const ModalInfo = () => {
  return(
    <>
      <div className='container'>
        <hr/>
      </div>
      <div className='container' style={{ overflowY: "scroll", height: '70vh'}}>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Sim. Name:</label>
          </div>
          <div className='col'>
            <label>Name that the user gives to the simulation, used for direct search in the list. NOT UNIQUE.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Sim. Code:</label>
          </div>
          <div className='col'>
            <label>Code provided by the software that identifies a simulation, used for direct search in the list. UNIQUE.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>N° Emitters:</label>
          </div>
          <div className='col'>
            <label>Number of Emitters or Transmitters.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>N° Receivers:</label>
          </div>
          <div className='col'>
            <label>Number of Receivers.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Distance between Arrays:</label>
          </div>
          <div className='col'>
            <label>Distance between the last emitter and the first receiver that divides emitters and receivers arrays.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Emitters Pitch:</label>
          </div>
          <div className='col'>
            <label>Width of an element of the emission array.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Receivers Pitch:</label>
          </div>
          <div className='col'>
            <label>Width of an element of the reception array.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Edge Margin:</label>
          </div>
          <div className='col'>
            <label>Margin distance between one plate's edge and the first or last sensor.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Typical Mesh Size:</label>
          </div>
          <div className='col'>
            <label>Determines the typical mesh size for the simulation.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Plate Thickness:</label>
          </div>
          <div className='col'>
            <label>Thickness of the simulation plate.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Porosity:</label>
          </div>
          <div className='col'>
            <label>Percentage of porosity of the bone material, using a homogenization approach.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Attenuation:</label>
          </div>
          <div className='col'>
            <label>Value of attenuation of the bone material.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Started At:</label>
          </div>
          <div className='col'>
            <label>Date and time when the simulation started.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Time:</label>
          </div>
          <div className='col'>
            <label>Measurement of the computation time needed to execute the simulation.</label>
          </div>
        </div>
        <div className='row mb-3'>
          <div className='col-3 d-flex align-items-center'>
            <label className='fw-bold'>Status:</label>
          </div>
          <div className='col'>
            <label>State of the simulation that consists of three possibilities, Not Started, In Progress, Done.</label>
          </div>
        </div>
      </div>
      <div className='container'>
        <hr/>
      </div>
    </>
  );
};

