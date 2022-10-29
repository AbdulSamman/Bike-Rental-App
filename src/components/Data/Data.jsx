import { useState, useEffect } from "react";
import "./Data.scss";
import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
const bikeRentalUrl = "http://api.citybik.es/v2/networks";

const Data = () => {
  const [bikeRental, setBikeRental] = useState([]);
  const [filteredBikeRental, setFilteredBikeRental] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [marker, setMarker] = useState(null);
  const [textMsg, setTextMsg] = useState(null);
  const [textMsgLocation, setTextMsgLocation] = useState(null);
  try {
    useEffect(() => {
      (async () => {
        // const _bikeRental =await axios.get(bikeRentalUrl).data.networks
        const response = await (await fetch(bikeRentalUrl)).json();
        const _bikeRental = response.networks;
        console.log(_bikeRental);
        //console.log(_bikeRental);
        if (!_bikeRental) throw new Error("Data not found");

        setBikeRental(_bikeRental);
        setFilteredBikeRental(_bikeRental);
      })();
    }, []);
  } catch (error) {
    console.log(error);
  }
  const handelSearch = (e) => {
    const _searchText = e.target.value;
    const _filteredBikeRental = bikeRental.filter(
      (bikes) =>
        bikes.name.toLowerCase().includes(_searchText.toLowerCase()) ||
        bikes.location.city.toLowerCase().includes(_searchText.toLowerCase()) ||
        bikes.location.country.toLowerCase().includes(_searchText.toLowerCase())
    );
    setFilteredBikeRental([..._filteredBikeRental]);
    setSearchText(_searchText);
  };

  const markerClicked = (e) => {
    let _marker = e.payload[0];
    let _textMsg = e.anchor;
    let _textMsgLocation = e.payload[1];

    console.log(_textMsgLocation);

    if (_marker == null) {
      _marker = e.payload[0];
    } else {
      _marker = e.payload[0].join("");
    }

    setMarker(_marker);
    setTextMsg(_textMsg);
    setTextMsgLocation(_textMsgLocation);
  };

  return (
    <div>
      <p style={{ margin: "10px 0" }}>
        There are: {filteredBikeRental.length}{" "}
        <b style={{ color: "gold" }}>Bikes</b> rental.
      </p>

      <h2>PIGEON MAPS</h2>
      <input
        value={searchText}
        onChange={(e) => handelSearch(e)}
        placeholder="Search ..."
        id="search"
      />
      <Map height={300} defaultCenter={[50.879, 4.6997]} defaultZoom={3}>
        <ZoomControl />
        {filteredBikeRental.map((bike, i) => {
          return (
            <Marker
              key={i}
              anchor={[bike.location.latitude, bike.location.longitude]}
              payload={[bike.company, bike.location.city]}
              onClick={markerClicked}
            />
          );
        })}
        {marker && (
          <Overlay className="map-overlay" anchor={[textMsg[0], textMsg[1]]}>
            <p id="marker">{marker}</p>
            <span id="marker">{textMsgLocation}</span>
          </Overlay>
        )}
      </Map>

      <h2>ALL BIKES</h2>
      <div className="bikeRentalContainer">
        {filteredBikeRental.map((bike, i) => {
          return (
            <a id="content" key={i} href={"http://api.citybik.es" + bike.href}>
              <span id="bikeName">{bike.name} </span>
              <span id="bikeCity">
                <i className="fa-solid fa-location-dot"></i>
                <em>
                  {bike.location.city}
                  {", "}
                  <span id="bikeCountry"> {bike.location.country}</span>
                </em>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Data;
