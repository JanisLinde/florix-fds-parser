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

function compareString(str, cmp) {
    return str.localeCompare(cmp) == 0 ? true : false;
}

function getParamFromString(str) {
    const words = str.split('=');
    return words[1];
}

function exportFDS(fds) {
    
    var alarmDatum;
    var alarmZeit;
    
    var einsatzNr;
    var einsatzArt;
    var einsatzAdresse;

    var fahrzeuge;
    var feuerwehren;

    const fdsLines = fds.split(/\r?\n/);
    for(let i = 0; i < fdsLines.length; i++) {
        if(compareString(fdsLines[i], "[FDS]")) {
            // console.log(getParamFromString(fdsLines[i + 1]));
            // console.log(getParamFromString(fdsLines[i + 2]));
            // console.log(getParamFromString(fdsLines[i + 3]));
            i += 3;
        } else if (compareString(fdsLines[i], "[Einsatzdaten]")) {
            const nr = getParamFromString(fdsLines[i + 8]);
            const kind = getParamFromString(fdsLines[i + 11]) + " - " 
                + getParamFromString(fdsLines[i + 12]);
            
            i += 12;    
            
            einsatzNr = nr;
            einsatzArt = kind;

        } else if (compareString(fdsLines[i], "[Einsatzort]")) {
            const address =  getParamFromString(fdsLines[i + 1]) + " " 
                + getParamFromString(fdsLines[i + 2]) + " "
                + getParamFromString(fdsLines[i + 3]) + " - " 
                + getParamFromString(fdsLines[i + 4]);
            i += 4;

            einsatzAdresse = address;

        } else if (compareString(fdsLines[i], "[Alarmierung]")) {
            const date = getParamFromString(fdsLines[i + 1]);
            const time = getParamFromString(fdsLines[i + 2]);
            i += 2;
            
            alarmDatum = date;
            alarmZeit = time;

        } else if (compareString(fdsLines[i], "[Fahrzeuge]")) {
            let j = 0;
            var units = "";
            var stations = [];
            for(j = i; j < fdsLines.length; j++) {
                if(fdsLines[j].includes("FZG_TYP_")) {
                    let unit = getParamFromString(fdsLines[j + 1]);
                    
                    let unitStr = unit_dict[unit];
                    if(unitStr)
                        units += unit_dict[unit] + "\n";
                    let station = units_to_stations[unit];
                    if(station)
                        stations.push(units_to_stations[unit]);
                    j++;
                }
            }
            fahrzeuge = units;

            stations = stations.filter((value, index, array) =>
                array.indexOf(value) === index);
            
            stationsStr = "";
            for(let s = 0; s < stations.length; s++) {
                stationsStr += stations[s] + "\n";
            }
            feuerwehren = stationsStr;
        } 
    }

    var bericht = "Einsatznummer: " + einsatzNr + "\n";
    bericht += "Alarmierung: " + alarmDatum + " " + alarmZeit + "\n";
    bericht += "Stichwort: " + einsatzArt + "\n";
    bericht += "Adresse: " + einsatzAdresse + "\n";
    bericht += "\n";
    bericht += "Stadtteile:\n";
    bericht += feuerwehren;
    bericht += "\n";
    bericht += "Fahrzeuge:\n";
    bericht += fahrzeuge;

    download(einsatzNr + "-report.txt", bericht);
}

browser.runtime.onMessage.addListener((request) => {
    console.log("Export!");
    var fds = document.getElementsByName("fdsFileContents")[0];
    if(fds) {
        exportFDS(fds.value);
    } else {
        console.log("FDS-Daten konnten nicht gefunden werden")
    }
});