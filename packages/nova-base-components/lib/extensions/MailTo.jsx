import React, {PropTypes, Component} from 'react';

/**
 * @return {null}
 */
const MailTo = ({className = "", title = "", email, value = ""}) => {
    if (!!email) {
        return (
          <a className={className} title={title ? title : email} href={"mailto:" + email}>{value ? value : email}</a>
        )
    }
    return (<strong>{"-" }</strong>);
};

MailTo.propTypes = {
    className: React.PropTypes.string
};

MailTo.defaultProps = {
    className: "black"
};

MailTo.displayName = "MailTo";

module.exports = MailTo;
export default MailTo;
