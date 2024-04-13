import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import showTaostify from './showTaostify';
import Swal from 'sweetalert2'
const Admin = () => {
    const navigate = useNavigate()

    const [search, setsearch] = useState('');
    const [userLoggedIn, setuserLoggedIn] = useState(null)
    const [userRegistered, setuserRegistered] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setendDate] = useState('')
    const [dateRangeArr, setdateRangeArr] = useState(null)
    const searchFilter =dateRangeArr?.length >= 0 ? dateRangeArr.filter((data, index) => {
        return data._id.includes(search) || data.name.toLowerCase().includes(search) || data.email.includes(search) || data.createdAt.includes(search)
    }) : userRegistered.filter((data, index) => {
        return data._id.includes(search) || data.name.toLowerCase().includes(search) || data.email.includes(search) || data.createdAt.includes(search)
    })
    const searchHandler = (e) => {
        setsearch((e.target.value).toLowerCase())
    }
    const resetHandler = () => {
        setsearch('')
        getAllUsers()
        setStartDate('')
        setendDate('')
        setdateRangeArr(null)
    }
    //logout admin
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
        // localStorage.removeItem('userLoggedIn')
        // navigate('/')
    }
    const getAllUsers = async () => {
        let res = await axios.get('http://localhost:1923/api/v1/user/allUsers')
        // console.log(res.data)
        setuserRegistered(res.data)
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
            let arr = userRegistered.filter((data) => (data.createdAt.slice(0, 10) >= startDate && data.createdAt.slice(0, 10) <= endDate))
            setdateRangeArr(arr)
        }
    }
    const deleteUser = (email) =>{
        console.log(email)
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
                const res = await axios.delete(`http://localhost:1923/api/v1/user/deleteUser/${email}`)
                if (res.data.success) {
                    
                    Swal.fire({
                        title: "Deleted!",
                        icon: "success",
                        timer:1000
                    });
                    getAllUsers()
                }
            }
        });

    }
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('userLoggedIn'))
        setuserLoggedIn(user)
        getAllUsers()

    }, [])

    return (
    <>
            <nav className='navbar bg-dark navbar-dark'>
                <div className='container d-flex flex-row justify-content-between'>
                    <a className='navbar-brand'>Welcome {userLoggedIn?.user}</a>
                    <button onClick={logoutUser} className='btn btn-light'>Logout</button>
                </div>
            </nav>
            <div className='container'>
                <div className='row mt-3 gap-xl-0 gap-lg-0 gap-md-0 gap-2 justify-content-center'>
                    <div className='col-xl-4 col-lg-4 col-md-4 col-12'>
                        <input type="text" value={search} onChange={(event) => searchHandler(event)} className='form-control' placeholder='Search' />
                    </div>
                    <div className='col-3'>
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
            </div>
            <div className='container'>

                <hr className="mt-4" />
                <div className='table-responsive mt-4' style={{ overflowX: "auto", height: "350px" }}>
                    <table className='table table-fixed' id='myTable'>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>id</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Register Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                searchFilter.length > 0 ?

                                    searchFilter?.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{data._id}</td>
                                                <td>{data.name}</td>
                                                <td>{data.email}</td>
                                                <td>{data.createdAt.slice(0,10)}</td>
                                                <td>
                                                    <button className="btn btn-outline-danger" onClick={()=>deleteUser(data.email)}>Delete</button>
                                                </td>
                                            </tr>
                                        )
                                    }) : <tr>
                                        <td colSpan={6} className='text-center'> <h5> No data Found...</h5></td>
                                    </tr>}
                        </tbody>

                    </table>
                </div>
            </div>
    </>
            )
}
export default Admin