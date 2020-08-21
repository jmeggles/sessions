import React, { Component } from 'react';
import axios from 'axios';
import "./style.css";

class BioPic extends Component {
	state = {
        selectedFile: null,
        selectedFiles: null,
        images: []
    }

    componentDidMount() {
        axios.get("/api/fileAWS")
            .then(res => this.setState({
                images: res.data.Contents
                    .map(x => 'https://artangelssessions.s3.amazonaws.com/' + x.Key)
            })
            )
            .catch(err => console.warn(err.message))
    }

    singleFileChangedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    };

    multipleFileChangedHandler = (event) => {
        this.setState({
            selectedFiles: event.target.files
        });
        console.log(event.target.files);
    };

    singleFileUploadHandler = (event) => {
        const data = new FormData();
        // If file selected
        if (this.state.selectedFile) {

            data.append('fileAWSImage', this.state.selectedFile, this.state.selectedFile.name);

            axios.post('/api/fileAWS/fileAWS-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
                .then((response) => {
                    console.log(response)

                    this.setState({
                        images: [...this.state.images, response.data.location]
                    })
                    if (200 === response.status) {
                    	// If file size is larger than expected.
                    	if (response.data.error) {
                    		if ('LIMIT_FILE_SIZE' === response.data.error.code) {
                    			this.ocShowAlert('Max size: 2MB', 'red');
                    		} else {
                    			console.log(response.data);
                    			// If not the given file type
                    			this.ocShowAlert(response.data.error, 'red');
                    		}
                    	} else {
                    		// Success
                    		let fileName = response.data;
                    		console.log('filedata', fileName);
                    		this.ocShowAlert('File Uploaded', '#3089cf');
                    	}
                    }
                }).catch((error) => {
                    // If another error
                    this.ocShowAlert(error, 'red');
                });
        } else {
            // if file not selected throw error
            this.ocShowAlert('Please upload file', 'red');
        }
    };

    multipleFileUploadHandler = () => {
        const data = new FormData();
        let selectedFiles = this.state.selectedFiles;
        // If file selected
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                data.append('galleryImage', selectedFiles[i], selectedFiles[i].name);
            }
            axios.post('/api/fileAWS/multiple-file-upload', data, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                }
            })
                .then((response) => {
                    console.log('res', response);
                    if (200 === response.status) {
                        // If file size is larger than expected.
                        if (response.data.error) {
                            if ('LIMIT_FILE_SIZE' === response.data.error.code) {
                                this.ocShowAlert('Max size: 2MB', 'red');
                            } else if ('LIMIT_UNEXPECTED_FILE' === response.data.error.code) {
                                this.ocShowAlert('Max 4 images allowed', 'red');
                            } else {
                                // If not the given ile type
                                this.ocShowAlert(response.data.error, 'red');
                            }
                        } else {
                            // Success
                            let fileName = response.data;
                            console.log('fileName', fileName);
                            this.ocShowAlert('File Uploaded', '#3089cf');
                        }
                    }
                }).catch((error) => {
                    // If another error
                    this.ocShowAlert(error, 'red');
                });
        } else {
            // if file not selected throw error
            this.ocShowAlert('Please upload file', 'red');
        }
    };

    // ShowAlert Function
    ocShowAlert = (message, background = '#7fffd4') => {
        let alertContainer = document.querySelector('#oc-alert-container'),
            alertEl = document.createElement('div'),
            textNode = document.createTextNode(message);
        alertEl.setAttribute('class', 'oc-alert-pop-up');
        alertEl.style.backgroundColor = background
        alertEl.appendChild(textNode);
        alertContainer.appendChild(alertEl);
        setTimeout(function () {
        }, 3000);
    };


    render() {

        // ************ might not need this on New Sesh page but keep for now
            const imgstyle = {
                maxHeight: '100px'
            }
        // ************************************* //
        console.log(this.state);

        return (
            <div className="container-all">
                {/* <p className="title title-new"> New Sesh</p> */}
                		
        {/* *********group of images on the New Sesh page but keep for now */}
				<h5>Upload photos to client galleries</h5>

                <div id="image-group" className="container mt-120">                    
                    {this.state.images.map((x, i) =>
                    <img style={imgstyle} src={x} key={i + '-img'} alt={x} />)}
                </div>
        {/* ********************************* */}

                {/* For Alert box*/}
                <div id="oc-alert-container"></div>

                {/* Single File Upload*/}
	{/* uploads a single pic from AWS bucket to the BioPic page on for the dashboard Avatar */}
                <div className="card mt-5">
                    <div className="card-header">
                        <h3>Single Image Upload</h3>
                        <p> * Upload Size: 250px x 250px ( Max 2MB ) * </p>
                    </div>
                    <div className="card-body">
                        <input type="file" onChange={this.singleFileChangedHandler} />
                        <div className="mt-5">
                            <button className="btn btn-info" onClick={this.singleFileUploadHandler}>Upload!</button>
                        </div>
                    </div>
                </div>

	{/* below code not needed since we are not uploading more than one pic for the avatar on dashboard page. */}
                {/* Multiple File Upload
                <div className="card">
                    <div className="card-header">
                        <h3>Multiple Images Upload ( Max 4 ) </h3>
                        <p> * Upload Size: 400px x 400px ( Max 2MB ) * </p>
                    </div>
                    <div className="card-body">
                        <input type="file" multiple onChange={this.multipleFileChangedHandler} />
                        <div className="mt-5">
                            <button className="btn btn-info" onClick={this.multipleFileUploadHandler}>Upload !</button>
                        </div>
                    </div>
                </div> */}

            </div>
        );
    }
}

export default BioPic;