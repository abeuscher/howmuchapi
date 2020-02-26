
var React = require('react');

class SList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "message" : "Hello World Guys!"
          };
    }
    componentDidMount() {
        fetch("http://localhost:5000/", { method : "get"})
            .then((data) => {
                setTimeout(() => null, 0);
                if(!data.ok) {
                    console.log("ERROR");
                }
                try {
                     return data.json();
                }
                catch(e) {
                    console.log("ERROR: ",e);
                }
               
            })
            .then((data) => {
                let output = "";
                console.log(data);
                data.forEach((item)=> {
                    output += item.name + ",";
                });
                this.setState({
                    message: output,
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