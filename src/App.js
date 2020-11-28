import React, { Component } from 'react';
import { Table, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardCheck, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const url = "https://fusp56w5s9.execute-api.us-west-1.amazonaws.com/staging";

class App extends Component {
    state = {
        data: [],
        modalInsertar: false,
        modalEliminar: false,
        form:{
          id: '',
          vendedor: '',
          cantidad: '',
          fecha: '',
          factura: ''
        }
    }

    peticionGet=()=>{
        axios.get(url).then(response =>{
            console.log(response.data);
            this.setState({data: response.data.data});
        }).catch(err =>{
            console.error(err.message);
        });
    }

    peticionPost=async()=>{
        delete this.state.form.id;
        await axios.post(url +'/agregar', this.state.form).then(response =>{
            this.modalInsertar();
            this.peticionGet();
        }).catch(err => {
            console.error(err.message);
        });
    }

    peticionPut=()=>{
        axios.put(url+'/editar',this.state.form).then(response =>{
            this.modalInsertar();
            this.peticionGet();
        }).catch(err =>{
            console.error(err.message);
        });
    }

    peticionDelete=()=>{
        axios.delete(url+'/eliminar/'+this.state.form.id).then(response =>{
            this.setState({modalEliminar: false});
            this.peticionGet();
        }).catch(err =>{
            console.error(err.message);
        });
    }

    seleccionarFactura=(facturas)=>{
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: facturas.id,
                vendedor: facturas.Vendedor,
                cantidad: facturas.Cantidad,
                fecha: facturas.Fecha,
                factura: facturas.Factura
            }
        });
    }

    handleChange=async e=>{
        e.persist();
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar});
    }

    componentDidMount(){
        this.peticionGet();
    }

    render() {
        const allinvoices = this.state.data;
        const { form }=this.state;
        
        let datos = allinvoices.map(invoice => 
            <tr key={invoice.Id}>
                <td>{invoice.Vendedor}</td>
                <td>{invoice.Cantidad}</td>
                <td>{invoice.Factura}</td>
                <td>{invoice.Fecha}</td>
                <td><Button className="btn btn-lg btn-secondary" onClick={()=>{this.seleccionarFactura(invoice); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faClipboardCheck}></FontAwesomeIcon></Button></td>
                <td><Button className="btn btn-lg btn-secondary" onClick={()=>{this.seleccionarFactura(invoice); this.modalInsertar();}}><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></Button></td>
            </tr>
            );

        return(
            <div className="container center">
                <h4>Facturas pendientes - La empresa Chocokrispi </h4>
                <Table dark responsive>
                    <thead>
                        <tr>
                            <th>Vendedor</th>
                            <th>Cantidad</th>
                            <th>Factura #</th>
                            <th>Fecha</th>
                            <th colSpan="2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.length === 0 ? <td colSpan="7">Todos atrapados!</td>:datos}
                    </tbody>
                </Table>
                <Button className="btn btn-secondary" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>Agregar</Button>
                
                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                        <h3>{this.state.tipoModal}</h3>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>Vendedor</label>
                            <input className="form-control" type="text" name="vendedor" id="vendedor" onChange={this.handleChange} value={form?form.vendedor: ''}/>
                            <br />
                            <label>Cantidad</label>
                            <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form?form.cantidad: ''}/>
                            <br />
                            <label>No. de factura</label>
                            <input className="form-control" type="text" name="factura" id="factura" onChange={this.handleChange} value={form?form.factura: ''}/>
                            <br />
                            <label>Fecha</label>
                            <input className="form-control" type="text" name="fecha" id="fecha" onChange={this.handleChange} value={form?form.fecha: ''}/>

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.tipoModal=='insertar'?
                        <button className="btn btn-success" onClick={()=>this.peticionPost()}>Insertar</button>: 
                        <button className="btn btn-primary" onClick={()=>this.peticionPut()}>Actualizar</button>
                        }
                        <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Confirmar liquidacion.
                    </ModalBody>

                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default App;