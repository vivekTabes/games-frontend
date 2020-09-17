import React, { useState, useEffect } from "react";
import "./registration.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { Autocomplete } from "@material-ui/lab";
import ReCAPTCHA from "react-google-recaptcha";
import {createTeam} from '../../actions/registration'
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { FcDisclaimer } from "react-icons/fc";


import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 0,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 0,
    backgroundColor: '#3f51b5',
  },
}))(LinearProgress);


const Disclaimer = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

 function showDisclaimer(msg) {
  return  <Disclaimer
                title={
                  <React.Fragment>   
                  {msg}
                  </React.Fragment>
                  }
                  >
                   <div className="disclaimer">
                    <FcDisclaimer />
                   </div>
         </Disclaimer>
}

function Registration() {
  useEffect(() => {
    var retrievedObject = localStorage.getItem("dataObj");
    if (retrievedObject) {
      setdataObj(JSON.parse(retrievedObject));
    }
    if(localStorage.getItem("fsub")){
      setFsub(true);
      setdataObj({ ...dataObj, successPage: true});
    }
  }, []);
  const levelExp = ["newbie", "Pro", "League level", "Expert", "Coach"];
  const [progressPercent, setProgressPercent] = useState(0);
  const [zipErr, setZipErr] = useState(false);
  const [emailErr,setEmailErr] = useState(false);
  const [conErr,setConErr] = useState(false);
  const [fsub,setFsub]= useState(false);
  const [showErr, setShowErr] = useState(false);
  const recaptchaRef = React.useRef();
  const [gCap, setGCap] = useState(false);
  const [dataObj, setdataObj] = useState({
    proceedFirst: true,
    proceedSecond: false,
    proceedThird: false,
    successPage: false,
    submit: false,
    teamName: "",
    location: "",
    noOfTeamPlayer: "",
    captainName: "",
    dateOfJoining: new Date(),
    levelOfExperiance: "",
    name: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
   progressBar()
 })

  function processedFirst() {
    if(dataObj.location.length > 0 && (dataObj.location<110000 || dataObj.location.length !=6)){
      setZipErr(true);
    }else{
      setZipErr(false);
    }
    if (
      dataObj.teamName &&
      dataObj.location &&
      dataObj.noOfTeamPlayer &&
      dataObj.captainName && !zipErr
    ) {
      setdataObj({ ...dataObj, proceedFirst: false, proceedSecond: true });
    } else {
      setShowErr(true);
    }
  }
  const handleDateChange = (date) => {
    setdataObj({ ...dataObj, dateOfJoining: date });
  };


  function proceedSecond() {
    if (dataObj.dateOfJoining && dataObj.levelOfExperiance) {
      setShowErr(false);
      setdataObj({
        ...dataObj,
        proceedFirst: false,
        proceedSecond: false,
        proceedThird: true,
      });
    } else {
      setShowErr(true);
    }
  }
  function progressBar(){
    if(dataObj.proceedFirst && !fsub){
      return setProgressPercent(25)
    }

    if(dataObj.proceedSecond && !fsub){
      return setProgressPercent(50)
    }
    if(dataObj.proceedThird && !fsub){
      return setProgressPercent(75)
    }
    if(!dataObj.proceedThird || fsub){
      return setProgressPercent(100)
    }
  }
  function cleanUp() {
    localStorage.removeItem("dataObj");
    localStorage.removeItem("fsub");
    window.location.href = "/";
  }

  function submit() {
    let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(dataObj.email.length >0 && !emailPattern.test(dataObj.email)){
      setEmailErr(true);
      return false;
    }else{
      setEmailErr(false);
    }
    if(dataObj.contact.length>0 && (dataObj.contact<6000000000 || dataObj.contact.length!=10)){
      setConErr(true);
      return false;
    }else{
      setConErr(false);
    }
    if (dataObj.name && dataObj.email && dataObj.contact && gCap) {
      setdataObj({
        ...dataObj,
        proceedFirst: false,
        proceedSecond: false,
        proceedThird: false,
        successPage: true,
      })
      localStorage.setItem("dataObj", JSON.stringify(dataObj))
      localStorage.setItem("fsub",true);
    } else {
      setShowErr(true);
    }
    createTeam(dataObj).then(response => {
      if(response.error){
        console.log(response.error)
      }
      console.log(response)
    })
    .catch(err => console.log(err))
  }
  function handleChangeCaptcha(value) {
    setGCap(true);
  }

  function handleChangeExp(e, v) {
    setdataObj({ ...dataObj, levelOfExperiance: v });
    localStorage.setItem("dataObj", JSON.stringify(dataObj));
  }
  function handleChange(e) {
    if (e.target.id === "teamName") {
      const aplhaNum = /^[a-zA-Z0-9]+$/;
      if (e.target.value === "" || aplhaNum.test(e.target.value)) {
        setdataObj({ ...dataObj, [e.target.id]: e.target.value });
      }
    } else if (e.target.id === "location") {
      const zipPattern = /^[0-9]{1,6}$/;
      if (e.target.value === "" || zipPattern.test(e.target.value)) {
        setdataObj({ ...dataObj, [e.target.id]: e.target.value });
      }
    } else if (e.target.id === "noOfTeamPlayer") {
      let playerPattern = /^([1-9]|1[012])$/;
      if (e.target.value === "" || playerPattern.test(e.target.value)) {
        setdataObj({ ...dataObj, [e.target.id]: e.target.value });
      }
    } else if (e.target.id === "captainName" || e.target.id === "name") {
      let nameValidate = /^[a-zA-Z ]*$/;
      if (e.target.value === "" || nameValidate.test(e.target.value)) {
        setdataObj({ ...dataObj, [e.target.id]: e.target.value });
      }
    }
    else if (e.target.id === "contact") {
      let phonePattern = /^[0-9]{1,10}$/;
      if (e.target.value === "" || phonePattern.test(e.target.value)) {
        setdataObj({ ...dataObj, [e.target.id]: e.target.value });
      }
    } else {
      setdataObj({ ...dataObj, [e.target.id]: e.target.value });
    }
    localStorage.setItem("dataObj", JSON.stringify(dataObj));
  }

  return (
    <div className="card">
      <BorderLinearProgress variant="determinate" value={progressPercent} className=""/>
      {dataObj.proceedSecond && !fsub && (
        <Button
          className="Bttn"
          variant="contained"
          color="primary"
          id="backToFirst"
          onClick={() => {
            setdataObj({
              ...dataObj,
              proceedFirst: true,
              proceedSecond: false,
              proceedThird: false,
              successPage: false,
            });
          }}
        >
          Back
        </Button>
      )}
      {dataObj.proceedThird && !fsub && (
        <Button
          className="Bttn"
          variant="contained"
          color="primary"
          id="backToFirst"
          onClick={() => {
            setdataObj({
              ...dataObj,
              proceedFirst: false,
              proceedSecond: true,
              proceedThird: false,
              successPage: false,
            });
          }}
        >
          Back
        </Button>
      )}
      <h1>Football Registration</h1>
      {dataObj.proceedFirst && !fsub && (
        <div>
          <h3 className="heading">List Your Team Information</h3>
          <div className="container eachField col-md-6">
          {showDisclaimer('No Special Character are allowed. Team should be like Abc10,xyz01 etc.')}
            <TextField
              onChange={handleChange}
              label="Team Name"
              id="teamName"
              variant="outlined"
              fullWidth
              required
              value={dataObj.teamName}
              error={showErr && dataObj.teamName === ""}
            />
          </div>
          <div className="container eachField col-md-6">
          {showDisclaimer('Indian 6 digit ZIP code allowed,prefix start with 11-99.')}
            <TextField
              onChange={handleChange}
              label="Location/zip code"
              id="location"
              variant="outlined"
              fullWidth
              required
              value={dataObj.location}
              error={showErr && dataObj.location === ""}
            />
            {zipErr && <span className="error">Zip code is not Valid</span>}
          </div>
          <div className="container eachField col-md-6">
          {showDisclaimer('Maximum 12 members are allowed in a team.')}
            <TextField
              onChange={handleChange}
              label="Total Number of players including extras"
              variant="outlined"
              id="noOfTeamPlayer"
              fullWidth
              required
              value={dataObj.noOfTeamPlayer}
              error={showErr && dataObj.noOfTeamPlayer === ""}
            />
          </div>
          <div className="container eachField col-md-6">
            <TextField
              onChange={handleChange}
              id="captainName"
              label="Captain Name"
              variant="outlined"
              fullWidth
              required
              value={dataObj.captainName}
              error={showErr && dataObj.captainName === ""}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              id="proceedFirst"
              onClick={processedFirst}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* step 2 */}
      {dataObj.proceedSecond && !fsub && (
        <div>
          <h3 className="heading">Joining detail and experince detail</h3>
          <div className="container eachField col-md-6">
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}

              className="container eachField col-md-6"
            >
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  margin="normal"
                  className="ml-2 mr-2"
                  id="dateOfJoining"
                  label="Date of Joining"
                  format="dd/MM/yyyy"
                  fullWidth={true}
                  value={dataObj.dateOfJoining}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
          <div className="container eachField col-md-6">

            <Autocomplete
              id="levelOfExperiance"
              options={levelExp}
              getOptionLabel={(option) => option}
              style={{ margin: 10 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Level of Experiance"
                  variant="outlined"
                  fullWidth
                  error={dataObj.levelExp === ""}
                />
              )}
              error={showErr && dataObj.levelOfExperiance === ""}
              value={dataObj.levelOfExperiance}
              onChange={handleChangeExp}
            />

          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              id="proceedSecond"
              onClick={proceedSecond}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
      {/* step 3 */}
      {dataObj.proceedThird && !fsub && (
        <div>
          <h3>Contact details</h3>
          <div className="container eachField col-md-6">
            <TextField
              onChange={handleChange}
              id="name"
              label="Name"
              variant="outlined"
              fullWidth
              required
              value={dataObj.name}
              error={showErr && dataObj.name === ""}
            />

          </div>
          <div className="container eachField col-md-6">
          {showDisclaimer('Email should be formated like abc@xyz.com.')}
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              required
              value={dataObj.email}
              error={showErr && dataObj.email === "" || emailErr}
              onChange={handleChange}
            />
            {emailErr && <span className="error">Email Format is not correct</span>}
          </div>
          <div className="container eachField col-md-6">
          {showDisclaimer('It contain 10 digti number without +91. number with prefix 60-99')}
            <TextField
              id="contact"
              label="Mobile Number"
              variant="outlined"
              fullWidth
              required
              value={dataObj.contact}
              error={showErr && dataObj.contact === "" ||conErr}
              onChange={handleChange}
            />
             {conErr && <span className="error">Mobile number is not correct</span>}
          </div>
          <div className="container eachField col-md-6">
            <div className="row justify-content-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                onChange={handleChangeCaptcha}
              />
            </div>
          </div>
          <div>
            <Button variant="contained" color="primary" onClick={submit}>
              Submit
            </Button>
          </div>
        </div>
      )}
      {(dataObj.successPage || fsub) && (
        <div className="msg">
          <h6>
            Your have Registered SuccessFully. Keep Practicing for the
            Tournament
          </h6>
          <h6>
            We have send unique team BIB number for Your team, pls check Your
            Registered Email id
          </h6>
          <div>
            <Button variant="contained" color="primary" onClick={cleanUp}>
              Wish To Register more
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registration;
