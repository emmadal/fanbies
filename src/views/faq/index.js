import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";

// Material Kit 2 PRO React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 PRO React examples
import DefaultNavbar from "molecules/Navbars/DefaultNavbar";
import CenteredFooter from "molecules/Footers/CenteredFooter";

// HelpCenter page components
import FaqCollapse from "pages/Support/Faq/components/FaqCollapse";

// Routes
import { HeaderRoutes } from "routes";

function Faq() {
  const [collapse, setCollapse] = useState(false);

  return (
    <>
      <DefaultNavbar
        routes={HeaderRoutes}
        action={{ type: "internal", route: "/signup", label: "Sign Up Free", color: "primary" }}
        sticky
      />
      <MKBox component="section" pt={20} pb={6}>
        <Container>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Card>
                <MKBox
                  variant="gradient"
                  bgColor="primary"
                  borderRadius="lg"
                  coloredShadow="info"
                  p={3}
                  mt={-3}
                  mx={2}
                >
                  <MKTypography variant="h3" color="white">
                    FAQ
                  </MKTypography>
                </MKBox>
                <MKBox p={6}>
                  <FaqCollapse
                    title="What is Fanbies?"
                    open={collapse === 1}
                    onClick={() => (collapse === 1 ? setCollapse(false) : setCollapse(1))}
                  >
                    Fanbies is a platform where fans request for personalised video shoutouts from
                    their favourite person,professional or influencers for inspirations tips
                    birthday shoutout gift, celebrity roast and many fun questions to directly ask.
                    As long as the request is appropriate.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Can I keep my Fanbies?"
                    open={collapse === 2}
                    onClick={() => (collapse === 2 ? setCollapse(false) : setCollapse(2))}
                  >
                    Yes, you can download your Fanbies video, share it across your social media
                    pages and save it for life.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Can I be notified when new talent joins Fanbies?"
                    open={collapse === 3}
                    onClick={() => (collapse === 3 ? setCollapse(false) : setCollapse(3))}
                  >
                    Yes! you can also recommend a talent to join the family by completing the form
                    <MKTypography
                      component={Link}
                      href="/"
                      rel="noreferrer"
                      variant="body2"
                      color="primary"
                    >
                      here
                    </MKTypography>
                  </FaqCollapse>
                  <FaqCollapse
                    title="How do I contact the Fanbies team?"
                    open={collapse === 4}
                    onClick={() => (collapse === 4 ? setCollapse(false) : setCollapse(4))}
                  >
                    We’d love to chat! Feel free to contact us herecontact@fanbies.com, and one of
                    our team members get back to you as soon as possible.
                  </FaqCollapse>
                  <FaqCollapse
                    title="How can I request to join Fanbies as Talent?"
                    open={collapse === 5}
                    onClick={() => (collapse === 5 ? setCollapse(false) : setCollapse(5))}
                  >
                    You can request to join Fanbies by contacting on <b>join@fanbies.com</b>, and we
                    will send all necessary document required to be verified.
                  </FaqCollapse>
                  <MKTypography variant="h5" mt={6} mb={3}>
                    Booking a Fanbies Request
                  </MKTypography>
                  <FaqCollapse
                    title="How will I receive my Fanbies once its completed?"
                    open={collapse === 6}
                    onClick={() => (collapse === 6 ? setCollapse(false) : setCollapse(6))}
                  >
                    You will be notified via email to login to your account to download, share and
                    watch the video.
                  </FaqCollapse>
                  <FaqCollapse
                    title="How do I download my Fanbies?"
                    open={collapse === 7}
                    onClick={() => (collapse === 7 ? setCollapse(false) : setCollapse(7))}
                  >
                    Just login to either the App or website, go to your completed video, you should
                    see the download button and share options; the choice is yours.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Can Fanbies Request be for charity?"
                    open={collapse === 8}
                    onClick={() => (collapse === 8 ? setCollapse(false) : setCollapse(8))}
                  >
                    Absolutely - Celebrities and famous face can get to publicly display what
                    charity they support and how proceeds from a booking can be used as a charity
                    facilitation. We have found Fanbies request to be a great way to fundraise! A
                    number of people on Fanbies have their funds sent to the charity of their choice
                    after a booking is done and completed.
                  </FaqCollapse>
                  <FaqCollapse
                    title="How time consuming is doing a Fanbies?"
                    open={collapse === 9}
                    onClick={() => (collapse === 9 ? setCollapse(false) : setCollapse(9))}
                  >
                    On average, it takes about 30-60 seconds but its completely up to you!
                  </FaqCollapse>
                  <FaqCollapse
                    title="How is the price determined?"
                    open={collapse === 10}
                    onClick={() => (collapse === 10 ? setCollapse(false) : setCollapse(10))}
                  >
                    Talent sets their own price and can change it at any time!
                  </FaqCollapse>
                  <FaqCollapse
                    title="How can I make more money on Fanbies?"
                    open={collapse === 11}
                    onClick={() => (collapse === 11 ? setCollapse(false) : setCollapse(11))}
                  >
                    We see an average of 700%+ increase in bookings when talent lets their fans know
                    that they are on Fanbies! An Instagram post, a swipe up on your Instagram story,
                    Tweet, Facebook post, or mention/link on your YouTube or Musical.ly channel is a
                    great way to significantly increase your bookings!
                  </FaqCollapse>
                  <FaqCollapse
                    title="What type of talent are you looking to have on Fanbies?"
                    open={collapse === 12}
                    onClick={() => (collapse === 12 ? setCollapse(false) : setCollapse(12))}
                  >
                    We are always looking for great talent that wants to better engage with their
                    fan base in a more personalised way, while creating moments that inspire their
                    fans &amp;followers!
                  </FaqCollapse>
                  <FaqCollapse
                    title="Will Fanbies promote talent joining the platform?"
                    open={collapse === 13}
                    onClick={() => (collapse === 13 ? setCollapse(false) : setCollapse(13))}
                  >
                    Yes, we often promote our talent joining across our social media pages. However,
                    we leave it up to talent to let their fans know that they are active on Fanbies!
                    The best way to do this is with a mention on your favourite social channels.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Are there costs associated with joining Fanbies?"
                    open={collapse === 14}
                    onClick={() => (collapse === 14 ? setCollapse(false) : setCollapse(14))}
                  >
                    No. We handle all payment and processing fees for you!
                  </FaqCollapse>
                  <FaqCollapse
                    title="Can you decline Fanbies requests?"
                    open={collapse === 15}
                    onClick={() => (collapse === 15 ? setCollapse(false) : setCollapse(15))}
                  >
                    Yes. You can decline any request that you feel uncomfortable doing. You can also
                    report requests in which case we may block an individual from requesting again.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Will fans know my contact information if I do a Fanbies?"
                    open={collapse === 16}
                    onClick={() => (collapse === 16 ? setCollapse(false) : setCollapse(16))}
                  >
                    No - we do not share such information with any parties on the platform.
                  </FaqCollapse>
                  <FaqCollapse
                    title="How do I get paid?"
                    open={collapse === 17}
                    onClick={() => (collapse === 17 ? setCollapse(false) : setCollapse(17))}
                  >
                    Money will be deposited in your account 7-day after a completed request. You can
                    also raise an invoice from the Fanbies admin dashboard
                  </FaqCollapse>
                  <FaqCollapse
                    title="What if I feel bad about charging my fans?"
                    open={collapse === 18}
                    onClick={() => (collapse === 18 ? setCollapse(false) : setCollapse(18))}
                  >
                    A large amount of Fanbies request are purchased as gifts for your biggest fans!
                    You are simply providing your fans with currently unobtainable moments that
                    inspire, while monetising your DMs.
                  </FaqCollapse>
                  <FaqCollapse
                    title="How long will my Fanbies take to be completed?"
                    open={collapse === 19}
                    onClick={() => (collapse === 19 ? setCollapse(false) : setCollapse(19))}
                  >
                    Our talent is given up to 7-14 days to fulfill their requests, however, they
                    typically complete Fanbies within a few days. If your request isn&apos;t
                    completed in time, it will expire and you will be refunded and cancellation will
                    be made for the request.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Is the talent guaranteed to make my Fanbies?"
                    open={collapse === 20}
                    onClick={() => (collapse === 20 ? setCollapse(false) : setCollapse(20))}
                  >
                    We make it our top priority that every customer receives their Fanbies. It is
                    possible that your request could expire, but we do our best to make sure that
                    all Fanbies videos are completed.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Can I update my request after I already booked?"
                    open={collapse === 21}
                    onClick={() => (collapse === 21 ? setCollapse(false) : setCollapse(21))}
                  >
                    Yes! you are able to edit or cancel your order request at any time as long as
                    the order / video is still in its pending state.
                  </FaqCollapse>
                  <FaqCollapse
                    title="I see my Fanbies on the website, but have not received it"
                    open={collapse === 22}
                    onClick={() => (collapse === 22 ? setCollapse(false) : setCollapse(22))}
                  >
                    We send a completed request to your registered email when completed, a push
                    notification to your Fanbies mobile app account. Also please be sure to check
                    your spam email! If you still are unable to find it, please email us with your
                    order number and email address you provided when booking to contact@fanbies.com
                  </FaqCollapse>
                  <FaqCollapse
                    title="How much is a Fanbies?"
                    open={collapse === 23}
                    onClick={() => (collapse === 23 ? setCollapse(false) : setCollapse(23))}
                  >
                    The cost of a Fanbies is set by talent, and therefore the price will range
                    depending on who you request! Talent can change their price at any time but you
                    will only be charged the price you booked it for.
                  </FaqCollapse>
                  <FaqCollapse
                    title="Payment Method?"
                    open={collapse === 24}
                    onClick={() => (collapse === 24 ? setCollapse(false) : setCollapse(24))}
                  >
                    Fanbies take payment via Paypal.
                  </FaqCollapse>
                </MKBox>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MKBox>
      <CenteredFooter />
    </>
  );
}

export default Faq;
