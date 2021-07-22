import React from 'react'

export const About = () => {
    
    return (
        <div>
            <form role="form" id="formfield" action="inc/Controller/OperatorController.php" method="post" encType="multipart/form-data" onsubmit="return validateForm();">
                <input type="hidden" name="action" defaultValue="add_form" />
                <div className="form-group">
                    <label>Last Name</label><span className="label label-danger">*required</span>
                    <input className="form-control" placeholder="Enter Last Name" name="lastname" id="lastname" />
                </div>
                <div className="form-group">
                    <label>First Name</label><span className="label label-danger">*required</span>
                    <input className="form-control" placeholder="Enter First Name" name="firstname" id="firstname" />
                </div>
                <input type="button" name="btn" defaultValue="Submit" id="submitBtn" data-toggle="modal" data-target="#confirm-submit" className="btn btn-default" />
                <input type="button" name="btn" defaultValue="Reset" onclick="window.location='fillup.php'" className="btn btn-default" data-modal-type="confirm" />
            </form>
            <div className="modal fade" id="confirm-submit" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            Confirm Submit
                        </div>
                        <div className="modal-body">
                            Are you sure you want to submit the following details?
                            <table className="table">
                                <tbody><tr>
                                    <th>Last Name</th>
                                    <td id="lname" />
                                </tr>
                                    <tr>
                                        <th>First Name</th>
                                        <td id="fname" />
                                    </tr>
                                </tbody></table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                            <a href="#" id="submit" className="btn btn-success success">Submit</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}