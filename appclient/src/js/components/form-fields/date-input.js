import React from 'react';
import DatePicker from "react-datepicker";

class DateInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
        label(for=this.props.id)=this.props.label
        DatePicker(selected=this.props.selected,value=this.props.value,onChange=this.props.onChange)
`
    }
}
module.exports = DateInput;