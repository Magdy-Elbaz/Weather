import Container from "@mui/material/Container";
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

let cancelToken = null;

moment.locale("ar");

export default function Home() {
  const { t, i18n } = useTranslation();
  const [getLanguage, setLanguage] = useState("ar");
  const [time, setTime] = useState("");
  const [temp, setTemp] = useState({
    number: "",
    min: 0,
    max: 0,
    description: "",
    icon: "",
  });

  function handleLanguage() {
    if (getLanguage === "ar") {
      setLanguage("en");
      moment.locale("en");
      i18n.changeLanguage("en");
      setTime(moment().format("MMMM Do YYYY"));
    } else {
      setLanguage("ar");
      moment.locale("ar");
      i18n.changeLanguage("ar");
      setTime(moment().format("MMMM Do YYYY"));
    }
  }

  useEffect(() => {
    i18n.changeLanguage(getLanguage);
    setTime(moment().format("MMMM Do YYYY"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=30.03&lon=31.23&appid=a7368776ed860366e602fbde66cdb9d0",
        {
          cancelToken: new axios.CancelToken((c) => (cancelToken = c)),
        }
      )
      .then((req) => {
        const responsTemp = Math.round(req.data.main.temp - 272.15);
        const responsMin = Math.round(req.data.main.temp_min - 272.15);
        const responsMax = Math.round(req.data.main.temp_max - 272.15);
        const icon = req.data.weather[0].icon;
        setTemp({
          number: responsTemp,
          min: responsMin,
          max: responsMax,
          description: req.data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${icon}@2x.png`,
        });
      })
      .catch((error) => console.log(error));
    return () => {
      cancelToken();
    };
  }, []);
  return (
    <>
      <Container
        maxWidth="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div>
          <div className="card" dir={getLanguage === "ar" ? "rtl" : "ltr"}>
            <div className="box-top">
              <h1>{t("Cairo")}</h1>
              <p>{time}</p>
            </div>
            <hr style={{ margin: "10px 0" }} />
            <div className="box-bottom">
              <div>
                <div className="temperature">
                  <h1>{temp.number}</h1>
                  <img src={temp.icon} draggable={false} />
                </div>
                <p>{t(temp.description)}</p>
                <div className="minMax">
                  <p>
                    {t("min")} : {temp.min}
                  </p>
                  <p>
                    {t("max")} : {temp.max}
                  </p>
                </div>
              </div>
              <CloudIcon style={{ fontSize: "120px" }} />
            </div>
          </div>
          <button className="language" onClick={handleLanguage}>
            {getLanguage === "ar" ? "انجليزي" : "Arapic"}
          </button>
        </div>
      </Container>
    </>
  );
}