import "./documentation.css"
import { Link } from "react-router-dom";

const Documentation = () => {
    return (
        <div className="d">
            <div className="d-bg"></div>
            <div className="d-wraper">
                <div className="d-right">

                    <h1 className="d-title">
                        INSTALLATION/EXECUTION
                    </h1>

                    <div className="d-content">
                        <ol>
                            <li>You can download the full project available on my Github or clone the repository.</li>
                            <li>Revisa la socumentación completa en: <a href="shorturl.at/vNPWY">click. </a></li>
                        </ol>
                    </div>

                    <Link to="/">
                        <button className="button_home">RETURN TO HOMEPAGE</button>
                    </Link>
                </div>


            </div>


        </div>
    );
}
export default Documentation