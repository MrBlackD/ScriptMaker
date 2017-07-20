const React = require('react');
import HeadBar from "../components/HeadBar";
import Folder from "material-ui-icons/Folder";
// import 'typeface-roboto'


export default class Application extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        let content;
        if(this.props.children !== null){
            content = this.props.children;
        }
        return (
            <div>
                <HeadBar/>
                {content}
            </div>
        )
    }
}
