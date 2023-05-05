function compareString(str, cmp) {
    return str.localeCompare(cmp) == 0 ? true : false;
}

function getParamFromString(str) {
    const words = str.split('=');
    return words[1];
}

function parseFDS() {
    const fdsData = document.getElementById("fds-input").value;
    const fdsLines = fdsData.split(/\r?\n/)
    for(let i = 0; i < fdsLines.length; i++) {
        if(compareString(fdsLines[i], "[FDS]")) {
            // console.log(getParamFromString(fdsLines[i + 1]));
            // console.log(getParamFromString(fdsLines[i + 2]));
            // console.log(getParamFromString(fdsLines[i + 3]));
            i += 3;
        } else if (compareString(fdsLines[i], "[Einsatzdaten]")) {
            const nr = getParamFromString(fdsLines[i + 8]);
            const kind = getParamFromString(fdsLines[i + 11]) + " - " + getParamFromString(fdsLines[i + 12]);
            
            i += 12;               
            
            document.getElementById("report-nr").innerText = nr;
            document.getElementById("report-kind").innerText = kind.substring(1);

        } else if (compareString(fdsLines[i], "[Einsatzort]")) {
            const address =  getParamFromString(fdsLines[i + 1]) + " " + getParamFromString(fdsLines[i + 2]) + "\n"
                + getParamFromString(fdsLines[i + 3]) + " - " + getParamFromString(fdsLines[i + 4]);
            i += 4;

            document.getElementById("report-address").innerText = address;

        } else if (compareString(fdsLines[i], "[Alarmierung]")) {
            const date = getParamFromString(fdsLines[i + 1]);
            const time = getParamFromString(fdsLines[i + 2]);
            i += 2;
            
            document.getElementById("report-date").innerText = date;
            document.getElementById("report-time").innerText = time;

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
            document.getElementById("report-units").innerText = units;

            stations = stations.filter((value, index, array) =>
                array.indexOf(value) === index);
            
            stationsStr = "";
            for(let s = 0; s < stations.length; s++) {
                stationsStr += stations[s] + "\n";
            }
            document.getElementById("report-stations").innerText = stationsStr;

        } 
    }
}