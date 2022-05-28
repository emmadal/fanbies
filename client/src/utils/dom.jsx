export const injectScript = (url, target, dataAttributes) => {
  new Promise((resolve, reject) => {
    const script = window.document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onreadystatechange = resolve;
    script.onload = resolve;
    script.onerror = reject;
    if (dataAttributes) {
      Object.keys(dataAttributes).forEach(key => {
        const value = dataAttributes[key];
        script.dataset[key] = value;
      });
    }
    (target || window.document.body).appendChild(script);
  });
};

export default injectScript;
