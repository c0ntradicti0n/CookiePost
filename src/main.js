const imprints = ["Imprint", "Impressum", "Cookie Policy"];
const imprintXpath = `//a[${imprints.map(i => "contains(string(), \""+i+"\")").join(" or ")}]`;
;(async () => {
    const imprintLink = global.waitForElm(imprintXpath);
    imprintLink.then(async imprintLink => {
        console.log(imprintLink.href)
        browser.storage.sync.set({imprintLink: imprintLink.href})
    }).catch(console.log)
})()