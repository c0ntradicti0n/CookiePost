const global = {
    waitForElm: (selector) => {
        var f = () => document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return new Promise(resolve => {
            if (f()) {
                return resolve(f());
            }

            const observer = new MutationObserver(mutations => {
                if (f()) {
                    resolve(f());
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
}
