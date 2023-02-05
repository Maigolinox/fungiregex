import "./main.css"
import MUIDataTable from "mui-datatables";
import species2 from "../../listaURL.json"
import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//const {parse, stringify} = require('flatted/cjs');
const Main = () => {
    //2 - funcion para mostrar los datos con axios
    const [products, setProducts] = useState([])
    const [progressVal, setProgressVal] = useState(0)
    const [blocked, setBlocked] = useState(false);
    const endpoint = "http://localhost:8000/file"
    const progress = "http://localhost:8000/progress"

    const getData = async () => {
        await axios.get(endpoint).then((response) => {
            const data = response.data
            console.log(data)
            setProducts(data)
        })
        await axios.get(progress).then((response) => {
            const prog = response.data
            console.log(prog)
            setProgressVal(prog)
            if(parseFloat(prog)>80){
                setBlocked(false)
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    setTimeout(() => {
        getData();
    }, 5000);

    //3 - Definimos las columns
    const columns = [
        {
            name: "specie",
            label: "SPECIE"
        }, {
            name: "idf",
            label: "ID"
        }, {
            name: "shortnames",
            label: "VERSION"
        }, {
            name: "proteom",
            label: "PROTEOM"
        }, {
            name: "regExpressionScrp",
            label: "Regular_Expression"
        }, {
            name: "numMatch",
            label: "# MATCHES"
        }, {
            name: "result",
            label: "MATCHES"
        }
    ]

    const options = {
        filterType: "dropdown",
        selectableRows: false,
        responsive: "vertical",
    };

    var stringtoBackend = "";
    const nameSpecieRef = useRef(null);
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const regexRef = useRef(null);
    const listRef = useRef(null);

    const formRef = useRef();
    const [rango, setRango] = useState(false);
    const [typeSearch, setTypeSearch] = useState(false);


    async function eventButtonScrap(e) {
        setProgressVal(0);
        e.preventDefault();
        console.log("REGULAR EXPRESSION:" + regexRef.current.value);
        var regularExpression = regexRef.current.value
        var urlSpecie;
        var rangoSup;
        var rangoInf;
        var listoBackEnd;
        setBlocked(true);
        if (typeSearch === "global") {
            console.log("Búsqueda global. ");
            urlSpecie = "globally";
        }
        if (typeSearch === "specific") {
            console.log("Name of specie: " + nameSpecieRef.current.label)
            console.log("URL of specie: " + nameSpecieRef.current.value)
            urlSpecie = nameSpecieRef.current.value;
        }
        if (rango === "range") {
            console.log("FROM: " + fromInputRef.current.value + " TO: " + toInputRef.current.value)
            rangoSup = fromInputRef.current.value
            rangoInf = toInputRef.current.value
            stringtoBackend = stringtoBackend.concat(regularExpression, "|", urlSpecie, "|", rangoSup, "|", rangoInf)
            console.log("La cadena que se pasa al Backend es: " + stringtoBackend)
        } else {
            console.log("LIST OF IDS: " + listRef.current.value)
            listoBackEnd = listRef.current.value;
            stringtoBackend = stringtoBackend.concat(regularExpression, "|", urlSpecie, "|", listoBackEnd)
            console.log("La cadena que se pasa al Backend es: " + stringtoBackend)
        }
        try {
            await axios.post("http://localhost:8000/resultsScrap", {
                stringtoBackend
            })

        } catch (error) {
            console.log(error)

        }

    }



    return (
        <div className="m">
            <div className="m-bg"></div>
            <div className="m-wrapper">
                <div className="m-left">
                    <h1 className="m-title">Fill the required information</h1>

                    <div className="m-info">
                        <div className="m-info-item">
                            <h6 className="h6c">CHECK CONFIGURATIONS.</h6>
                        </div>
                    </div>
                    <div>
                        <form ref={formRef}  >
                            <div>
                                <p>Select if you want to perform a global search or look into specific specie. Take in consideration that it will take a lot of time cause the application is able to search in 2,402 different species.</p>
                                <label class="rad-label">
                                    <input type="radio" class="rad-input" name="typeSearch" value="specific" checked={typeSearch === "specific"} onChange={(e) => setTypeSearch(e.currentTarget.value)} />
                                    <div class="rad-design"></div>
                                    <div class="rad-text">Specific Specie</div>
                                </label>
                                <label class="rad-label">
                                    <input type="radio" class="rad-input" name="typeSearch" value="global" checked={typeSearch === "global"} onChange={(e) => setTypeSearch(e.currentTarget.value)} />
                                    <div class="rad-design"></div>
                                    <div class="rad-text">Globally</div>
                                </label>

                                {typeSearch === "specific" && (
                                    <select ref={nameSpecieRef} className="dropdown big" >{species2.map(item => {
                                        return (
                                            <option key={item.Id} label={item.NAME} value={item.URL}> </option>
                                        );
                                    })
                                    }
                                    </select>
                                )}
                            </div>

                            <div>
                                <p>Select if you want to scrap in a range of IDs or if you want to scan a specific list of IDs. <br /></p>
                                <label class="rad-label">
                                    <input type="radio" class="rad-input" name="rango" value="range" checked={rango === "range"} onChange={(e) => setRango(e.currentTarget.value)} />
                                    <div class="rad-design"></div>
                                    <div class="rad-text">Specific range</div>
                                </label>
                                <label class="rad-label">
                                    <input type="radio" class="rad-input" name="rango" value="list" checked={rango === "list"} onChange={(e) => setRango(e.currentTarget.value)} />
                                    <div class="rad-design"></div>
                                    <div class="rad-text">List of IDs</div>
                                </label>
                            </div>

                            <div>
                                {rango === "range" && (
                                    <div className="containerRange">
                                        From:
                                        <input ref={fromInputRef} defaultValue={"1"} type="text" placeholder="Initial ID" name="regex" />
                                        <br />To:
                                        <input ref={toInputRef} defaultValue={"1000"} type="text" placeholder="Last ID" name="regex" />
                                    </div>
                                )}
                                {rango === "list" && (
                                    <div>
                                        <div className="containerList">
                                            <br />
                                            <textarea ref={listRef} defaultValue={"1,2,3,4,5,6,7,8,9,10"} rows="5" placeholder="List of specifics IDs separated by commas" name="list_ids" />
                                            <br />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                {(blocked === false || products === []) && (
                                    <p>Regular expression:
                                        <input ref={regexRef} type="text" disabled={false} placeholder="Regular Expression to find" name="regex" defaultValue={"FAA*"} />
                                    </p>
                                )}
                                {(blocked === true && products === []) && (
                                    <p>
                                        Regular expression:
                                        <input ref={regexRef} type="text" disabled={true} placeholder="Regular Expression to find" name="regex" />
                                    </p>
                                )}
                            </div>
                            {rango !== false && typeSearch !== false && blocked === false && (
                                <button className="button_scrap" onClick={eventButtonScrap}>SCRAP</button>
                            )}
                            {progressVal !== 0 && (
                                <div>
                                    <h1>PROGRESS</h1>
                                    <p>{progressVal} % </p>
                                </div>
                            )}

                        </form>
                    </div>
                </div>


                <div className="m-right">
                    <div>
                        <Link to="/">
                            <button className="button_home">RETURN TO HOMEPAGE</button>
                        </Link>
                    </div>

                    <div class="table-wrapper">
                        <MUIDataTable
                            title={"List of results"}
                            columns={columns}
                            data={products}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Main