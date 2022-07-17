import { useState } from "react";

import PropTypes from "prop-types";

// import material components
import { PayPalButton } from "react-paypal-button-v2";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import MKModal from "components/MKModal";
import MKInput from "components/MKInput";
import MKDatePicker from "components/MKDatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// form validation with Formik
import { useFormik } from "formik";
import * as regex from "regex";
// api call
import { getCookie, bookingShoutoutRequest } from "api";

const payPalBtnStyle = {
  label: "pay",
  tagline: false,
  fundingicons: true,
  size: "responsive",
  color: "white",
};

function MKProgressAccordion({
  title,
  slots,
  person,
  amount,
  remarks,
  getUserDetails,
  personUsername,
}) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modaltype, setModaltype] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentID, setPaymentID] = useState(0);
  const [selectedDay, setSelectedDay] = useState("");
  const theme = useTheme();
  const jtoken = getCookie("fanbies-token");
  // Future date only
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const handleRequestInfo = (type) => {
    setOpenModal(!openModal);
    setModaltype(type);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handlePrivateRequest = (event) => setIsPrivate(event.target.checked);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      email: "",
      message: "",
    },
    validate: (values) => {
      const errors = {};
      if (!regex.email.test(values.email)) {
        errors.email = "Enter a valid Email";
      }
      if (values.title === "") {
        errors.title = "Enter a title / name for request";
      }
      if (values.message === "") {
        errors.message = "Enter a message for request";
      }
      return errors;
    },
    onSubmit: () => {
      if (activeStep === 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        // after clearing the form
        setIsPaid(false);
      }
    },
  });

  const handleNext = () => {
    if (activeStep === 0) {
      validation.handleSubmit();
    }
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  return (
    <>
      <Accordion
        sx={{ backgroundColor: "transparent" }}
        expanded={open}
        onChange={handleToggle}
        className="mk_accordion"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="white" />}
          aria-controls="panel1a-content"
          className="mk_accordion_header"
        >
          <MKTypography variant="button" fontWeight="bold" color="white">
            {title}
          </MKTypography>
        </AccordionSummary>
        <AccordionDetails className="mk_accordion_content">
          {activeStep === 0 && (
            <MKBox>
              <MKTypography sx={{ fontSize: "1em" }} mb={1}>
                Get a personalised video for <b>${amount}</b> per request, available slot(s)&nbsp;
                <b>{slots}</b>
              </MKTypography>
              {remarks && (
                <MKTypography sx={{ fontSize: ".65em", fontWeight: 500 }}>
                  Proceed in support of {remarks}
                </MKTypography>
              )}
              <MKTypography variant="caption" onClick={() => handleRequestInfo("how")}>
                How does it work? <InfoOutlined color="dark" />{" "}
              </MKTypography>
              <MKBox component="form" role="form" sx={{ mb: 2, mt: 1 }}>
                <MKBox mb={2}>
                  <MKInput
                    type="email"
                    name="email"
                    label="Email"
                    value={validation.values.email}
                    onChange={validation.handleChange}
                    error={!!(validation.touched.email && validation.errors.email)}
                    fullWidth
                  />
                </MKBox>
                <MKBox mb={2}>
                  <MKInput
                    type="text"
                    name="title"
                    label="Title / Name Booking is for?"
                    value={validation.values.title}
                    onChange={validation.handleChange}
                    fullWidth
                    error={!!(validation.touched.title && validation.errors.title)}
                  />
                </MKBox>
                <MKBox display="flex" justifyContent="flex-start" className="datapickers">
                  <MKDatePicker
                    input={{ placeholder: "Choose a date" }}
                    options={{ minDate: threeDaysFromNow }}
                    onChange={([date]) => setSelectedDay(date)}
                  />
                  <MKTypography sx={{ fontSize: ".7em", top: 10, position: "relative", left: 10 }}>
                    Date you need request by?
                  </MKTypography>
                </MKBox>
                <MKBox mb={2} mt={2}>
                  <MKInput
                    type="text"
                    multiline
                    rows={3}
                    maxLength={10}
                    name="message"
                    label={`Your Request Message e.g ${person} wish me happy birthday `}
                    value={validation.values.message}
                    onChange={validation.handleChange}
                    fullWidth
                    error={!!(validation.touched.message && validation.errors.message)}
                  />
                  {validation.touched.phone && validation.errors.phone ? (
                    <MKTypography variant="caption" color="error">
                      {validation.errors.phone}
                    </MKTypography>
                  ) : null}
                </MKBox>
                <MKBox mb={2} display="flex" justifyContent="flex-start">
                  <FormControlLabel
                    label="Should Your Request Be Private?"
                    className="checkbox_formcontrol"
                    control={
                      <Checkbox
                        checked={isPrivate}
                        onChange={handlePrivateRequest}
                        inputProps={{
                          "aria-label": "controlled",
                          name: "privacy",
                        }}
                      />
                    }
                  />
                </MKBox>
                <MKBox mb={2}>
                  <MKTypography color="dark" sx={{ fontSize: ".5em" }}>
                    Due to high volume of request sometimes, please do allow 7-14 days to get
                    request completed, After 14 days period of no show a full refund will be offered
                    back.
                  </MKTypography>
                </MKBox>
              </MKBox>
            </MKBox>
          )}
          {activeStep === 1 && (
            <MKBox>
              <MKTypography variant="h6" mb={1}>
                Personalised video for ${amount} per request, available slot(s) {slots}
              </MKTypography>
              {remarks && (
                <MKTypography mb={2} sx={{ fontSize: ".65em", fontWeight: 500 }}>
                  Proceed in support of {remarks}
                </MKTypography>
              )}
              <MKTypography variant="h5" mb={3}>
                Please complete payment using the Paypal button below; button may take few seconds
                to load.
              </MKTypography>
            </MKBox>
          )}
          <MobileStepper
            variant="dots"
            steps={2}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 1, mb: 1, backgroundColor: "transparent !important" }}
            nextButton={
              <>
                {activeStep === 0 && (
                  <MKButton size="medium" variant="outlined" color="dark" onClick={handleNext}>
                    Proceed
                  </MKButton>
                )}
              </>
            }
            backButton={
              <MKButton
                variant="outlined"
                size="small"
                color="dark"
                onClick={handleBack}
                className="fanbies_btn"
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              </MKButton>
            }
          />
          {activeStep === 1 && (
            <PayPalButton
              amount={amount}
              options={{
                clientId: `${process.env.REACT_APP_API_PAYPAL}`,
              }}
              currency="USD"
              style={payPalBtnStyle}
              onError={() => {
                handleRequestInfo("error");
                setIsPaid(false);
              }}
              onSuccess={async (details, data) => {
                const fullMessage =
                  selectedDay !== undefined
                    ? `${validation.values.message} , PS:- shoutout booking is needed by date: ${selectedDay}`
                    : validation.values.message;

                const paymentObj = {
                  paymenttype: data?.paymentSource,
                  payToken: details?.create_time,
                  payerID: details?.payer?.payer_id,
                  paymentID: details?.id,
                  payerEmail: details?.payer?.email_address,
                  payerPaid: details?.status,
                  amountPaid: amount,
                  useremail: validation.values.email,
                  videoPrivacy: isPrivate ? 1 : 0,
                  celebName: person,
                  celebUname: personUsername,
                  messagetitle: validation.values.title,
                  messageDescription: fullMessage,
                  calldate: 0,
                  callduration: 0,
                  bookingType: "shoutout",
                };

                const res = await bookingShoutoutRequest(jtoken, paymentObj);
                if (res.success) {
                  setPaymentID(res?.response);
                  setIsPaid(true);
                  handleRequestInfo("paid");
                }
              }}
            />
          )}
          <MKButton
            variant="outlined"
            color="dark"
            size="medium"
            iconOnly
            sx={{ borderRadius: 5 }}
            onClick={handleToggle}
          >
            <CloseOutlined color="dark" />
          </MKButton>
        </AccordionDetails>
      </Accordion>
      <MKModal
        title="About Your Video Request Booking"
        isOpen={openModal}
        cancel={() => {
          setOpenModal(!openModal);
          if (modaltype === "paid") getUserDetails();
        }}
        hideConfirm
      >
        <MKBox>
          {modaltype === "how" && (
            <>
              <MKTypography variant="body2">
                You get to request any video recording. I will try completing your request within
                <b>7-14 days period</b> after getting payment.
              </MKTypography>
              <MKTypography variant="body2">
                Receipt for order booking and completion will be sent via email and or whatsapp
                (optional) messaging if number is provided
              </MKTypography>
              <MKTypography variant="body2">
                If for any reason your booking isn&apos;t completed, a full refund will be paid
                back.
              </MKTypography>
            </>
          )}
          {modaltype === "paid" && isPaid && (
            <>
              <MKTypography variant="h4" mb={3}>
                <CelebrationOutlinedIcon color="dark" /> Payment &amp; Booking Received
              </MKTypography>
              <MKTypography variant="h5" mb={3}>
                Your tansaction order id :&nbsp;
                {paymentID}
              </MKTypography>
              <MKTypography variant="body2" mb={2}>
                Please do check your email for the details, allow <b>7-14 days period</b> for your
                video message
              </MKTypography>
              <MKTypography variant="body2" mb={2}>
                If any issues with your booking, please email us <b>contact@fanbies.com</b>
              </MKTypography>
            </>
          )}
          {modaltype === "error" && !isPaid && (
            <>
              <MKTypography variant="h4" mb={3}>
                <ErrorOutlineOutlinedIcon color="error" /> Error with payment, please try again
                later.
              </MKTypography>
              <MKTypography variant="body2" mb={2}>
                If issues continues, please email us <b>contact@fanbies.com</b>
              </MKTypography>
            </>
          )}
        </MKBox>
      </MKModal>
    </>
  );
}

MKProgressAccordion.propTypes = {
  person: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slots: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  remarks: PropTypes.string.isRequired,
  getUserDetails: PropTypes.func.isRequired,
  personUsername: PropTypes.string.isRequired,
};

export default MKProgressAccordion;
