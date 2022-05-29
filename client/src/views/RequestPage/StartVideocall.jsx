// import React, { useEffect, useState } from "react";
// //import { Redirect } from "react-router-dom";
// import classNames from "classnames";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import useAgora from '../../utils/agoraHooks';
// import MediaPlayer from '../../utils/agoraMedia';
// import axios from "axios";
// import qs from "querystring";
// //service config
// import configApi from "../../services/config.json";
// // @material-ui/core components
// import withStyles from "@material-ui/core/styles/withStyles";
// // core components
// import Header from "components/Header/Header.jsx";
// import Footer from "components/Footer/Footer.jsx";
// import GridContainer from "components/Grid/GridContainer.jsx";
// import GridItem from "components/Grid/GridItem.jsx";
// import HeaderLinks from "components/Header/HeaderLinks.jsx";
// import Button from "components/CustomButtons/Button.jsx";
// import Card from "components/Card/Card.jsx";
// import CardBody from "components/Card/CardBody.jsx";
// import Slide from "@material-ui/core/Slide";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogActions from "@material-ui/core/DialogActions";
// import Call from "@material-ui/icons/Call";
// import CallEnd from "@material-ui/icons/CallEnd";
// import Mic from "@material-ui/icons/Mic";
// import MicOff from "@material-ui/icons/MicOff";
// import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
// import image from "assets/img/bg7.jpg";
// import videobg from "assets/img/ag-index-background-min.png";
// import "../../App.css";

// function Transition(props) {
//   return <Slide direction="down" {...props} />;
// }

// const client = AgoraRTC.createClient({
//       codec: "h264", //h264
//       mode: "rtc",
// });

// const StartVideoRec = props => {
//   const {
//     classes,
//     location: { data },
//     ...rest
//   } = props;
//   const [cardAnimaton, setCardAnimaton] = useState("cardHidden");
//   const [error, setError] = useState("");
//   const [modal, setModal] = useState(false);
//   const [dialogMessage, SetDialogMssg] = useState("");
//   const [callstarted, SetCallstarted] = useState(false);
//   const [isloaded, setLoading] = useState(false);

//   //Pass by props
//   const [requestStatus, setRequestStatus] = useState("created");
//   const [remoteUname, setRemoteUname] = useState("");
//   const [localUserName, setLocalUsername] = useState("");
//   const [remoteUserPic, setRemoteUserPic] = useState("");
//   const [duration, setDuration] = useState(0);
//   const [minutes, setMinutes] = useState(0);
//   const [seconds, setSeconds] = useState(0);
//   const [counterDownActive, setCounterDownActive] = useState(false);
//   const [superUser, setUserType] = useState(false);
//   const [purpose, setPurpose] = useState("");
//   const [requestId, setRequestID] = useState(0);

//   //Agora Data
//   const [agorauid, setAgoraUID] = useState(0);
//   const [channelName, setChannelName] = useState("");
//   const [audMute, setAudMute] = useState(true);

//   const {
//     localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers
//   } = useAgora(client);


//   const imageClasses = classNames(
//     classes.imgRaised,
//     classes.imgRoundedCircle,
//     classes.imgFluid
//   );

//   if (!!qs.parse(props.location.search)["?rand"] === false) {
//     if (!props.location.hasOwnProperty("data"))
//       window.location.replace(`/dashboard`);
//   }

//   const validatHash = () => {
//     const hash = qs.parse(props.location.search)["?rand"];
//     axios
//       .post(configApi.validatevideocalljoiner, {
//         hash
//       })
//       .then(res => {
//         const responStatus = res.data;
//         if (!responStatus.success) return window.location.replace(`/dashboard`);
//         const shoutoutid = responStatus.response[0].shoutoutid;
//         setRequestID(shoutoutid);
//         setLocalUsername(responStatus.response[0].joiner[0].name);
//         setRemoteUname(responStatus.response[0].influencer[0].name);
//         setRemoteUserPic(responStatus.response[0].influencer[0].picture);
//         setPurpose(responStatus.response[0].calldetails[0].message_shoutout);
//         setRequestStatus(responStatus.response[0].calldetails[0].status);
//         setAgoraUID(responStatus.response[0].joiner[0].id);
//         setChannelName(`#FBN-19-${shoutoutid}`);
//         setDuration(responStatus.response[0].calldetails[0].call_duration);
//         setMinutes(responStatus.response[0].calldetails[0].call_duration);
//         setUserType(false);
//         // loaded
//         setLoading(false);
//       })
//       .catch(err => {
//         console.warn(err);
//       });
//   };

//   // join from link
//   useEffect(
//     () => {
//       console.log("channelNamechannelName", channelName);
//       if (agorauid !== 0 && channelName !== "" && !superUser) {
//         //console.log("WHATS IS THIS", superUser);
//         startCall();
//       }
//     },
//     [isloaded]
//   );

//   useEffect(() => {
//     if (props.location.hasOwnProperty("data")) {
//       setRequestID(data.requestId);
//       setLocalUsername(data.username);
//       setRemoteUname(data.remoteUserName);
//       setRemoteUserPic(data.remoteUserPic);
//       setPurpose(data.purpose);
//       setRequestStatus(data.requestStatus);
//       setAgoraUID(data.agora_uid);
//       setChannelName(data.channelname);
//       setDuration(data.duration);
//       setMinutes(data.duration);
//       setUserType(data.superUser);
//     } else {
//       setLoading(true);
//       validatHash();
//     }

//     setTimeout(
//       function() {
//         setCardAnimaton("");
//       }.bind(this),
//       700
//     );
//   }, []);

//   const handleGranted = () => {
//     this.setState({ granted: true });
//   };

//   const handleDenied = err => {
//     this.setState({ rejectedReason: err.name });
//   };

//   useEffect(
//     () => {
//       let interval = null;
//       if (counterDownActive) {
//         interval = setInterval(() => {
//           if (seconds > 0) {
//             setSeconds(seconds => seconds - 1);
//           } else if (seconds === 0) {
//             if (minutes === 0) {
//               setCounterDownActive(false);
//               expireEndCall();
//               return;
//             }
//             setSeconds(59);
//             setMinutes(minutes => minutes - 1);
//           } else {
//             expireEndCall();
//           }
//         }, 1000);
//       } else if (minutes === 0 && seconds === 0) {
//         clearInterval(interval);
//       }
//       return () => clearInterval(interval);
//     },
//     [seconds, minutes, counterDownActive]
//   );

//   // Effect to start the clock when both users join
//   useEffect(
//     () => {
//       if(remoteUsers.length > 0) {
//         setCounterDownActive(true); 
//       }else {
//         setCounterDownActive(false); 
//       }
//   },[remoteUsers])

//   const sendReminder = mssg => {
//     axios
//       .post(configApi.remindervideocallbooking, {
//         callername: localUserName,
//         jtoken: localStorage.getItem("token"),
//         messagetype: mssg,
//         shoutoutId: requestId
//       })
//       .then(() => {
//         SetDialogMssg(
//           `A call reminder sent to ${remoteUname}, Please give them some minutes to join.`
//         );
//         setModal(true);
//       })
//       .catch(() => {
//         //console.log("🤯🔥", e);
//       });
//   };

 
//   const expireEndCall = () => {
//     endCall();
//     SetDialogMssg(`Call Ended; time booked expired. Thank you`);
//     setModal(true);
//   };

//   const endCall = () => {
//     leave();
//   };

//   const startCall = () => {
//     join(configApi.vidtoken, channelName, null, agorauid)
//     SetCallstarted(true);

//     if (superUser) {
//       updateCallStatus("processing");
//     }
//   };


//   const toggleMute = () => {
//     if (audMute) {
//       if(localAudioTrack == undefined || localAudioTrack == null) return;
      
//       localAudioTrack.stop();
//     } else {
//       if(localAudioTrack == undefined || localAudioTrack == null) return;
      
//       localAudioTrack.play();
//     }
//     setAudMute(!audMute);
//   };

//   const updateCallStatus = status => {
//     axios
//       .post(configApi.updatevideocallstatus, {
//         requestId,
//         callername: localUserName,
//         requestStatus: status,
//         jtoken: localStorage.getItem("token")
//       })
//       .then(() => {
//         // SetDialogMssg(`Call is now ${status}.`);
//         // setModal(true); //
//       })
//       .catch(e => {
//         console.log("🤯🔥", e);
//       });
//   };

//   return (
//     <div>
//       <Header
//         color="transparent"
//         brand="Fanbies"
//         rightLinks={<HeaderLinks />}
//         absolute
//         {...rest}
//       />
//       <div
//         className={classes.pageHeader}
//         style={{
//           backgroundImage: "url(" + image + ")",
//           backgroundSize: "cover",
//           backgroundPosition: "top center"
//         }}
//       >
//         <div className={classes.container}>
//           <GridContainer justify="flex-end">
//             <GridItem xs={5} sm={5} md={8}>
//               <GridContainer justify="center">
//                 <GridItem xs={12} sm={12} md={12} className="content-center">
//                   {remoteUsers.length > 0 ? (
//                     remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
//                     <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
//                   </div>))
//                   ) : (
//                     <img
//                       src={videobg}
//                       className="placeholder-video-img"
//                     />
//                   )}
//                 </GridItem>
//                 <GridItem xs={12} sm={12} md={12}>
//                   <div className="controls d-flex text-center">
//                     <>
//                       {callstarted ? (
//                         <Button
//                           onClick={() => endCall()}
//                           justIcon
//                           round
//                           color="danger"
//                         >
//                           <CallEnd />
//                         </Button>
//                       ) : null}
//                       {!callstarted && superUser ? (
//                         <Button
//                           onClick={() => startCall()}
//                           justIcon
//                           round
//                           color="danger"
//                         >
//                           <Call />
//                         </Button>
//                       ) : null }
//                       <Button
//                         onClick={() => toggleMute()}
//                         justIcon
//                         round
//                         color="warning"
//                         className="m-h-lg"
//                       >
//                         {audMute ? <Mic /> : <MicOff />}
//                       </Button>
//                     </>
//                   </div>
//                 </GridItem>
//               </GridContainer>
//             </GridItem>
//             <GridItem xs={4} sm={4} md={4}>
//               <div>
//                 <p className="font-size-md text-center">
//                   Duration of Call Booked : {duration} mins
//                 </p>
//                 <p className="m-v-xl font-size-lg text-center">
//                   {minutes === 0 && seconds === 0 ? (
//                     <span>Finished</span>
//                   ) : (
//                     <p className="font-size-xxl">
//                       {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//                     </p>
//                   )}
//                 </p>
//                 <Card className={`${classes[cardAnimaton]} m-v-xl`}>
//                   <CardBody>
//                     <h3 className="strong h4 text-center m-a-none m-b-sm">
//                       <span>{error}</span>
//                       <strong>Call with:</strong>
//                       {""} {remoteUname}
//                     </h3>
//                     <div className="m-b-md text-center">
//                       <img
//                         src={remoteUserPic}
//                         alt={remoteUname}
//                         className={`${imageClasses} border-round profileImg-md`}
//                       />
//                     </div>
//                     <p className="m-b-sm">
//                       <strong>Purpose of call:&nbsp;</strong>
//                       <span className="font-size-md">{purpose}</span>
//                     </p>
//                     {superUser &&
//                       callstarted && (
//                         <>
//                           <span className="font-size-sm m-r-md">
//                             Send a reminder call to {remoteUname}.
//                           </span>
//                           <Button
//                             onClick={() => sendReminder("call waiting")}
//                             justIcon
//                             round
//                             color="warning"
//                           >
//                             <i className={"far fa-bell"} />
//                           </Button>
//                         </>
//                       )}
//                   </CardBody>
//                 </Card>
//                 <div className="content-center">
//                   {callstarted ? (
//                     <div className="video_host">
//                     <MediaPlayer videoTrack={localVideoTrack} audioTrack={localAudioTrack}>
//                     </MediaPlayer>
//                     </div>
//                   ) : (
//                     <img
//                       src={videobg}
//                       className="placeholder-video-img"
//                     />
//                   )}
//                 </div>
//               </div>
//             </GridItem>
//           </GridContainer>
//           <Dialog
//             classes={{
//               root: classes.center,
//               paper: classes.modal
//             }}
//             open={modal}
//             TransitionComponent={Transition}
//             keepMounted
//             aria-labelledby="modal-slide-title"
//             aria-describedby="modal-slide-description"
//           >
//             <DialogContent
//               id="modal-slide-description"
//               className={classes.modalBody}
//             >
//               {dialogMessage}
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setModal(false)} color="primary">
//                 Continue
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </div>
//         <Footer whiteFont />
//       </div>
//     </div>
//   );
// };

// export default withStyles(loginPageStyle)(StartVideoRec);
