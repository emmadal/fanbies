import snowImage from "assets/images/fanbies/demo/snow.png";
import mineraleImage from "assets/images/fanbies/demo/mineral.png";
import natureImage from "assets/images/fanbies/demo/nature.png";
import sunsetImage from "assets/images/fanbies/demo/sunset.png";
import cheeseImage from "assets/images/fanbies/demo/cheese.png";
import skyImage from "assets/images/fanbies/demo/sky.png";
import darkImage from "assets/images/fanbies/demo/dark.png";
import lightImage from "assets/images/fanbies/demo/light.png";
import overlayImage from "assets/images/fanbies/demo/overlay.png";
import bluredImage from "assets/images/fanbies/demo/blured.png";

const appearance = [
  {
    mode: "LIGHT",
    backgroundColor: "#f0f2f5",
    btnBackground: "transparent",
    label: "Light Mode",
    textColor: "#000000",
    textHovered: "#000000",
    borderColor: "#000000",
    btnHovered: "#f0f2f5",
    demo: lightImage,
  },
  {
    mode: "DEFAULT",
    backgroundColor: "#000000",
    btnBackground: "#222222",
    label: "Dark Mode",
    textColor: "#ffffff",
    textHovered: "#ffffff",
    borderColor: "#222222",
    btnHovered: "#222222",
    demo: darkImage,
  },
  {
    mode: "SKY",
    backgroundColor: "#74b9ff",
    btnBackground: "transparent",
    label: "SKY Mode",
    textColor: "white",
    textHovered: "#74b9ff",
    borderColor: "#ffffff",
    btnHovered: "#ffffff",
    demo: skyImage,
  },
  {
    mode: "OVERLAY",
    label: "Image Overlay",
    btnBackground: "#000000",
    borderColor: "#000000",
    textColor: "#ffffff",
    backgroundColor: "#000000",
    textHovered: "#ffffff",
    btnHovered: "#000000",
    backgroundImage:
      "https://fanbiesapp.s3.eu-west-2.amazonaws.com/2019-03-13/1552479858884_209.png",
    demo: overlayImage,
  },
  {
    mode: "SUNSET",
    backgroundColor: "#ffeee2",
    btnBackground: "transparent",
    label: "SUNSET Mode",
    textColor: "#000000",
    textHovered: "#000000",
    borderColor: "#ccbeb5",
    btnHovered: "#ffeee2",
    demo: sunsetImage,
  },
  {
    mode: "NATURE",
    backgroundColor: "#e0faee",
    btnBackground: "transparent",
    label: "NATURE Mode",
    textColor: "#000000",
    textHovered: "#000000",
    borderColor: "#b3c8be",
    btnHovered: "#e0faee",
    demo: natureImage,
  },
  {
    mode: "SNOW",
    backgroundColor: "#ffffff",
    btnBackground: "#000000",
    label: "SNOW Mode",
    textColor: "white",
    textHovered: "white",
    borderColor: "#000000",
    btnHovered: "black",
    demo: snowImage,
  },
  {
    mode: "CHEESE",
    backgroundColor: "#ebeef1",
    btnBackground: "#ffffff",
    label: "CHEESE Mode",
    textColor: "#000000",
    textHovered: "#000000",
    borderColor: "#ffffff",
    btnHovered: "#ffffff",
    demo: cheeseImage,
  },
  {
    mode: "MINERAL",
    backgroundColor: "#fff8e0",
    btnBackground: "transparent",
    label: "MINERAL Mode",
    textColor: "#000000",
    textHovered: "#000000",
    borderColor: "#ccc6b3",
    btnHovered: "transparent",
    demo: mineraleImage,
  },
  {
    mode: "BLURED",
    backgroundColor: "#e9eaeb",
    btnBackground: "#ffffff",
    label: "BLURED Mode",
    textColor: "#000000",
    textHovered: "#000000",
    borderColor: "#ffffff",
    btnHovered: "#ffffff",
    demo: bluredImage,
    isBlur: true,
  },
];
export default appearance;
