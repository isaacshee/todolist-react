import React, {useState, useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';
import InputGroup from 'react-bootstrap/InputGroup';
import { Form } from "react-bootstrap";
import FormGroup from 'react-bootstrap/FormGroup';


const CRUD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //ISAAC - state variables for insert and edit
    const[title, setTitle] = useState('')
    const[description, setDescription] = useState('')
    const[dueDate, setDueDate] = useState('')
    const[status, setStatus] = useState('')  

    const[editID, setEditId] = useState('')
    const[editTitle, setEditTitle] = useState('')
    const[editDescription, setEditDescription] = useState('')
    const[editDueDate, setEditDueDate] = useState('')
    const[editStatus, setEditStatus] = useState('')  

    //ISAAC - this variable was used to populate table with dummy data before being able to fetch data from API
    /*const todoItemData = [
        {
            id: 1,
            title: 'Clean Bedroom',
            description: 'Change bedsheets, clean desk and mop floor',
            dueDate: '2025-03-25',
            status: 'Completed'
        },
        {
            id: 2,
            title: 'Walk the dog',
            description: 'Take Brix to the nearby park for 30 minutes',
            dueDate: '2025-03-25',
            status: 'Completed'
        },
        {
            id: 3,
            title: 'Prepare dinner',
            description: 'Marinate chicken, cook rice and make soup stock',
            dueDate: '2025-03-25',
            status: 'Completed'
        },
    ]
    */


    const [data, setData] = useState([]);

    useEffect(()=>{
        //ISAAC - used to populate table with dummy data
        //setData(todoItemData);

        //ISAAC - populating table with records from database via GET API call
        getData();
    }, [])

    //ISAAC - GET request | Using axios to getdata and then assign response to variable
    const getData = () =>{
        axios.get('https://localhost:7058/api/TodoItem')
        .then((result)=>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error) //ISAAC - catching and logging any error that may occur
        })
    }

    //ISAAC - Edit button click, populate modal with info from db by GET request, based on id
    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7058/api/TodoItem/${id}`)
        .then((result)=>{
            setEditTitle(result.data.title);
            setEditDescription(result.data.description);
            setEditDueDate(result.data.dueDate);
            setEditStatus(result.data.status);
            setEditId(id);
        })
        .catch((error)=>{
            console.log(error) //ISAAC - catching and logging any error that may occur
        })
    }

    //ISAAC - DELETE request
    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to delete this item?") === true){
            axios.delete(`https://localhost:7058/api/TodoItem/${id}`)
            .then((result)=>{
                if(result.status === 204) //ISAAC - check for NoContent return code which we specified in DELETE API call in backend
                {
                    toast.success('Item has been deleted');
                    getData();
                }
            })
            .catch((error)=>{
                toast.error(error);
            })
        }
    }

    //ISAAC - PUT request
    const handleUpdate = () => {
        const url = `https://localhost:7058/api/TodoItem/${editID}`;
        const data = {
            "id": editID,
            "title": editTitle,
            "description": editDescription,
            "dueDate": editDueDate,
            "status": editStatus
        }

        //ISAAC - post data by passing the url and data (json), if successful, quickly bind the latest data to the table, then clear the fields
        axios.put(url, data)
        .then((result) => {
            handleClose();
            getData();
            clear();
            toast.success('Item has been updated');
        }).catch((error)=>{
            toast.error(error);
        })
    }

    //ISAAC - POST request
    const handleSave = () => {
        const url = 'https://localhost:7058/api/TodoItem';
        const data = {
            "title": title,
            "description": description,
            "dueDate": dueDate,
            "status": status
        }

        //ISAAC - post data by passing the url and data (json), if successful, quickly bind the latest data to the table, then clear the fields
        axios.post(url, data)
        .then((result) => {
            getData();
            clear();
            toast.success('Item has been added to the list');
        }).catch((error)=>{
            toast.error(error);
        })
    }

    const clear = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('');
        setEditTitle('');
        setEditDescription('');
        setEditDueDate('');
        setEditStatus('');
        setEditId('');
    }

    //ISAAC - setting variables and events for filtering logic
    const [search, setSearch] = useState('')
    const [filterValue, setFilter] = useState('')
    const onFilterChange = (e) => {
        setFilter(e.target.value)
    }

    /*ISAAC - used react-bootstrap controls from the official documentation website: https://react-bootstrap.netlify.app/docs
            - react-bootstrap table: https://react-bootstrap.netlify.app/docs/components/table/
            - react-bootstrap modals: https://react-bootstrap.netlify.app/docs/components/modal/
            - react-bootstrap layout grid: https://react-bootstrap.netlify.app/docs/layout/grid/
    */
    return(
        <Fragment>
            <label>Choose a field to filter on by selecting an option below  : </label>
            <ToastContainer></ToastContainer>
            <Form>
            <div className='radioGroup'>
                <input type="radio" name='filter' value ='title' id='title' onChange={onFilterChange}/>
                <label htmlFor="Title">Title</label>
                <input type="radio" name='filter' value ='description' id='description' onChange={onFilterChange}/>
                <label htmlFor="Description">Description</label>
                <input type="radio" name='filter' value ='dueDate' id='titdueDatele' onChange={onFilterChange}/>
                <label htmlFor="Due Date">Due Date</label>
                <input type="radio" name='filter' value ='status' id='status' onChange={onFilterChange}/>
                <label htmlFor="Status">Status</label>
            </div>

                <Form.Group className="mb-5" controlId="exampleFormControlInput1">
                    <Form.Label>Filter:</Form.Label>
                    <Form.Control onChange={(e) => setSearch(e.target.value)} type="input" placeholder="Filter Search" />
                </Form.Group>
            </Form>

            <Container>
                <Row>
                    {/*ISAAC - render form controls for inserting new todo list items & tie them to the appropriate event handlers*/}
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Title"
                    value={title} onChange={(e)=> setTitle(e.target.value)}/> 
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Description"
                    value={description} onChange={(e)=> setDescription(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="date" className="form-control" placeholder="Enter Due Date"
                    value={dueDate} onChange={(e)=> setDueDate(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Status"
                    value={status} onChange={(e)=> setStatus(e.target.value)}/>
                    </Col>
                    <Col>
                    <button className="btn btn-primary" onClick={()=> handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        //ISAAC - this code block populates the table and display data from GET API call
                        data && data.length > 0 ?
                            data.filter((item) => {
                                //ISAAC - rewrote the below logic to filter on a specific column based on the radio button selection, works dynamically
                                //return search.toLowerCase() === '' ? item : item.title.toLowerCase().includes(search)
                                if(search.toLowerCase() === ''){
                                    return item
                                }
                                else if (search.toLowerCase() !== '' && filterValue === 'title') {
                                    return item.title.toLowerCase().includes(search)
                                    
                                } 
                                else if (search.toLowerCase() !== '' && filterValue === 'description') {
                                    return item.description.toLowerCase().includes(search)
                                    
                                }
                                else if (search.toLowerCase() !== '' && filterValue === 'dueDate') {
                                    return item.dueDate.toLowerCase().includes(search)
                                    
                                }
                                else if (search.toLowerCase() !== '' && filterValue === 'status') {
                                    return item.status.toLowerCase().includes(search)
                                    
                                }  
                                else {
                                }
                            }).map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{item.dueDate}</td>
                                        <td>{item.status}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Update Todo Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    {/*ISAAC - render form controls in modal for updating existing todo list items & tie them to the appropriate event handlers*/}
                    <Col> 
                    <input type="text" className="form-control" placeholder="Enter Title"
                    value={editTitle} onChange={(e)=> setEditTitle(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Description"
                    value={editDescription} onChange={(e)=> setEditDescription(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="date" className="form-control" placeholder="Enter Due Date"
                    value={editDueDate} onChange={(e)=> setEditDueDate(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Status"
                    value={editStatus} onChange={(e)=> setEditStatus(e.target.value)}/>
                    </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default CRUD;