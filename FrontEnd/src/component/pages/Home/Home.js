import React, { useState } from 'react';
import fetch from 'node-fetch';
import './home.css';

const Home=(props)=>{

	const [state, setState] = useState({
		"emailid": "",
		"otp": "",
		"isOTPVerified": false,
		"otpErrMsg": "",
		"pass1": "",
		"pass2": "",
		"passErrMsg": ""
	});

	const changeHandler = (e) => {
		let name = e.target.name;
		let value = e.target.value;
		let allState = state;
		allState[name] = value;
		setState(prevState=>({
    		...prevState,
    		...allState
        }));
	}

	const emailBlur = (e) => {
		let value = e.target.value;
		let allState = state;
		allState["emailid"] = value;
		setState(prevState=>({
    		...prevState,
    		...allState
        }));
	}

	const otpBlur = (e) => {
		let value = e.target.value;
		let allState = state;
		allState["otp"] = value;
		setState(prevState=>({
			...prevState,
			...allState
		}));
	}

	const verifyOTP = () => {
		let allState = state;
		if(allState["otp"] === "9999"){
			allState["isOTPVerified"] = true;
		}else{
			allState["otpErrMsg"] = "Invalid Username / OTP";
		}
		setState(prevState=>({
			...prevState,
			...allState
		}));
	}

	const changePassword = async () => {
		let allState = state;
		validatePassword();
		if(allState["passErrMsg"] === ""){
			// Call API here.
			let URL = "http://127.0.0.1/updateRecords";
			let payload = {
		    	"emailId": allState["emailid"],
				"newPassword": allState["pass1"]
		    };
			let settings = {
		        method: 'POST',
		        headers: {
		            Accept: 'application/json',
		            'Content-Type': 'application/json',
		        },
		        body: JSON.stringify(payload)
		    };
		    try{
		    	let fetchResponse = await fetch(URL, settings);
        		let data = await fetchResponse.json();
        		alert(data.Message);
		    }catch(err){
		    	alert("Something went wrong");
		    }
		}
	}
	const validatePassword = () => {
		let allState = state;
		let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
		let lowercase = /[a-z]/;
		let uppercase = /[A-Z]/;
		let nums = /[0-9]/;
		if(allState["pass1"] !== allState["pass2"]){
			allState["passErrMsg"] = "New and confirm password does not match.";
		}else if(allState["pass1"].length < 8 && allState["pass1"].length > 16){
			allState["passErrMsg"] = "Password length should be between 8 to 16 characters.";
		}else if(!format.test(allState["pass1"])){
			allState["passErrMsg"] = "Password should contain atleast 1 special character.";
		}else if(!lowercase.test(allState["pass1"])){
			allState["passErrMsg"] = "Password should contain atleast 1 lowercase character.";
		}else if(!uppercase.test(allState["pass1"])){
			allState["passErrMsg"] = "Password should contain atleast 1 uppercase character.";
		}else if(!nums.test(allState["pass1"])){
			allState["passErrMsg"] = "Password should contain atleast 1 number.";
		}else{
			allState["passErrMsg"] = "";
		}
		setState(prevState=>({
			...prevState,
			...allState
		}));
	}
    return(
    	<div className="container">
    		{
    		state["isOTPVerified"] === false ?
    		<>
    		<div>
	        	<div>Email ID:</div>
	        	<div>
	        		<input className="txt-box" type="text" name="emailid" onChange={(e)=>changeHandler(e)} onBlur={(e)=>emailBlur(e)} value={state["emailid"]} />
	        		<div className="right-align">Use 9999 as OTP below</div>
	        	</div>
	        </div>
	        <div>
	        	<div>OTP:</div>
	        	<div><input className="txt-box" type="text" maxLength="4" name="otp" onChange={(e)=>changeHandler(e)} value={state["otp"]} onBlur={(e)=>otpBlur(e)} /></div>
	        	<div className="right-align red">{state["otpErrMsg"]}</div>
	        </div>
	        <div>
	        	<div className="right-align">
	        		<button onClick={verifyOTP}>Continue</button>
	        	</div>
	        </div>
	        </>
	        :
	        <div>
	        	<div>New Password:</div>
	        	<div><input type="password" name="pass1" value={state["pass1"]} onChange={changeHandler} /></div>
	        	<div>Retype Password:</div>
	        	<div><input type="password" name="pass2" value={state["pass2"]} onBlur={validatePassword} onChange={changeHandler} /></div>
	        	<div>{state["passErrMsg"]}</div>
	        	<div className="right-align">
	        		<button onClick={changePassword}>Continue</button>
	        	</div>
	        </div>
    		}
        </div>
    )
}
export default Home