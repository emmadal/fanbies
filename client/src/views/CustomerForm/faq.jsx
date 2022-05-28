/* eslint-disable prettier/prettier */
import React from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

class FAQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardAnimaton: "cardHidden"
    };
  }
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="transparent"
          brand="Fanbies Frequently Asked Question"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 200,
            color: "white"
          }}
          {...rest}
        />
        <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <React.Fragment>
                    <h2 className="font-bold text-center">
                      Frequently Asked Questions
                    </h2>
                    <h4 className="font-bold">Q: What is Fanbies?</h4>
                    <p>
                      Fanbies is a platform where fans request for personalised video shoutouts from their favourite person,professional or influencers for inspirations tips birthday shoutout gift, celebrity roast and many fun questions to directly ask. As long as the request is appropriate.
                    </p>
                    <h4 className="font-bold">Q: Can I keep my Fanbies?</h4>
                    <p>
                      Yes, you can download your Fanbies video, share it
                      across your social media pages and save it for life.
                    </p>
                    <h4 className="font-bold">
                      Q: Can I be notified when new talent joins Fanbies?
                    </h4>
                    <p>
                      Yes! you can also recommend a talent to join the family by
                      completing the form <a href="/recommend">here</a>
                    </p>
                    <h4 className="font-bold">
                      Q: How do I contact the Fanbies team?
                    </h4>
                    <p>
                      We’d love to chat! Feel free to contact us here
                      <b>contact@fanbies.com</b>, and one of our team members
                      get back to you as soon as possible.
                    </p>
                    <h4 className="font-bold">
                      Q: How can I request to join Fanbies as Talent?
                    </h4>
                    <p>
                      You can request to join Fanbies by contacting on{" "}
                      <b>join@fanbies.com</b>, and we will send all necessary
                      document required to be verified.
                    </p>
                    <h3 className="font-bold">Booking a Fanbies</h3>
                    <h4 className="font-bold">Q: How do I book a Fanbies?</h4>
                    <p>
                      Simply search our categories, pick your talent, fill out who it’s for, write your request and you’re good to go!
                    </p>
                    <h4 className="font-bold">
                      Q: Are there any rules for Fanbies requests?
                    </h4>
                    <p>
                     Your Fanbies request will only be rejected if it’s inappropriate, explicit or will damage the talent’s image. We recommend you keep it simple and quick to record.
                    </p>
                    <h3 className="font-bold">Booking a Fanbies</h3>
                    <h4 className="font-bold">
                      Q: How will I receive my Fanbies once it’s completed?
                    </h4>
                    <p>
                      You will be notified via email to login to your account to download, share and watch the video. Available both on website and App store (IOS and Android)
                    </p>
                    <h4 className="font-bold">
                      Q: How do I download my Fanbies?
                    </h4>
                    <p>
                      Just login to either the App or website, go to your
                      completed video, you should see the download button and
                      share options; the choice is yours.
                    </p>
                    <h4 className="font-bold">
                      Q: Can Fanbies Request be for charity?
                    </h4>
                    <p>
                      Absolutely - Celebrities and famous face can get to publicly display what charity they support and how proceeds from a booking can be used as a charity facilitation. We’ve found Fanbies request to be a great way to fundraise! A number of people on Fanbies have their funds sent to the charity of their choice after a booking is done and completed. 
                    </p>

                    <h4 className="font-bold">
                      Q: How time consuming is doing a Fanbies?
                    </h4>
                    <p>
                      On average, it takes about 30-60 seconds but its completely up to you!
                    </p>
                    <h4 className="font-bold">
                      Q: How is the price determined?
                    </h4>
                    <p>
                      A: Talent sets their own price and can change it at any
                      time!
                    </p>
                    <h4 className="font-bold">
                      Q: How can I make more money on Fanbies?
                    </h4>
                    <p>
                      We see an average of 700%+ increase in bookings when talent lets their fans know that they’re on Fanbies! An Instagram post, a swipe up on your Instagram story, Tweet, Facebook post, or mention/link on your YouTube or Musical.ly channel is a great way to significantly increase your bookings!
                    </p>
                    <h4 className="font-bold">
                      Q: What type of talent are you looking to have on Fanbies?
                    </h4>
                    <p>
                      We’re always looking for great talent that wants to better engage with their fan base in a more personalised way, while creating moments that inspire their fans &amp;followers!
                    </p>
                    <h4 className="font-bold">
                      Q: Will Fanbies promote talent joining the platform?
                    </h4>
                    <p>
                      Yes, we often promote our talent joining across our social media pages. However, we leave it up to talent to let their fans know that they’re active on Fanbies! The best way to do this is with a mention on your favourite social channels.
                    </p>
                    <h4 className="font-bold">
                      Q: Are there costs associated with joining Fanbies?
                    </h4>
                    <p>
                      No. We handle all payment and processing fees for you!
                    </p>

                    <h4 className="font-bold">
                      Q: Can you decline Fanbies requests?
                    </h4>
                    <p>
                      Yes. You can decline any request that you feel uncomfortable doing. You can also report requests in which case we may block an individual from requesting again.
                    </p>
                    <h4 className="font-bold">
                      Q: Will fans know my contact information if I do a Fanbies?
                    </h4>
                    <p>
                      No - we do not share such information with any parties on
                      the platform.
                    </p>
                    <h4 className="font-bold">
                      Q: How do I get paid?
                    </h4>
                    <p>
                      Money will be deposited in your account 7-day after a completed request. You can also raise an invoice from the Fanbies admin dashboard
                    </p>
                    <h4 className="font-bold">
                      Q: What if I feel bad about charging my fans?
                    </h4>
                    <p>
                      A large amount of Fanbies request are purchased as gifts for your biggest fans! You’re simply providing your fans with currently unobtainable moments that inspire, while monetising your DMs.
                    </p>
                    <h4 className="font-bold">
                      Q: How long will my Fanbies take to be completed?
                    </h4>
                    <p>
                     Our talent is given up to 7-14 days to fulfill their requests, however, they typically complete Fanbies within a few days. If your request isn’t completed in time, it will expire and you will be refunded and cancellation will be made for the request.
                    </p>
                    <h4 className="font-bold">
                      Q: Is the talent guaranteed to make my Fanbies?
                    </h4>
                    <p>
                      We make it our top priority that every customer receives their Fanbies. It is possible that your request could expire, but we do our best to make sure that all Fanbies videos are completed.
                    </p>
                    <h4 className="font-bold">
                      Q: Can I update my request after I already booked?
                    </h4>
                    <p>
                      Yes! you are able to edit or cancel your order request at any time as long as the order / video is still in its pending state.
                    </p>
                    <h4 className="font-bold">
                      Q: I see my Fanbies on the website, but haven’t received it.
                    </h4>
                    <p>
                      We send a completed request to your registered email when completed, a push notification to your Fanbies mobile app account. Also please be sure to check your spam email! If you still are unable to find it, please email us with your order number and email address you provided when booking to <b>contact@fanbies.com</b>
                    </p>
                    <h4 className="font-bold">
                      Q: How much is a Fanbies?
                    </h4>
                    <p>
                      The cost of a Fanbies is set by talent, and therefore the price will range depending on who you request! Talent can change their price at any time but you will only be charged the price you booked it for.
                    </p>
                    <h4 className="font-bold">
                      Q: Payment Method?
                    </h4>
                    <p>
                     Fanbies take payment via Paypal.
                    </p>
                  </React.Fragment>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(profilePageStyle)(FAQ);
