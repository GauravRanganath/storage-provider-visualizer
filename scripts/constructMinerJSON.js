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
        let ipAddresses = [];
        let addresses = data.chainInfo.addresses;
        addresses.forEach((address) => {
          ipAddresses.push(address.split("/")[2]);
        });
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
        let minerInfoBuilder = []

      data.forEach((elem) => {
        let minerInfo = {}
        minerInfo[elem["addr"]] = elem
        minerInfoBuilder.push(minerInfo)
      });

      return minerInfoBuilder;
    }).then((minerInfoBuilder) => {
        let ipAddresses = [];

        console.log(minerInfoBuilder)

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
