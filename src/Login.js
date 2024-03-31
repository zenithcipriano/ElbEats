import React  from 'react';
import { MdMailOutline } from "react-icons/md";
import { FaRegUser, FaRegEye } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { TbPasswordUser, TbEyeClosed } from "react-icons/tb";
import "./login.css";

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
            showConPas: false
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

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.loginValue) {
            alert(this.state.username + " | " + this.state.password)
        } else {
            alert(this.state.username + " | " + this.state.email + " | " + this.state.password + " | " + this.state.confirmPassword)
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
                password:"", confirmPassword:"", showpassword: false, showpassword: false})
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

    render() {
        return this.state.resetPasswordValue?
        <div className='Login'>
            <h1>Reset Password</h1>
            <p>Enter a new password for {this.state.email}</p>

            <form onSubmit={this.resetPassword}>
            <RiLockPasswordLine />
            <input required type={this.state.showpassword?"text":"password"} value={this.state.password} onChange={this.handleChangePassword} placeholder='Password'/> 
            {!this.state.showpassword?<FaRegEye onClick={() => this.showPasFun(true, 1)}/>:<TbEyeClosed onClick={() => this.showPasFun(false, 1)}/>} <br/>

            <RiLockPasswordLine />
            <input required type={this.state.showConPas?"text":"password"} value={this.state.confirmPassword} onChange={this.handleChangeConPas} placeholder='Confirm Password'/> 
            {!this.state.showConPas?<FaRegEye onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed onClick={() => this.showPasFun(false, 2)}/>} <br/>
            <input type="submit" value="Reset Password"/>
            </form>
        </div>
        : this.state.forgotPasswordValue?
        <div className='Login'>
            <h1>Forgot Password</h1>
            <p>Enter the email address associated with your account and we'll send you a code to confirm your identity.</p>

            <form onSubmit={this.sendEmail}>
                <MdMailOutline />
                <input required type="email" value={this.state.email} onChange={this.handleChangeEmail} placeholder='Email'/> <br/>
                <input type="submit" value="Send Code" />    
            </form>

            <form onSubmit={this.verifyPin}>
                <TbPasswordUser />
                <input required type="text" value={this.state.pin} onChange={this.handleChangePin} placeholder='PIN'/> <br/>
                <input type="submit" value="Continue" />    
            </form>

            <a onClick={() => this.forgot(false)}>Back to log in</a>
        </div>:
        <div className='Login'>
            {this.state.loginValue? 
                <div>
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to login</p>
                </div>:<div>
                    <h1>Sign Up</h1>
                    <p>Create your account</p>
                </div>
            }

            <form onSubmit={this.handleSubmit}>
                <FaRegUser />
                <input required type="text" value={this.state.username} onChange={this.handleChangeUsername} placeholder='Username'/> <br/>
                {!this.state.loginValue? 
                    <div>
                        <MdMailOutline />
                        <input required type="email" value={this.state.email} onChange={this.handleChangeEmail} placeholder='Email'/> <br/>
                    </div>
                    : <div></div>
                }
                <RiLockPasswordLine />
                <input required type={this.state.showpassword?"text":"password"} value={this.state.password} onChange={this.handleChangePassword} placeholder='Password'/> 
                {!this.state.showpassword?<FaRegEye onClick={() => this.showPasFun(true, 1)}/>:<TbEyeClosed onClick={() => this.showPasFun(false, 1)}/>} <br/>
                {!this.state.loginValue? 
                    <div>
                        <RiLockPasswordLine />
                        <input required type={this.state.showConPas?"text":"password"} value={this.state.confirmPassword} onChange={this.handleChangeConPas} placeholder='Confirm Password'/> 
                        {!this.state.showConPas?<FaRegEye onClick={() => this.showPasFun(true, 2)}/>:<TbEyeClosed onClick={() => this.showPasFun(false, 2)}/>} <br/>
                    </div>
                    : <div></div>
                }
                <input type="submit" value={this.state.loginValue?"Login":"Sign Up"} />
            </form>

            {this.state.loginValue? 
                <div>
                    <a onClick={() => this.forgot(true)}>Forgot Password?</a>
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