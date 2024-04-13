import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios'
import showTaostify from './showTaostify';
import { useNavigate } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Swal from 'sweetalert2'
const UserDashboard = () => {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [showupdate, setShowupdate] = useState(false);
    const [amount, setamount] = useState('1');
    // const [startIndex, setstartIndex] = useState(0);
    // const [endIndex, setendIndex] = useState(4);
    const [select, setselect] = useState('Online');
    const [daySelect, setdaySelect] = useState('Select');
    const [description, setdescription] = useState('');
    const [search, setsearch] = useState('');
    const [userLoggedin, setuserLoggedin] = useState([]);
    const [selectedUpdate, setselectedUpdate] = useState([]);
    const [userExpense, setuserExpense] = useState([]);
    const [sevenDays, setsevenDays] = useState([]);
    const [days30, setdays30] = useState([]);
    const [day180, setday180] = useState([]);
    const [day366, setday366] = useState([]);
    // const [name, setname] = useState('Show All');
    const [startDate, setStartDate] = useState('')
    const [endDate, setendDate] = useState('')
    const [dateRangeArr, setdateRangeArr] = useState(null)
    const [dateValid, setdateValid] = useState({ isValid: true, msg: 'Required' });
    const [amountValid, setamountValid] = useState({ isValid: true, msg: 'Required' });
    const [date, setdate] = useState(new Date().toISOString().slice(0, 10))

    const getExpense = async () => {
        let user = JSON.parse(localStorage.getItem('userLoggedIn'))
        let res = await axios.get(`http://localhost:1923/api/v1/expense/getExpenseByEmail/${user[0].email}`)
        setuserExpense(res.data.expense)
        setsevenDays(res.data.days_7)
        setdays30(res.data.days_30)
        setday180(res.data.days_6m)
        setday366(res.data.days_12m)
        // resetHandler()
    }

    const deleteExpense = async (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            let res = await axios.delete(`http://localhost:1923/api/v1/expense/deleteById/${id}`)
            showTaostify(res.data.success, res.data.msg)
            getExpense()
            resetHandler()
        }
    }
    const editExpense = (data) => {
        setselectedUpdate(data)
        setdate(data.date.slice(0, 10))
        setamount(data.amount)
        setselect(data.paymentMode)
        setdescription(data.description)
        handleShowupdate()
    }
    useEffect(() => {
        document.title = 'User Dashboard'
        let user = JSON.parse(localStorage.getItem('userLoggedIn'))
        setuserLoggedin(user)
        getExpense()
    }, [])
    const logoutUser = () => {
        Swal.fire({
            title: "Log out?",
            text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#254061",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Logged Out!",
                    icon: "success",
                    timer:1000
                });
                localStorage.removeItem('userLoggedIn');
                navigate('/')
            }
        });

    }
    const deleteUser = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#254061",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                let email = userLoggedin[0].email
                const res = await axios.delete(`http://localhost:1923/api/v1/user/deleteUser/${email}`)
                // showTaostify(res.data.success, res.data.msg)
                if (res.data.success) {
                    navigate('/')
                    localStorage.removeItem('userLoggedIn')
                }
                Swal.fire({
                    title: "Deleted!",
                    icon: "success",
                    timer:1000
                });
            }
        });


    }
    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => {
        setShow(true)
        setamount('1')
        setselect('Online')
        setdescription('')
        setdate(new Date().toISOString().slice(0, 10))
    };
    const handleCloseupdate = () => {
        setShowupdate(false)
    };
    const handleShowupdate = () => setShowupdate(true);
    const submitHandler = async (e) => {
        e.preventDefault()
        let bool = validate()
        if (bool) {
            let email = userLoggedin[0].email
            let res = await axios.post('http://localhost:1923/api/v1/expense/addExpense', {
                date,
                amount,
                paymentMode: select,
                description,
                email
            })
            if (res.data.success) {
                getExpense()
            }
            showTaostify(res.data.success, res.data.msg)
            handleClose()
            setamount('1')
            setselect('Online')
            setdescription('')
            setdate(new Date().toISOString().slice(0, 10))
            getExpense()
            resetHandler()
        }
    }
    const validate = () => {
        let bool = true;
        let tdate = new Date()
        let submitDate = new Date(date)
        if (!date) {
            bool = false
            setdateValid({ isValid: false, msg: 'Required' })
        } else if (submitDate > tdate) {
            bool = false
            setdateValid({ isValid: false, msg: 'Dont enter future date' })
        } else {
            setdateValid({ isValid: true, msg: '' })
        }

        if (!amount) {
            bool = false
            setamountValid({ isValid: false, msg: 'Required' })
        } else {
            setamountValid({ isValid: true, msg: '' })
        }


        return bool;
    }

    const updateHandler = async (e) => {
        e.preventDefault()
        let bool = validate()
        let id = selectedUpdate._id
        console.log(id)
        if (bool) {
            let res = await axios.put(`http://localhost:1923/api/v1/expense/updateById/${id}`, {
                date,
                amount,
                paymentMode: select,
                description,
                email: selectedUpdate.email
            })
            showTaostify(res.data.success, res.data.msg)
            if (res.data.success) {
                handleCloseupdate()
                handleClose()
                getExpense()
                setamount('1')
                setselect('Online')
                setdescription('')
                setdate(new Date().toISOString().slice(0, 10))
                getExpense()
                resetHandler()
            }
        }
    }

    const toPDF = () => {
        const doc = new jsPDF('p')
        doc.text('Expenses', 90, 10)
        // doc.autoTable({});
        doc.autoTable({
            html: '#myTable',
            columns: [0, 1, 2, 3, 4],
            theme: 'grid'
        })
        let finalY = doc.lastAutoTable.finalY; // The y position on the page
        doc.text(20, finalY + 10, `Total Expense:- ${total}`)
        doc.save(`${userLoggedin[0]?.name}'s expense.pdf`)
    }

    const searchFilter = dateRangeArr?.length >= 0 ? dateRangeArr.filter((data, index) => {
        return data.date.includes(search) || data.paymentMode.toLowerCase().includes(search) || data.amount.toString().includes(search) || data.description.toLowerCase().includes(search)
    }) : userExpense.filter((data, index) => {
        return data.date.includes(search) || data.paymentMode.toLowerCase().includes(search) || data.amount.toString().includes(search) || data.description.toLowerCase().includes(search)
    })
    // const searchFilter = userExpense.filter((data, index) => {
    //     return data.date.includes(search) || data.paymentMode.toLowerCase().includes(search) || data.amount.toString().includes(search) || data.description.toLowerCase().includes(search)
    // })
    const searchHandler = (e) => {
        setsearch((e.target.value).toLowerCase())
    }

    const selectHandler = (e) => {
        // setselect(e.target.value)
        setdaySelect(e.target.value)
        setdateRangeArr(null)
        console.log(day366)
        let value = e.target.value
        if (e.target.value != 'Select') {
            if (e.target.value === 'Last7') {
                setuserExpense(sevenDays)
            }
            if (e.target.value === 'Last30') {
                setuserExpense(days30)
            }
            if (e.target.value === 'Last6m') {
                setuserExpense(day180)
            }
            if (e.target.value === 'Last12m') {
                setuserExpense(day366)
            }
        } else {
            getExpense()
        }
    }
    // const prevHandler = ()=>{
    //     if(startIndex!=0){
    //         setstartIndex(startIndex-5)
    //     setendIndex(endIndex-5)
    //     }
    // }
    // const allHandler = () =>{
    //     setstartIndex(0)
    //     setendIndex(searchFilter.length-1)
    //     setname('Hide All')
    //     if(startIndex === 0 && endIndex === searchFilter.length-1){
    //         setstartIndex(0)
    //         setendIndex(4)
    //         setname('Show All')
    //     }
    // }
    //    const nextHandler = () =>{
    //     // if(counter<totalPropercount){
    //     //     console.log('in if')
    //     //     setstartIndex(endIndex+1)
    //     //     setendIndex(endIndex+5)
    //     // }else{
    //     //    console.log('in else')
    //     //    setstartIndex(endIndex+1)
    //     //    setendIndex(endIndex+remaining)
    //     // }
    //     if(endIndex<searchFilter.length){
    //         setstartIndex(startIndex+5)
    //         setendIndex(endIndex+5)
    //     }
    //    }
    const resetHandler = () => {
        setdaySelect('Select')
        setsearch('')
        getExpense()
        setStartDate('')
        setendDate('')
        setdateRangeArr(null)
        // startIndex(0)
        // endIndex(4)
    }

    const dateRangeHandler = () => { // console.log(startDate,endDate) 
        if (startDate === '' || endDate === '') { showTaostify(false, 'Please enter the range') }
        else {
            //  setuserExpense(arr) 
            if (endDate < startDate) {
                let c = endDate;
                setendDate(startDate);
                setStartDate(c); // endDate = startDate; // startDate = endDate; 
            }
            let arr = userExpense.filter((data) => (data.date.slice(0, 10) >= startDate && data.date.slice(0, 10) <= endDate))
            setdateRangeArr(arr)
        }
    }
    let total = 0
    return (
        <>
            <nav className='navbar bg-dark navbar-dark'>
                <div className='container d-flex justify-content-between'>

                    <h5 className='navbar-brand'>Welcome {userLoggedin[0]?.name}</h5>
                    <DropdownButton id="dropdown-basic-button" title="Profile" variant='secondary'>
                        <Dropdown.Item><button onClick={logoutUser} className='w-100 btn btn-light'>Logout</button></Dropdown.Item>
                        <Dropdown.Item><button onClick={deleteUser} className='w-100 btn btn-light'>Delete Account</button></Dropdown.Item>
                    </DropdownButton>

                </div>
            </nav>
            <div className='container'>
                <div className='row mt-3 gap-xl-0 gap-lg-0 gap-md-0 gap-2 align-items-center'>
                    <div className='col-xl-3 col-lg-3 col-md-3 col-12'>
                        <Button variant="warning" className='w-100' onClick={handleShow}>
                            Add Expense
                        </Button>
                    </div>
                    <div className='col-xl-3 col-lg-3 col-md-3 col-12'>
                        <input type="text" value={search} onChange={(event) => searchHandler(event)} className='form-control' placeholder='Search' />
                    </div>
                    <div className='col-xl-3 col-lg-3 col-md-3 col-12'>
                        <select onChange={(event) => selectHandler(event)} value={daySelect} className='form-select'>
                            <option value="Select">All</option>
                            <option value="Last7">Last 7 days</option>
                            <option value="Last30">Last 30 days</option>
                            <option value="Last6m">Last 6 months</option>
                            <option value="Last12m">Last 12 months</option>
                        </select>

                    </div>
                    <div className='col-xl-3 col-lg-3 col-md-3 col-12'>
                        <button className='btn btn-danger w-100' type='button' onClick={() => resetHandler()}>Reset</button>
                    </div>
                </div>
                <div className='row mt-2'>
                    <div className='col-4'>
                        <label className='form-label'>Start Date</label>
                        <input type='date' max={new Date().toISOString().slice(0, 10)} value={startDate} onChange={(e) => setStartDate(e.target.value)} className='form-control' />
                    </div>
                    <div className='col-4'>
                        <label className='form-label'>End Date</label>
                        <input type='date' max={new Date().toISOString().slice(0, 10)} min={startDate} value={endDate} disabled={startDate === ''} onChange={(e) => setendDate(e.target.value)} className='form-control' />
                    </div> <div className='col-4 mt-4'> <button onClick={dateRangeHandler} type='button' className='w-100 btn btn-dark mt-1'>Apply</button> </div> </div>
                <Modal className='modal-lg' show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Expense</Modal.Title>
                    </Modal.Header>
                    <form action='#' onSubmit={(event) => submitHandler(event)}>
                        <Modal.Body>
                            <label className='form-label'>Date</label>
                            <input onChange={(event) => { setdate(event.target.value) }} value={date} type="date" className='form-control' />
                            <p className='text-danger' hidden={dateValid.isValid}>{dateValid.msg}</p>
                            <label className='form-label'>Amount</label>
                            <input onChange={(event) => setamount(event.target.value)} value={amount} type="number" step="0.1" min={"1"} className='form-control' />
                            <p className='text-danger' hidden={amountValid.isValid}>{amountValid.msg}</p>
                            <label className='form-label'>Payment Mode</label>
                            <select value={select} onChange={(event) => setselect(event.target.value)} className='form-select'>
                                <option value="Online">Online</option>
                                <option value="Cash" >Cash</option>
                                <option value="Card">Card</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                            <label className='form-label'>Description</label>
                            <textarea value={description} onChange={(event) => setdescription(event.target.value)} className='form-control' rows="3"></textarea>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='btn btn-success'>Submit</button>
                        </Modal.Footer>
                    </form>
                </Modal>


                <Modal className='modal-lg' show={showupdate} onHide={handleCloseupdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Expense</Modal.Title>
                    </Modal.Header>
                    <form action='#' onSubmit={(event) => updateHandler(event)}>
                        <Modal.Body>
                            <label className='form-label'>Date</label>
                            <input onChange={(event) => { setdate(event.target.value) }} value={date} type="date" className='form-control' />
                            <p className='text-danger' hidden={dateValid.isValid}>{dateValid.msg}</p>
                            <label className='form-label'>Amount</label>
                            <input onChange={(event) => setamount(event.target.value)} value={amount} type="number" step="0.1" min={"1"} className='form-control' />
                            <p className='text-danger' hidden={amountValid.isValid}>{amountValid.msg}</p>
                            <label className='form-label'>Payment Mode</label>
                            <select value={select} onChange={(event) => setselect(event.target.value)} className='form-select'>
                                <option value="Online">Online</option>
                                <option value="Cash" >Cash</option>
                                <option value="Card">Card</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                            <label className='form-label'>Description</label>
                            <textarea value={description} onChange={(event) => setdescription(event.target.value)} className='form-control' rows="3"></textarea>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className='btn btn-success'>Update</button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
            <div className='container'>

                <hr className="mt-4" />
                <div className='table-responsive mt-4' style={{ overflowX: "auto", height: "350px" }}>
                    <table className='table table-fixed' id='myTable'>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {userExpense?.map((data, index) => {
                                
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data.date.slice(0, 10)}</td>
                                        <td>{data.amount}</td>
                                        <td>{data.paymentMode}</td>
                                        <td>{data.description}</td>
                                        <td className='d-flex gap-2'>
                                            <button className="btn btn-info" onClick={() => editExpense(data)}>Edit</button>
                                            <button className="btn btn-outline-danger" onClick={() => deleteExpense(data._id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })} */}

                            {
                                searchFilter.length > 0 ?

                                    searchFilter?.map((data, index) => {
                                        // settotalExpenses(total+=data.amount)
                                        total += data.amount
                                        //    if(index>=startIndex && index<=endIndex)
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data.date.slice(0, 10)}</td>
                                                <td>{data.amount}</td>
                                                <td>{data.paymentMode}</td>
                                                <td>{data.description}</td>
                                                <td className='d-flex gap-2'>
                                                    <button className="btn btn-info" onClick={() => editExpense(data)}>Edit</button>
                                                    <button className="btn btn-outline-danger" onClick={() => deleteExpense(data._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr>
                                        <td colSpan={6} className='text-center'> <h5> No data Found...</h5></td>
                                    </tr>}
                        </tbody>

                    </table>
                </div>
                <hr />
                <div className='d-flex justify-content-around mb-4'>
                    <button className='btn btn-dark' onClick={toPDF} hidden={searchFilter.length > 0 ? false : true}>Export Pdf</button>
                    <h5>Total Expense:- {total}</h5>
                    {/* <div className='d-flex gap-2'> */}
                    {/* <button className='btn btn-dark' onClick={allHandler}>{name}</button> */}
                    {/* <button className='btn btn-dark' onClick={prevHandler} disabled={startIndex===0}>Previous</button>
                        <button onClick={nextHandler} className='btn btn-dark' disabled={endIndex+1>=searchFilter.length?true:false}>Next</button> */}
                    {/* </div> */}
                </div>
            </div >
        </>
    )
}

export default UserDashboard

//11 start = 0 end = 4
//if(length != end +1){start+5 end+5}