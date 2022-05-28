import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import Footer from "components/Footer/Footer.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import Header from "components/Header/Header.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import "../../App.css";

const ArticleWhyOffer1vs1Call = props => {
  const { classes, ...rest } = props;
  const [cardAnimaton, SetCardAnimaton] = useState("cardHidden");

  useEffect(() => {
    setTimeout(
      function() {
        SetCardAnimaton("");
      }.bind(this),
      700
    );
  }, []);

  const illustratorSvg = "undraw-bg undraw-bg-profile";
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Book &amp; Request direct video message from your favourite - Fanbies
        </title>
        <meta
          name="description"
          content={`Why Influencers Should Offer 1:1 Calls with Their Fans`}
        />
        <meta
          property="og:title"
          content="Why Influencers Should Offer 1:1 Calls with Their Fans"
        />
        <meta
          property="og:description"
          content="The influencer influx. These days, anyone with a hint of talent, charisma or even shock value can become an influencer."
        />
        <meta
          property="og:image"
          content={require("assets/img/articles/video-call.jpg")}
        />
        <meta
          property="og:url"
          content="https://www.fanbies.com/article/WhyOffer1vs1Call"
        />
        <meta
          name="twitter:card"
          content="Why Influencers Should Offer 1:1 Calls with Their Fans"
        />
      </Helmet>
      <Header
        color="transparent"
        brand="Fanbies"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      <div
        className={classNames(classes.main, classes.mainRaised, illustratorSvg)}
      >
        <div className={`${classes.container}`}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card className={classes[cardAnimaton]}>
                <CardHeader>
                  <h2 className="font-size-xxl font-bold text-center m-t-xl">
                    Why Influencers Should Offer 1:1 Calls with Their Fans
                  </h2>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <img src={require("assets/img/articles/video-call.jpg")} width="100%" alt="Influener on video call with fan on fanbies" />
                        <br />
                        <br />
                      <p className="font-size-lg dark-color">
                        The influencer influx. These days, anyone with a hint of talent, charisma or even shock value can become an influencer. Thanks to the growth of platforms such as TikTok, you can now – in the words of mid-2000s YouTube – ‘Broadcast Yourself.’ This ability to ‘broadcast yourself’ is now commonplace in popular culture, with names such as Charli D’Amelio becoming a household name thanks to this new-found ability. People are drawn to the idea of making videos and becoming influencers for many reasons, one out of the many reasons is to make money off their craft.
                      </p>
                      <p className="font-size-lg dark-color">
                          Influencers put in so much into their craft with the aim of entertaining and educating their fan base, in return of a growing tailored database that can possibly attract potential advertisers who deem them fit to promote their brands, services and products using their various social media pages. In doing so, there is an exchange of tailored driven data from the influencers to the brand and an exchange in Monterey value as payment for such promotional campaign. However, there is an underlying problem. This process of influencer monetisation is only a single income stream in a big network of potential ways to make money as an influencer.
                      </p>
                      <p className="font-size-lg">
                         However, new influencers can have trouble getting brands to advertise on their page. Another strategy for them would be to use a donation page such as CashApp or Patreon. They rely on people making donations or buying extra services from an influencer respectively, with Patreon being the most popular option, especially among YouTubers. CashApp is the more popular option among Instagrammers, who regularly put these on their stories. 
                      </p>
                      <p className="font-size-lg dark-color">
                          These options can be effective but also garner criticism, with CashApp in particular being seen as a way of ‘begging’ to fans, due to the fact most people believe influencers have a higher net worth than most of their fans. This is true with certain influencers, but those who are starting out may not have very much to begin with and they need a platform to grow.
                      </p>
                      <p className="font-size-lg dark-color">
                          Some influencers have gone even further with their money-making avenues, creating businesses promoted by their influencer pages. An example of this would be Kim Kardashian’s ‘Skims’ shapewear. Kim, an Instagram influencer and ‘Keeping Up with The Kardashians’ star created Skims (which was originally Kimono) in 2019 and since then it has grown thanks to clever advertising campaigns and Kim’s existing ubiquity. However, what does she have that most influencers may not have yet?
                      </p>
                      <p className="font-size-lg dark-color">
                          That is correct. Most influencers do not have plentiful funds to spend on advertising, branding, shipping, and many other costs that are incurred when running a business. So, we will not be running our own shapewear business yet. All is not lost, however. It is more than possible to make money as an influencer, regardless of how many followers or subscribers you have on your platforms. It is simple really, just start at the basics. Be a good influencer.
                      </p>
                      <p className="font-size-lg dark-color">
                          Creating high quality content is an excellent place to start. High quality content includes vivid photos, good captions, regular content, and engagement with fans. The first three are
                        easy enough to fulfil, by investing in a good camera, getting a friend or a freelancer who has decent writing skills and a (not overly offensive or dark) sense of humour and scheduling when content should be made and subsequently put out to fans. All three of these can contribute heavily to fan engagement, but how do you cement that fan engagement? Interaction.
                      </p>
                      <p className="font-size-lg dark-color">
                          It is a natural human need to want this interaction. Whether it be with an inanimate object or a person, it is a craving to have interaction. Imagine if you could provide that interaction, your engagement would skyrocket! What if we told you there was a platform that existed that helped to provide safe, effective, and easy interaction with your fans? Meet Fanbies.
                      </p>
                      <p className="font-size-lg dark-color">
                          Fanbies is a new platform where fans can request a personalised video shoutout from their favourite influencer or celebrity. These videos are completely customisable, from outfit inspiration video, birthday and wedding shouts to celebrity friend roasting and fun question and answer sessions, influencers on Fanbies can complete reasonable and light-hearted requests for fans.
                      </p>
                      <p className="font-size-lg dark-color">
                          Usable on both desktop and mobile, Fanbies is a collective of all the best influencers from bloggers to fashion icons and even comedians. They are all here on this app and site, ready to take fan requests and have fun doing so. It is easy to join us too, by going on to our website you can join our group of influencers engaging with fans or be recommended to join Fanbies by a fan or friend. We also have a help system, meaning any problems our influencers may have using the app can be resolved quickly and effectively using our knowledgeable team of employees, working alongside influencers on the Fanbies project.
                      </p>
                      <p className="font-size-lg dark-color">
                          We are also readily available on a multitude of platforms including Facebook, Twitter, and Instagram, so do not think you will be signing up for a dead site. Fanbies is a start up company which expects significant growth, due to the growing need for influencers to interact with their fans in order to assist with engagement and retention.
                      </p>
                      <p className="font-size-lg dark-color">
                          Engaging and retaining fans is good, but of course you also get paid for this service. You will get cash for every fan who asks for a video. Yes! You get paid for this. And with a small amount going towards the running of Fanbies, you can be rest assured you will get your money’s worth as you give your fans video messaging shoutouts and video calls. We understand that with many fans, video messaging each one a shoutout can be time consuming, so we hope to ensure that you get your value for money.
                      </p>
                      <p className="font-size-lg dark-color">
                          And as you are earning, you can expect substantial growth through your significant fan engagement. Very few influencers and celebrities engage in their fans on this level, with most only replying to their fan’s tweets and comments. This kind of one-on-one engagement is the future, and we seriously hope you can join us to ensure future success for yourself as an influencer and for us as a start-up company.
                      </p>
                      <p className="font-size-lg dark-color">
                          So, there you have it, Fanbies is the best new way to help grow yourself as an influencer and help grow your bank account while you are at it. While our other tips remain very valid, investing in a good camera; making witty captions and so forth are all excellent tips for helping bring fans in, engaging with fans helps retain them and ensure they will remain your fans for many years. Having many of them will also help everything else fall into place, such as having brands advertise their products on your page and allowing fans to donate or buy other services on pages such as Patreon. So, what are you waiting for? <b>Join Fanbies today!</b>
                      </p>
                      <img src={require("assets/img/articles/fanbies-sample.png")} width="100%" alt="Fanbies iphone sample img" />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default withStyles(loginPageStyle)(ArticleWhyOffer1vs1Call);
