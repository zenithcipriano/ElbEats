import React  from 'react';
import { MdMailOutline } from "react-icons/md";
import { FaRegUser, FaRegEye, FaAngleDown, FaCaretDown } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbPasswordUser, TbEyeClosed } from "react-icons/tb";
import "./login.css";
import axios from 'axios';
import { IoMdArrowRoundBack } from 'react-icons/io';
import ProgressBar1 from './progress';
// import Cookies from "universal-cookie";
import Dropdown from 'react-bootstrap/Dropdown';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            forgotPasswordValue: false,
            resetPasswordValue: false,
            loginValue: true,
            pin: "",
            showpassword: false,
            showConPas: false,
            type1: -1,
            // type1: 1,
            checkLog: props.checkLog,
            cookies: props.cookies,
            page: 0,
            loading: false,
            sex: 'Sex',
            age: '',
            sexClicked: false,
        }

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeConPas = this.handleChangeConPas.bind(this);
        this.handleChangePin = this.handleChangePin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.verifyPin = this.verifyPin.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.signup = this.signup.bind(this);
        this.forgot = this.forgot.bind(this);
        this.chooseType = this.chooseType.bind(this);
        this.resetValues = this.resetValues.bind(this);
        this.changePage = this.changePage.bind(this);

        this.handleAge = this.handleAge.bind(this);
        this.handleSex = this.handleSex.bind(this);
        this.handleSexClicked = this.handleSexClicked.bind(this);

        // this.handleOpenAlert = this.handleOpenAlert.bind(this);
    }

    handleSexClicked(val) {
        this.setState({sexClicked: val});
    }

    handleAge(event) {
        this.setState({age: event.target.value});
    }

    handleSex(val) {
        this.setState({sex: val, sexClicked: false})
    }
    // handleOpenAlert(val) {
    //     this.setState({openAlert: val})
    // }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    handleChangeConPas(event) {
        this.setState({confirmPassword: event.target.value});
    }

    handleChangePin(event) {
        this.setState({pin: event.target.value});
    }

    showPasFun(value, pasnum) {
        if(pasnum == 1) {
            this.setState({showpassword: value})
        } else {
            this.setState({showConPas: value})
        }
    }

    resetValues() {
        this.setState({username: "",
        email: "",
        password: "",
        confirmPassword: "",
        forgotPasswordValue: false,
        resetPasswordValue: false,
        loginValue: true,
        pin: "",
        showpassword: false,
        showConPas: false,
        type1: 1,
        sex: 'Sex',
        age: ''})
        // type1: -1,})
    }

    handleSubmit(event) {
        event.preventDefault();
        if(!this.state.loading) {
            this.setState({loading: true})
        // Login
            if(this.state.page == 1) {
                axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL+"/login",
                    data: {
                        username: this.state.username,
                        password: this.state.password,
                    }
                }).then((res) => {
                    if(res.data.success){
                        this.resetValues()
                        // const cookies = new Cookies();
                        this.state.cookies.set(
                            "authToken",
                            res.data.token,
                        {
                            age: 60*60*24,
                            sameSite: "lax",
                        });
                        console.log(res.data);
                        // cookies.remove("authToken");

                        localStorage.setItem("user_reference", res.data.id);
                        localStorage.setItem("user_type", res.data.type);
                        localStorage.setItem("age", res.data.age);
                        localStorage.setItem("sex", res.data.sex);
                        this.state.checkLog();
                        // this.setState({openAlert: true, message: res.data.message})
                        // this.props.setOpenAlert(true);
                        // this.props.setAlertMess(res.data.message);
                        // this.props.setIsSuccess(true);
                    } else{
                        this.props.setOpenAlert(true);
                        this.props.setAlertMess(res.data.message);
                        this.props.setIsSuccess(false);
                    }
                    this.setState({loading: false})
                })

            // Signup
            } else {
                if(this.state.page == 3 && this.state.sex == 'Sex') {
                    this.props.setOpenAlert(true);
                    this.props.setAlertMess("Missing: Sex")
                    this.props.setIsSuccess(false);
                    this.setState({loading: false})
                    return
                }
                if(this.state.password.localeCompare(this.state.confirmPassword) == 0) {
                    // if (this.state.type1 != -1) {
                    axios({
                        method: 'post',
                        url: process.env.REACT_APP_API_URL+"/signup",
                        data: this.state.page == 2 ? {
                            username: this.state.username,
                            email: this.state.email,
                            password: this.state.password,
                            type: 1
                        } : {
                            username: this.state.username,
                            email: this.state.email,
                            password: this.state.password,
                            type: 0,
                            age: this.state.age,
                            sex: this.state.sex == 'Male' ? 'M' : 'F'
                        }
                    }).then((res) => {
                        if(res.data.success){
                            // this.resetValues()
                            // alert(res.data.message)
                            this.resetValues()
                            // const cookies = new Cookies();
                            this.state.cookies.set(
                                "authToken",
                                res.data.token,
                            {
                                age: 60*60*24,
                                sameSite: "lax",
                            });
                            console.log(this.state.cookies);
                            // cookies.remove("authToken");

                            console.log(res.data.age);
                            console.log(res.data.sex);

                            localStorage.setItem("user_reference", res.data.id);
                            localStorage.setItem("user_type", res.data.type);
                            localStorage.setItem("age", res.data.age);
                            localStorage.setItem("sex", res.data.sex);
                            this.state.checkLog();
                            
                            // this.props.setOpenAlert(true);
                            // this.props.setAlertMess(res.data.message);
                            // this.props.setIsSuccess(true);
                        } else {
                            this.props.setOpenAlert(true);
                            this.props.setAlertMess(res.data.message);
                            // this.props.setAlertMess("Error! Please contact Ms. Cipriano.");
                            this.props.setIsSuccess(false);
                        }
                        this.setState({loading: false})
                    })
                    // } else {
                    //     alert("User type: Reviewer or Owner?")
                    // }
                } else {
                    this.props.setOpenAlert(true);
                    this.props.setAlertMess("Password does not match!")
                    this.props.setIsSuccess(false);
                    this.setState({loading: false})
                }
            }
        }
    }

    sendEmail(event) {
        event.preventDefault();
        this.props.setOpenAlert(true);
        this.props.setAlertMess(this.state.email);
        this.props.setIsSuccess(true);
    }

    verifyPin(event) {
        event.preventDefault();
        if(this.state.email == "") {
            this.props.setOpenAlert(true);
            this.props.setAlertMess("Please enter your email address.");
            this.props.setIsSuccess(false);
        } else {
            // this.props.setOpenAlert(true);
            // this.props.setAlertMess(this.state.pin);
            // this.props.setIsSuccess(true);

            this.setState({resetPasswordValue: true, forgotPasswordValue: false, loginValue:true,
            showpassword:false, showConPas: false, password:"", confirmPassword:""})
        }
    }

    resetPassword(event) {
        event.preventDefault()
        if(this.state.password.localeCompare(this.state.confirmPassword) == 0) {
            // alert(this.state.password);
            this.setState({resetPasswordValue: false, forgotPasswordValue: false, loginValue:true, 
                password:"", confirmPassword:"", showpassword: false})
        } else {
            this.props.setOpenAlert(true);
            this.props.setAlertMess("Passwords do not match");
            this.props.setIsSuccess(false);
        }
    }

    signup(val) {
        this.setState({loginValue: val, resetPasswordValue: false, forgotPasswordValue: false})
    }

    forgot(val) {
        this.setState({forgotPasswordValue: val, resetPasswordValue: false})
    }

    chooseType(val) {
        this.setState({type1: val})
    }

    changePage(val) {
        this.setState({page: val})
    }

    style1 = {
        opacity: 0.5
    }

    // centerHeight() {
    //     console.log(window.innerHeight);

    // }
    render() {
        if(this.state.loading) {
            return <div style={{
                height: 2*window.innerHeight/3,
                alignContent: 'center'}}>
                <ProgressBar1 height={200}/>
            </div>
        } else {
            return <div style={{
                alignContent: 'center',
                height: window.innerHeight-(95*2),
                marginTop: this.props.isMobile ? 0 : 15
            }}>
                {
                this.state.page == 0 ? 
                    <div className='Login' style={{maxWidth: 320, width: window.innerWidth-40, border: this.props.isMobile ? "" : "1px solid #6e2323"}}>
                        <h1>Welcome</h1>
                        <h2 className='pageLabelOpening' onClick={() => this.changePage(2)}><u>Do you want to register your establishment?</u></h2>
                        <h2 className='pageLabelOpening' style={{marginTop: 20}} onClick={() => this.changePage(1)}><u>Do you already have an account?</u></h2>
                        <h2 className='pageLabelOpening' onClick={() => this.changePage(3)}><u>Do you want to create a user account?</u></h2>
                    </div>
                : this.state.page == 1 ?
                    <div className='Login' style={{maxWidth: 320, width: window.innerWidth-40, border: this.props.isMobile ? "" : "1px solid #6e2323"}}>
                        <table style={{position: 'relative', margin: -30, marginLeft: 0}}>
                            <tr>
                                <td><IoMdArrowRoundBack size={40} onClick={() => this.changePage(0)}/></td>
                            </tr>
                        </table>
                        <h1>Welcome Back</h1>
                        <p className='pageLabel'>Enter your credentials to login</p>

                        <form onSubmit={this.handleSubmit}>
                            <div className='loginInput'>
                                <FaRegUser className='icon' />
                                <input required className='textLogin' type="text" value={this.state.username} onChange={this.handleChangeUsername} placeholder='Username'/> <br/>
                            </div>
                            
                            <div className='loginInput'>
                            <RiLockPasswordLine className='icon'/>
                            <input className='lockinput' required type={this.state.showpassword?"text":"password"} value={this.state.password} onChange={this.handleChangePassword} placeholder='Password'/> 
                            {!this.state.showpassword?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 1)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 1)}/>} <br/>
                            </div>
                            <input style={{width: 235}} type="submit" value={"Login"} />
                        </form>
                        <p onClick={() => this.changePage(2)}><u>Do you want to register your establishment?</u></p>
                        <p onClick={() => this.changePage(3)} style={{marginBottom: -5}}><u>Do you want to create a user account?</u></p>
                    </div>
                : <div className='Login' style={{maxWidth: 320, width: window.innerWidth-40, border: this.props.isMobile ? "" : "1px solid #6e2323"}}>
                        <table style={{position: 'relative',  margin: -30, marginLeft: 0}}>
                            <tr>
                                <td><IoMdArrowRoundBack size={40} onClick={() => this.changePage(0)}/></td>
                            </tr>
                        </table>
                        
                        <h1>Sign Up</h1>
                        <p className='pageLabel'>Create your {this.state.page == 2? "owner" : "customer"} account</p>
                        
                        <form onSubmit={this.handleSubmit}>
                            <div className='loginInput'>
                                <FaRegUser className='icon' />
                                <input required className='textLogin' type="text" value={this.state.username} onChange={this.handleChangeUsername} placeholder='Username'/> <br/>
                            </div>

                            <div className='loginInput'>
                                <MdMailOutline className='icon' />
                                <input required className='textLogin' type="email" value={this.state.email} onChange={this.handleChangeEmail} placeholder='Email'/> <br/>
                            </div>

                            <div className='loginInput'>
                            <RiLockPasswordLine className='icon'/>
                            <input className='lockinput' required type={this.state.showpassword?"text":"password"} value={this.state.password} onChange={this.handleChangePassword} placeholder='Password'/> 
                            {!this.state.showpassword?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 1)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 1)}/>} <br/>
                            </div>

                            <div className='loginInput'>
                                <RiLockPasswordLine className='icon'/>
                                <input className='lockinput' required type={this.state.showConPas?"text":"password"} value={this.state.confirmPassword} onChange={this.handleChangeConPas} placeholder='Confirm Password'/> 
                                {!this.state.showConPas?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 2)}/>} <br/>
                            </div>

                            <table style={{position: 'relative', width: 220, tableLayout: 'fixed', margin: 'auto'}}>
                                <tr>
                                    <td>
                                        <div className='loginInput' style={{width: "100%", padding: 'auto', marginLeft: -8}}>
                                            <input required className='textLogin' value={this.state.age} onChange={this.handleAge} style={{width: 70, textAlign: 'center', margin: 'auto'}} type="number" placeholder='Age' min={18} max={29} step="1"/> 
                                            {/* {!this.state.showConPas?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 2)}/>} <br/> */}
                                        </div>
                                    </td>
                                    <td>
                                        <div className='loginInput' style={{width: "100%", padding: 0, marginLeft: 5}}>
                                            <Dropdown autoClose={true} style={{width: 100, marginLeft: 5}}>
                                                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{border: "rgba(0,0,0,0)", fontSize: 15, backgroundColor: "rgba(0,0,0,0)"}}>
                                                    <table style={{position: 'relative', padding: 1, marginTop: 2, width: '100%'}} onClick={() => this.handleSexClicked(true)}>
                                                        <tr>
                                                            <td style={{opacity: this.state.sex=='Sex' ? 0.7 : 1, color: this.state.sex=='Sex' ? 'black' : '#6e2323'}}>
                                                                {this.state.sex}
                                                            </td>
                                                            <td>
                                                                <div style={{height: 10}}><FaCaretDown size={20} style={{marginTop: -5}} /></div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </Dropdown.Toggle>

                                                { this.state.sexClicked ?
                                                <Dropdown.Menu style={{border: "#6e2323", backgroundColor: "white", textAlign: 'left', fontSize: 15}}>
                                                    <Dropdown.Item style={{color: "#6e2323", textDecoration: 'none', padding: 5, border: "6e2323"}} onClick={() => this.handleSex('Male')}>Male</Dropdown.Item><br/>
                                                    <Dropdown.Item style={{color: "#6e2323", textDecoration: 'none', padding: 5, border: "6e2323"}} onClick={() => this.handleSex('Female')}>Female</Dropdown.Item>
                                                </Dropdown.Menu> 
                                                : null}
                                            </Dropdown>
                                            {/* <input className='textLogin' style={{width: 70}} required type="number" placeholder='Age' min={18} max={29} step="1"/>  */}
                                            
                                            {/* <RiLockPasswordLine className='icon'/> */}
                                            {/* <input className='lockinput' required type={this.state.showConPas?"text":"password"} value={this.state.confirmPassword} onChange={this.handleChangeConPas} placeholder='Gender'/>  */}
                                            {/* {!this.state.showConPas?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 2)}/>} <br/> */}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <input style={{width: 235}} type="submit" value={"Submit"} />
                        </form>

                        <p onClick={() => this.changePage(1)}><u>Do you already have an account?</u></p>
                        <p style={{marginBottom: -10}} onClick={() => this.changePage(this.state.page == 2 ? 3 : 2)}><u>{this.state.page != 2 ? "Do you want to register your establishment?" : "Do you want to create a user account?"}</u></p>
                    </div>
                }

                {/* {
                this.state.resetPasswordValue?
                <div className='Login' 
                // style={{marginTop: window.innerHeight - 400}}
                >
                    <h1>Reset Password</h1>
                    <p className='pageLabel'>Enter a new password for {this.state.email}</p>

                    <form onSubmit={this.resetPassword}>
                    <div className='loginInput'>
                    <RiLockPasswordLine className='icon'/>
                    <input className='lockinput' required type={this.state.showpassword?"text":"password"} value={this.state.password} onChange={this.handleChangePassword} placeholder='Password'/> 
                    {!this.state.showpassword?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 1)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 1)}/>} <br/>
                    </div>

                    <div className='loginInput'>
                    <RiLockPasswordLine className='icon'/>
                    <input className='lockinput' required type={this.state.showConPas?"text":"password"} value={this.state.confirmPassword} onChange={this.handleChangeConPas} placeholder='Confirm Password'/> 
                    {!this.state.showConPas?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 2)}/>} <br/>
                    </div>

                    <input type="submit" value="Reset Password"/>
                    </form>
                </div>
                : this.state.forgotPasswordValue?
                <div className='Login' 
                // style={{marginTop: window.innerHeight - 400}}
                >
                <h1>Forgot Password</h1>
                    <p className='pageLabel'>Enter the email address associated with your account and we'll send you a code to confirm your identity.</p>

                    <form onSubmit={this.sendEmail}>
                        <div className='loginInput'>
                        <MdMailOutline className='icon'/>
                        <input required className='textLogin' type="email" value={this.state.email} onChange={this.handleChangeEmail} placeholder='Email'/> <br/>
                        </div>
                        <input type="submit" value="Send Code" />    
                    </form>

                    <form onSubmit={this.verifyPin}>
                        <div className='loginInput'>
                        <TbPasswordUser className='icon'/>
                        <input required className='textLogin' type="text" value={this.state.pin} onChange={this.handleChangePin} placeholder='PIN'/> <br/>
                        </div>
                        <input type="submit" value="Continue" />    
                    </form>

                    <div className="clickableText">
                    <a onClick={() => this.forgot(false)}>Back to login</a>
                    </div>
                </div>:
                <div className='Login' 
                // style={{marginTop: (window.innerHeight - (400 + 97))/2}}
                >
                    {this.state.loginValue? 
                        <div>
                            <h1>Welcome Back</h1>
                            <p className='pageLabel'>Enter your credentials to login</p>
                        </div>:<div>
                            <h1>Sign Up</h1>
                            <p className='pageLabel'>Create your account</p>
                        </div>
                    }

                    <form onSubmit={this.handleSubmit}>
                        <div className='loginInput'>
                        <FaRegUser className='icon' />
                        <input required className='textLogin' type="text" value={this.state.username} onChange={this.handleChangeUsername} placeholder='Username'/> <br/>
                        </div>
                        
                        {!this.state.loginValue? 
                            <div className='loginInput'>
                                <MdMailOutline className='icon' />
                                <input required className='textLogin' type="email" value={this.state.email} onChange={this.handleChangeEmail} placeholder='Email'/> <br/>
                            </div>
                            : <div></div>
                        }

                        <div className='loginInput'>
                        <RiLockPasswordLine className='icon'/>
                        <input className='lockinput' required type={this.state.showpassword?"text":"password"} value={this.state.password} onChange={this.handleChangePassword} placeholder='Password'/> 
                        {!this.state.showpassword?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 1)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 1)}/>} <br/>
                        </div>

                        {!this.state.loginValue? 
                            <div className='loginInput'>
                                <RiLockPasswordLine className='icon'/>
                                <input className='lockinput' required type={this.state.showConPas?"text":"password"} value={this.state.confirmPassword} onChange={this.handleChangeConPas} placeholder='Confirm Password'/> 
                                {!this.state.showConPas?<FaRegEye className='icon' onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed className='icon' onClick={() => this.showPasFun(false, 2)}/>} <br/>
                            </div>
                            : <div></div>
                        }

                        {!this.state.loginValue? 
                            <div>
                                <input type="button" className='buttonUser' id="user1" value={"Reviewer"} style={this.state.type1 == 1 ? this.style1 : {}} onClick={() => this.chooseType(0)} /> 
                                <input type="button" className='buttonUser' value={"Owner"} style={this.state.type1 == 0 ? this.style1 : {}} onClick={() => this.chooseType(1)}/>
                            </div>
                            : <div></div>
                        }
                        <input type="submit" value={this.state.loginValue?"Login":"Sign Up"} />
                    </form>

                    {this.state.loginValue? 
                        <div className="clickableText">
                            <a onClick={() => this.forgot(true)}>Forgot Password?</a>
                            <p>Don't have an account? <a onClick={() => this.signup(false)}>Sign Up</a></p>
                        </div>:
                        <div>
                            <p>Already have an account? <a onClick={() => this.signup(true)}>Log In</a></p>
                        </div>
                    }
                </div>
                } */}
            {/* <AlertModal open={this.state.openAlert} handleClose={() => this.handleOpenAlert(false)} message={this.state.message}/> */}
            </div>
        }
    }
}
export default Login;