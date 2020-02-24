
var React = require('react');

class SList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "message" : "Hello World Guys!"
          };
    }
    componentDidMount() {
        console.log("loaded");
        fetch("http://localhost:5000/", { method : "get"})
            .then((data) => {
                setTimeout(() => null, 0);
                if(!data.ok) {
                    console.log("ERROR");
                }
                else {
                    console.log("got response", data);
                }
                try {
                     return data.text();
                }
                catch(e) {
                    console.log(e);
                }
               
            })
            .then((data) => {
                this.setState({
                    message: data,
                  });
            });
    }
    render() {
        return pug`
    .wrapper
        p.greeting=this.state.message
        button Click Me
`
    } 
} 
module.exports = SList;