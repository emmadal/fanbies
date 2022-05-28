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

import "../../App.css";

class TermsandCondition extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
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
          brand="Fanbies Terms and Condition"
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
                    <h2 className="font-bold text-center">Terms and Conditions</h2>
                    <h4 className="font-bold">Your Acceptance</h4>
                    <p>
                      By using or visiting the <b>Fanbies</b> website or any Fanbies products, software, data feeds, and services provided to you on, from, or through the Fanbies website (collectively the Service) you signify agreement to (1) these terms and conditions (the Terms of Service), s and also incorporated herein by reference. If you do not agree to any of these terms, the Fanbies Privacy Policy, or the Community Guidelines, please do not use the Service. Although we may attempt to notify you when major changes are made to these Terms of Service, you should periodically review the most up-to-date version. Fanbies may, in its sole discretion, modify or revise these Terms of Service and policies at any time, and you agree to be bound by such modifications or revisions. Nothing in or revisions. Nothing in these Terms of Service shall be deemed to confer any third-party rights or benefits. All videos recorded or submitted to Fanbies are thereon owned by Fanbies. The fee paid by a fan is a license to view, share, and download that video, the full possession belongs to Fanbies. Fans or any other users can not sell or profit from any videos without an agreement and permission from the Fanbies.
                    </p>
                    <h4 className="font-bold">Famous Faces Coming on Fanbies</h4>
                    <p>
                      Users classified as celebrities or as famous persons can freely use the Fanbies platform as; and when they want. Charges to fans are set with an agreement with the Fanbies team. We have created the platform for famous influencers/celebrities to use as a way to generate extra revenue for their charity, personal lifestyle, and or creative work. Celebrities can be paid by Paypal after seven days of completed recording for each video or via wire transfer. The money can be sent to either themselves, their charities, their agents, or managers.
                    </p>
                    <h4 className="font-bold">Fans video order</h4>
                    <p>
                      <b>Fanbies</b> gives 14 days for a video request to be completed after which we will cancel the order with written notification to the celebrity and the fan. We give a maximum length for a video to be 1 min, and we can not guarantee the minimum length for a video due to some factors that may occur such request not been descriptive enough. Videos are mostly recorded from our Fanbies App or WebCam. Information provided is what will be used to create the video request. A Video requested at a pending state can be still be edited in the area of its long and short description mentions. Video request can be canceled for a full refund while the request is in its pending state. It could happen that a celebrity does not include all the information asked for in a video request. They are allowed to pick and choose what they can say if request is promoting brands / a product Celebrities can pick on words based on their personality and how they think they can make the most exciting video for you. You can enjoy and share your video but cannot profit from it without a written permission request with an agreement from Fanbies Team. When you pay to request a video, you are paying for a license to watch, share, and download the video.
                    </p>
                    <h4 className="font-bold">Terms of Service</h4>
                    <p>
                      You may only use the website for legitimate and proper purposes. This agreement must be read in conjunction with the Privacy Policy. You can view the Privacy Policy here. The site is owned and operated by SoulsApp Ltd the owners of Fanbies platform, and Soulsapp Ltd may revise this agreement from time to time.
                    </p>
                    <h4 className="font-bold">Use of the Platform Internationally</h4>
                    <p>
                      You agree to comply with all local rules and laws regarding user conduct on the Internet and acceptable content. You further agree to comply with all applicable laws regarding obscene and indecent content and communications and those regarding the transmission of technical and personal data exported from the country in which you reside.
                    </p>
                    <h4 className="font-bold">Provided Services</h4>
                    <p>
                      Fanbies reserves the right to add, modify, or discontinue any of the services offered on the website at any time without notice. Fanbies will not be held liable for any decision to add, modify or discontinue a service.
                    </p>
                    <h4 className="font-bold">Sign-up and verification</h4>
                    <p>
                      You can sign-up as a celebrity on Fanbies by completing the sign-up form. You must provide a valid email address and a password. You agree not to give this password to any third parties. Registration of the website is free. You record your example video so that we can confirm that you are you. We will contact you if it is not clear and may ask for more evidence.
                    </p>
                    <h4 className="font-bold">Intellectual Property</h4>
                    <p>
                      Reproduction of part or all of the contents in any form of the website is prohibited other than for individual use only, and the contents of this website may not be copied or otherwise shared with any third parties. Without limitation, you agree that you will not print, distribute, display, sell, publish, broadcast, circulate, disseminate or commercially exploit, in any form or by any method whatsoever, part or all of the contents of the website, or incorporate the website material, or any part of it, in any work or publication, whether in hard copy, electronic, or any other form. Unless otherwise noted, all materials on this site are protected as the copyright, trade dress, trademarks and/or other intellectual properties owned by Fanbies or by other parties that have licensed their material to Fanbies. Fanbies trademarks on this site represent some of the trademarks currently owned or controlled in the United Kingdom. The display of these marks and notices associated with these marks is not intended to be a comprehensive compilation of all worldwide proprietary ownership rights held by Fanbies. All rights not expressly granted are reserved. This website may contain materials produced by third parties or links to other websites. Such materials and websites are provided by third parties and are not under Fanbies direct control, and Fanbies accepts no responsibility or liability in respect of any such third-party materials or for the operation or content of other websites (whether or not linked to this website). You acknowledge that Fanbies is entitled to require you to remove any link from another website to this website which you install without obtaining Fanbies prior written consent.
                    </p>
                    <h4 className="font-bold">Limitation of Liability</h4>
                    <p>
                      In no event will Fanbies, or its suppliers or licensors, be liable with respect to any subject matter of this agreement under any contract, negligence, strict liability or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of procurement for substitute products or services; (iii) for interruption of use or loss or corruption of data; or (iv) for any amounts that exceed the fees paid by you to Fanbies under this agreement during the twelve (12) month period prior to the cause of action. Fanbies shall have no liability for any failure or delay due to matters beyond their reasonable control. The foregoing shall not apply to the extent prohibited by applicable law.
                    </p>
                    <h4 className="font-bold">Ownership</h4>
                    <p>
                      Fanbies as a platform owns or license all right, video, title, and interest in and to the Site, Mobile Apps and Services, including all software, text, media files, and other content available on the Site, Mobile Apps and Services
                    </p>
                    <h4 className="font-bold">Acceptable Use of the Site and Services</h4>
                    <p>
                      You are responsible for your use of the Site and Services, and for any use of the Site or Services made using your account.  Our goal is to create a positive, useful, and safe user experience.  To promote this goal, we prohibit certain kinds of conduct that may be harmful to other users or to us.  When you use the Site or Services, you may not:
                    </p>
                    <ul className="list-style-display">
                      <li>Post, share, or request anything that is illegal, abusive, harassing, harmful to reputation, pornographic, indecent, profane, obscene, hateful, racist, or otherwise objectionable;</li>
                      <li>Send unsolicited or unauthorized advertising or commercial communications, such as spam;</li>
                      <li>Stalk, harass, or harm another individual;</li>
                      <li>Violate, infringe, or misappropriate other people’s intellectual property, privacy, publicity, or other legal rights;</li>
                    </ul>
                    <h4 className="font-bold">Indemnification</h4>
                    <p>
                      You agree to indemnify and hold harmless <b>Fanbies</b>, its contractors, and its licensors, and their respective directors, officers, employees and agents from and against any and all claims and expenses, including attorney fees, arising out of your use of the Website, including but not limited to your violation of this Terms of Service.
                    </p>
                    <h4 className="font-bold">Governing law</h4>
                    <p>
                      These Terms of Service will be governed by and construed in accordance with English Law.
                    </p>
                    <h4 className="font-bold">Definitions</h4>
                    <p>
                      {"'Agreement' means the Terms of Service that apply to the use of the website which may be amended from time to time. 'Fanbies' means Fanbies Platform 'Website' means internet website with the URL Fanbies.com 'You' means the user of the Website (and 'Your' has the corresponding meaning). Thank you for reading the Terms of Service."}
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

export default withStyles(profilePageStyle)(TermsandCondition);
