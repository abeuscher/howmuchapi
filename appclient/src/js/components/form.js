
const React = require('react');
const TextInput = require("./text-input.js");
const DateInput = require("./date-input.js");
const imageInput = require("./image-input.js");
const blankEntry = require("../../../../data-types.js")().productEntry;

class WeedForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        //Grab schema from data types and remove values. Not sure if this is the right approach but it;s the right direction.
        for (let prop in blankEntry) {
            if (Object.prototype.hasOwnProperty.call(blankEntry, prop)) {
                try {
                    this.state[prop] = new blankEntry[prop];
                }
                catch (e) {
                    this.state[prop] = "";
                }

            }
        }
        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeDate = this.changeDate.bind(this);

    }
    submit(e) {
        e.preventDefault();
        var formBody = new FormData();
        for (let key in this.state) {
            formBody.append(key, this.state[key]);
        }
        var req = fetch("http://localhost:5000/create/entry", {
            "method": "post",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            "body": JSON.stringify(this.state)
        });
        req.then(function (data) {
            return data.text();
        })
            .then(function (data) {
                console.log(data);
            });
    }
    handleChange(e) {

        e.preventDefault();
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        this.setState({
            [name]: value
        });

        console.log(name);
    }
    changeDate(value) {
        this.setState({
            purchase_date: value
        });
    }
    render() {
        return pug`
    form(onSubmit=this.submit,method="post")
        TextInput(id="thc",placeholder="thc%",label="THC %",handleChange=this.handleChange,value=this.state.THC)
        DateInput(value=this.state.purchase_date,label="Purchase Date",id="purchase_date",selected=this.state.purchase_date,onChange=this.changeDate)
        button(type="submit") Send Form
`
    }
}
module.exports = WeedForm;