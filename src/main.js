var imprints = ["Imprint", "Impressum", "Cookie Policy"]
const imprintXpath = `//a[${imprints.map(i => "contains(string(), \""+i+"\")").join(" or ")}]`;
;(async () => {
    const impressumLink = global.waitForElm(imprintXpath);
    impressumLink.then(async impressumLink => {
        console.log(impressumLink.href)
        browser.storage.sync.set({impressumLink: impressumLink.href})
    }).catch(console.log)
})()