const { minWidth } = require("@mui/system");

function getLocations(ipAddress) {
  return new Promise((resolve, reject) => {
    fetch(`https://ipapi.co/${ipAddress}/json/`).then((res) =>
      res.json().then((data) => {
        resolve(data);
      })
    );
  });
}

function getIpAddresses(minerId) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.estuary.tech/public/miners/stats/${minerId}`)
      .then((res) => res.json())
      .then((data) => {
        let addresses = {}
        let ipAddresses = [];
        addresses[minerId] = data;

        let storeData = JSON.stringify(addresses) + ",\n";

        const fs = require("fs");

        fs.appendFileSync("Output.txt", storeData, (err) => {
          if (err) throw err;
        });

        console.log(addresses);
        ipAddresses.push(addresses);
        resolve(ipAddresses);
      });
  });
}

const getAllMiners = () => {
  fetch(`https://api.estuary.tech/public/miners`)
    .then(async (res) => {
      let data = await res.json();
      return data;
    })
    .then((data) => {
      let minerInfoBuilder = [];

      data.forEach((elem) => {
        let minerInfo = {};
        minerInfo[elem["addr"]] = elem;
        minerInfoBuilder.push(minerInfo);
      });

      return minerInfoBuilder;
    })
    .then((minerInfoBuilder) => {
      let ipAddresses = [];

      let x = 0
      let i = 0
      
      for (x = 0; x <= 210; x += 5) {
        for (i = x; i < x+5; i++) {
          getIpAddresses(Object.keys(minerInfoBuilder[i])[0]);
        }
      }

      /*
        minerInfoBuilder.forEach((minerId) => {
          ipAddresses.push(getIpAddresses(minerId));
        });
        Promise.all(ipAddresses)
          .then((allIpAddresses) => {
            setIsLoading(false);
            return allIpAddresses.flat();
          })
          .then((ipAddresses) => {
            let locationData = [];
            ipAddresses.forEach((ipAddress) => {
              locationData.push(getLocations(ipAddress));
            });
            Promise.all(locationData).then((allLocationData) => {
              let pointsBuilder = [];
              let arcBuilder = [];
              let ringBuilder = [];

              allLocationData.forEach((location) => {
                pointsBuilder.push({
                  lat: location.latitude,
                  lng: location.longitude,
                });

                arcBuilder.push({
                  startLat: location.latitude,
                  startLng: location.longitude,
                  endLat: myLocation.latitude,
                  endLng: myLocation.longitude,
                  color: "#39FF14",
                });

                ringBuilder.push({
                  lat: location.latitude,
                  lng: location.longitude,
                  color: "#39FF14",
                });
              });

              allLocationData.push(myLocation);

              setAllLocations(allLocationData);
              setPoints(pointsBuilder);
              setArcs(arcBuilder);
              setRings(ringBuilder);
            });
          });
          */
    });
};

getAllMiners();
