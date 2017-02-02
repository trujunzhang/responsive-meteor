import Telescope from 'meteor/nova:lib';
import React, {PropTypes, Component} from 'react';
import {DocumentContainer} from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";
import {withRouter} from 'react-router';


class IndividualFile extends Component {

    removeFile() {
        "use strict";
        let conf = confirm('Are you sure you want to delete the file?') || false;
        if (conf == true) {
            Meteor.call('RemoveFile', this.props.fileId, function (err, res) {
                if (err)
                    console.log(err);
            });
        }
    }

    renameFile() {
        "use strict";

        let validName = /[^a-zA-Z0-9 \.:\+()\-_%!&]/gi;
        let prompt = window.prompt('New file name?', this.props.fileName);

        // Replace any non valid characters, also do this on the server
        if (prompt) {
            prompt = prompt.replace(validName, '-');
            prompt.trim();
        }

        if (!_.isEmpty(prompt)) {
            Meteor.call('RenameFile', this.props.fileId, prompt, function (err, res) {
                if (err)
                    console.log(err);
            });
        }
    }

    render() {

        return <div className="m-t-sm">
            <div className="row">
                <div className="col-md-12">
                    <strong>{this.props.fileName}</strong>
                    <div className="m-b-sm">
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <button onClick={this.renameFile} className="btn btn-outline btn-primary btn-sm">
                        Rename
                    </button>
                </div>


                <div className="col-md-3">
                    <a href={this.props.fileUrl} className="btn btn-outline btn-primary btn-sm"
                       target="_blank">View</a>
                </div>

                <div className="col-md-2">
                    <button onClick={this.removeFile} className="btn btn-outline btn-danger btn-sm">
                        Delete
                    </button>
                </div>

                <div className="col-md-4">
                    Size: {this.props.fileSize}
                </div>
            </div>
        </div>
    }
}

IndividualFile.propTypes = {
    fileName: React.PropTypes.string.isRequired,
    fileSize: React.PropTypes.number.isRequired,
    fileUrl: React.PropTypes.string,
    fileId: React.PropTypes.string.isRequired
};

IndividualFile.contextTypes = {
    messages: React.PropTypes.object
};

IndividualFile.displayName = "IndividualFile";

module.exports = withRouter(IndividualFile);
export default withRouter(IndividualFile);
