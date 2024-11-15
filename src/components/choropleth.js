import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase";
import PHILIPPINES_GEOJSON from "../data/ph.json";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "../css/choropleth.css"; 

const ChoroplethMap = () => {
  const [regionData, setRegionData] = useState({});

  // Mapping Firebase region names to GeoJSON region names
  const regionMapping = {
    "REGION XI-DAVAO REGION": "Davao",
    "CARAGA": "Caraga",
    "REGION X-NORTHERN MINDANAO": "Northern Mindanao",
    "BARMM": "Autonomous Region in Muslim Mindanao",
    "REGION IX-ZAMBOANGA PENINSULA": "Zamboanga Peninsula",
    "REGION IVB-MIMAROPA": "Mimaropa",
    "REGION IV-A-CALABARZON": "Calabarzon",
    "REGION VII-EASTERN VISAYAS": "Eastern Visayas",
    "REGION V-BICOL REGION": "Bicol",
    "REGION III-CENTRAL LUZON": "Central Luzon",
    "Region II-CAGAYAN VALLEY": "Cagayan Valley",
    "NATIONAL CAPITAL REGION": "National Capital Region",
    "CAR": "Cordillera Administrative Region",
    "Region I-ILOCOS REGION": "Ilocos",
    "REGION VII-CENTRAL VISAYAS": "Central Visayas",
    "REGION VI-WESTERN VISAYAS": "Western Visayas",
    "REGION XII-SOCCSKSARGEN": "Soccsksargen",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dengueCollection = collection(db, 'dengueDb');
        const dengueDataSnapshot = await getDocs(dengueCollection);
        const dengueCases = dengueDataSnapshot.docs.map(doc => doc.data());

        // Aggregate cases by Firebase region names
        const aggregatedData = {};

        dengueCases.forEach(({ regions, cases }) => {
          // Map the Firebase region name to the correct GeoJSON region
          const mappedRegion = regions && regions.trim()
            ? regionMapping[regions.trim().toUpperCase()] || regions.trim().toUpperCase()
            : null;

          console.log(`Firebase Region: ${regions}, Mapped Region: ${mappedRegion}, Cases: ${cases}`);

          // Aggregate cases by region
          if (mappedRegion) {
            if (!aggregatedData[mappedRegion]) {
              aggregatedData[mappedRegion] = 0;
            }
            aggregatedData[mappedRegion] += cases;
          }
        });

        setRegionData(aggregatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Define a color scale for the number of cases
  const getColor = (cases) => {
    return cases > 5000 ? '#800026' :
           cases > 1000 ? '#BD0026' :
           cases > 500  ? '#E31A1C' :
           cases > 100  ? '#FC4E2A' :
           cases > 50   ? '#FD8D3C' :
           cases > 10   ? '#FEB24C' :
           cases > 0    ? '#FED976' :
                         '#FFEDA0';  // Lightest color for lowest case numbers
  };

  // Apply style based on the number of cases in each region
  const style = (feature) => {
    const regionName = feature.properties.name;
    const cases = regionData[regionName] || 0;

    return {
      fillColor: getColor(cases),
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature, layer) => {
    const regionName = feature.properties.name.trim();
    const cases = regionData[regionName] || 0;
  
    layer.bindTooltip(
      `<strong>${regionName}</strong><br>${cases} cases`,
      { direction: "center", className: "custom-tooltip", permanent: false }
    );
  };
  
  const LegendControl = () => {
    const map = useMap();
    
    useEffect(() => {
      const legend = L.control({ position: 'topright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 10, 50, 100, 500, 1000, 5000];
        const colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

        // Generate the legend HTML content
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML += 
            `<i style="background:${colors[i]}"></i> ${grades[i]}${grades[i + 1] ? '&ndash;' + grades[i + 1] : '+'}<br>`;
        }

        return div;
      };

      legend.addTo(map);
      
      return () => {
        map.removeControl(legend);
      };
    }, [regionData]);

    return null;
  };
  
  return (
    <MapContainer center={[12.8797, 121.7740]} zoom={5.5} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      <GeoJSON key={JSON.stringify(regionData)} data={PHILIPPINES_GEOJSON} style={style} onEachFeature={onEachFeature} />
      <LegendControl />
    </MapContainer>

  );
};

export default ChoroplethMap;
