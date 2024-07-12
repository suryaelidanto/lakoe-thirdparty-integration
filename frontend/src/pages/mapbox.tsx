import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl, { LngLat, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LegacyRef, useEffect, useRef, useState } from "react";

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function MapWithGeocoder() {
  const mapContainerRef = useRef();
  const mapInstanceRef = useRef<Map>();
  const [currentMarker, setCurrentMarker] = useState<null | LngLat>(null);
  const [, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentUserLocation, setCurrentUserLocation] =
    useState<Pick<LngLat, "lng" | "lat">>();

  useEffect(() => {
    mapboxgl.accessToken = accessToken;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position: GeolocationPosition) {
      setCurrentUserLocation({
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      });
    }

    function error() {
      console.log("Unable to retrieve your location");
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as unknown as string | HTMLElement, // container ID
      center: [currentUserLocation?.lng ?? 0, currentUserLocation?.lat ?? 0], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([currentUserLocation?.lng ?? 0, currentUserLocation?.lat ?? 0])
      .addTo(map);

    mapInstanceRef.current = map;

    map.on("click", ({ lngLat }) => {
      setCurrentMarker(lngLat);
      marker.setLngLat(lngLat);
    });

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });

  }, [currentUserLocation?.lat, currentUserLocation?.lng]);

  return (
    <>
      <h1>
        {currentMarker
          ? `Longitude : ${currentMarker.lng} | Latitude:  ${currentMarker.lat}`
          : ""}
      </h1>
      {/* @ts-expect-error Search Box */}
      <SearchBox
        accessToken={accessToken}
        map={mapInstanceRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        marker
      />
      <div
        id="map-container"
        ref={
          mapContainerRef as unknown as LegacyRef<HTMLDivElement> | undefined
        }
        style={{ height: "100vh" }}
      />
    </>
  );
}
