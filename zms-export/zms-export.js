document.body.style.border = "3px solid green";

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function exportFDS(fds) {
    console.log(fds);
    download("test.txt", fds);
}

browser.runtime.onMessage.addListener((request) => {
    console.log("Export!");
    var fds = document.getElementsByName("fdsFileContents")[0];
    exportFDS(fds.value);
});