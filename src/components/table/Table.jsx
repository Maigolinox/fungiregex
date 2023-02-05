import { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";

const TableAxios = () => {
    //1 - configuramos Los hooks
    const [products, setProducts] = useState([])

    //2 - funcion para mostrar los datos con axios
    const endpoint = "http://localhost:3000/listaURLnew.json"

    const getData = async () => {
        await axios.get(endpoint).then((response) => {
            const data = response.data
            console.log(data)
            setProducts(data)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    //3 - Definimos las columns
    const columns = [
        {
            name: "Id",
            label: "ID"
        }, {
            name: "NAME",
            label: "NAME"
        }
    ]
    //4 - renderizamos la datatable
    return (
        <MUIDataTable
            title={"List of organisms"}
            data={products}
            columns={columns}
        />
    )

}

export default TableAxios