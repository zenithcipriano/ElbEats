import React  from 'react';
import { MdMailOutline } from "react-icons/md";
import { FaRegUser, FaRegEye } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbPasswordUser, TbEyeClosed } from "react-icons/tb";
import "./login.css";
import axios from 'axios';
// import Cookies from "universal-cookie";

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
    }

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
        type1: 1,})
        // type1: -1,})
    }

    handleSubmit(event) {
        event.preventDefault();
        // Login
        if(this.state.loginValue) {
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
                    console.log(this.state.cookies);
                    // cookies.remove("authToken");

                    localStorage.setItem("user_reference", res.data.id);
                    localStorage.setItem("user_type", res.data.type);
                    this.state.checkLog();
                    alert(res.data.message)
                } else{
                    alert(res.data.message)
                }
            })

        // Signup
        } else {
            if(this.state.password.localeCompare(this.state.confirmPassword) == 0) {
                if (this.state.type1 != -1) {
                    axios({
                        method: 'post',
                        url: process.env.REACT_APP_API_URL+"/signup",
                        data: {
                            username: this.state.username,
                            email: this.state.email,
                            password: this.state.password,
                            type: this.state.type1
                        }
                    }).then((res) => {
                        if(res.data.success){
                            this.resetValues()
                            alert(res.data.message)
                        } else {
                            alert(res.data.message)
                        }
                    })
                } else {
                    alert("User type: Reviewer or Owner?")
                }
            } else {
                alert("Password does not match!")
            }
        }
    }

    sendEmail(event) {
        event.preventDefault();
        alert(this.state.email);
    }

    verifyPin(event) {
        event.preventDefault();
        if(this.state.email == "") {
            alert("Please enter your email address.");
        } else {
            alert(this.state.pin);
            this.setState({resetPasswordValue: true, forgotPasswordValue: false, loginValue:true,
            showpassword:false, showConPas: false, password:"", confirmPassword:""})
        }
    }

    resetPassword(event) {
        event.preventDefault()
        if(this.state.password.localeCompare(this.state.confirmPassword) == 0) {
            alert(this.state.password);
            this.setState({resetPasswordValue: false, forgotPasswordValue: false, loginValue:true, 
                password:"", confirmPassword:"", showpassword: false})
        } else {
            alert("Passwords do not match");
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

    style1 = {
        opacity: 0.5
    }

    // centerHeight() {
    //     console.log(window.innerHeight);

    // }
    render() {
        return this.state.resetPasswordValue?
        <div className='Login'>
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
        <div className='Login'>
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
        <div className='Login'>
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
                    {/* <a onClick={() => this.forgot(true)}>Forgot Password?</a> */}
                    <p>Don't have an account? <a onClick={() => this.signup(false)}>Sign Up</a></p>
                </div>:
                <div>
                    <p>Already have an account? <a onClick={() => this.signup(true)}>Log In</a></p>
                </div>
            }
        </div>
    }
}
export default Login;