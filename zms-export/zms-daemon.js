function sendMessageToTabs(tabs) {
    for(const tab of tabs) {
        console.log(tab);
        browser.tabs
            .sendMessage(tab.id, {})
            .catch(onError)
    }
}


function onError(error) {
    console.error(`Error: ${error}`);
}

browser.contextMenus.create(
    {
        id: "zms-export",
        title: "FDS Export",
        contexts: ["all"],
    }
);

browser.contextMenus.onClicked.addListener((info, tab) => {
    if(info.menuItemId === "zms-export") {
        console.log("Deamon");
        browser.tabs.query({
            currentWindow: true,
            active: true,
        })
        .then(sendMessageToTabs)
        .catch(onError);
    }
});