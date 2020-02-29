const React = require('react');

class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return pug`
        label(for=this.props.id)=this.props.label
        input(type="text",id=this.props.id,name=this.props.id,placeholder=this.props.placeholder,value=this.props.value,onChange=this.props.handleChange)
`
    }
}
module.exports = TextInput;