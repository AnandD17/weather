import React, { useEffect, useState } from "react";
import { IMAGES } from "../../assets";
import { CommonAPI } from "../../apis/commonApi";
import AutosuggestInput from "../../components/AutosuggestInput";
import { Postion, Suggestion } from "../../interfaces";
import moment from "moment";
import { generateGreetings } from "../../utils/commonFunction";
import { WEATHER_ICONS } from "../../assets/new_weather_icons";
import ReactApexChart from "react-apexcharts";

type Props = {};

const Home = (props: Props) => {
  //Weather Data
  const [city, setCity] = useState<Suggestion>({
    adm_area1: "",
    adm_area2: "",
    country: "",
    lat: "",
    lon: "",
    name: "",
    place_id: "",
    timezone: "",
    type: "",
  });
  const [currentWeather, setCurrentWeather] = useState<any>({});
  const [dailyWeather, setDailyWeather] = useState<any>([]);
  const [hourlyWeather, setHourlyWeather] = useState<any>([]);
  const getWeatherByPlace = async (isText: boolean, city: any) => {
    console.log(city);

    let param;
    if (isText && city?.place_id) {
      param = {
        language: "en",
        place_id: city?.place_id,
      };
    } else {
      param = {
        language: "en",
        lat: city?.lat,
        lon: city?.lon,
      };
    }

    const [res, dailyRes, hourlyRes] = await Promise.all([
      CommonAPI.getWeatherData(param),
      CommonAPI.getDailyWeatherData(param),
      CommonAPI.getHourlyWeatherData(param),
    ]);
    if (res) {
      setCurrentWeather(res.data);
    }
    if (dailyRes && dailyRes.data.daily.data) {
      setDailyWeather(dailyRes.data.daily.data);
    }
    console.log(hourlyRes);

    if (hourlyRes && hourlyRes?.data?.hourly?.data) {
      const arr = hourlyRes?.data?.hourly?.data
        ?.slice(0, 24)
        ?.filter((item: any, index: number) => {
          if (index % 3 == 0) {
            return item;
          }
        });
      console.log(arr);

      setHourlyWeather(arr);
    }
  };

  //Charts
  const series = [
    {
      name: "Temperature",
      data: hourlyWeather?.map((item: any) => item.temperature) || [],
    },
  ];

  console.log(series);

  const options: any = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        height: "20px",
        width: "20px",
        borderRadius: "50%",
      },
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "",
      align: "left",
    },
    grid: {
      row: {
        colors: ["transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
        title: {
          text: "Number of Sales",
        },
      },
    },
    xaxis: {
      categories:
        hourlyWeather?.map((item: any) =>
          moment(item.date).format("HH:mm A")
        ) || [],
    },
    toolbar: {
      show: false,
    },
  };

  console.log(options);

  // Realtime Time
  const ref = React.useRef<any>();
  const [time, setTime] = React.useState(moment().format("HH:mm A"));
  const [day, setDay] = React.useState(moment().format("dddd"));
  const [date, setDate] = React.useState(moment().format("MMM Do"));
  const [greeting, setGreeting] = React.useState(generateGreetings());
  useEffect(() => {
    ref.current = setInterval(() => {
      setTime(moment().format("HH:mm A"));
      setDay(moment().format("dddd"));
      setDate(moment().format("MMMM D"));
      setGreeting(generateGreetings());
    }, 1000);
    return () => {
      clearInterval(ref.current);
    };
  }, []);

  //Get Weather By Lat Long
  const getNearestPlaces = async (position: Postion) => {
    const res = await CommonAPI.getNearestPlaces(position);
    console.log(res);
    if (res && res.data) {
      setCity(res.data);
      getWeatherByPlace(true, res.data);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        // setPosition({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // });
        const params = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          language: "en",
        };
        if (position) {
          getNearestPlaces(params);
        }
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);
  return (
    <div>
      <div className="flex flex-col-reverse lg:grid grid-cols-4 min-h-screen">
        <div className="col-span-3 p-5">
          <div className="grid grid-cols-12 gap-4">
            <div
              className="col-span-12 rounded-2xl p-5 text-white relative "
              style={{
                background: `url(${IMAGES.MOUNTAIN})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] z-10 rounded-2xl"></div>
              <div className="z-50 relative">
                <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start gap-4">
                  <div>
                    <p>
                      {city?.name +
                        (city?.adm_area2 ? ", " + city?.adm_area2 : "") +
                        (city?.adm_area1 ? ", " + city?.adm_area1 : "") ||
                        "Select City"}
                    </p>
                    <h4 className="text-xl">{greeting}</h4>
                  </div>
                  <div className="lg:w-[350px] w-full">
                    <AutosuggestInput
                      handleSubmit={(suggestion: Suggestion) => {
                        setCity(suggestion);
                        getWeatherByPlace(true, suggestion);
                      }}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h1 className="text-[50px]">{time}</h1>
                  <p className="">
                    {day}, {date} | {time}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-10">
                  <div>
                    <p>Weather Forecast</p>
                    <h3 className="text-xl mt-1">
                      {currentWeather?.current?.summary ||
                        "Select a city to view Forecase"}
                    </h3>
                    <p className="mt-1">
                      {currentWeather?.current?.precipitation?.type &&
                      currentWeather?.current?.precipitation?.type !== "none"
                        ? currentWeather?.current?.precipitation?.type + ", "
                        : ""}
                      Precipitation:{" "}
                      {currentWeather?.current?.precipitation?.total || "0"} %
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {hourlyWeather && hourlyWeather?.length > 0 ? (
              <div className=" col-span-12 rounded-2xl p-5 border" id="chart">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="line"
                  height={350}
                />
                <div className="text-lg text-center ">
                  Temperature Chart for next 24 hours
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center col-span-12 rounded-2xl p-5 border lg:py-[150px] py-[100px] shadow-lg">
                <h4>Please Select a city to view the weather forecast</h4>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 bg-primary p-5 text-white">
          {/* <div className="flex justify-end">
            <Toggle />
          </div> */}
          {dailyWeather && dailyWeather?.length > 0 ? (
            <>
              <div className="flex items-center justify-center flex-col">
                <img
                  src={WEATHER_ICONS[currentWeather?.current?.icon_num - 1]}
                  className="w-[50px]"
                  alt=""
                />
                <h4 className="text-[40px] font-semibold">
                  {currentWeather?.current?.temperature || 0}° C
                </h4>
                <p>{currentWeather?.current?.summary}</p>
                <div className="w-[200px] grid grid-cols-2 mt-5 gap-y-2">
                  <div className="col-span-1 border-r-2 border-white text-start">
                    Wind
                  </div>
                  <div className="col-span-1 text-end">
                    {currentWeather?.current?.wind?.speed} km/h
                  </div>
                  <div className="col-span-1 border-r-2 border-white text-start">
                    Hum
                  </div>
                  <div className="col-span-1 text-end">
                    {currentWeather?.current?.humidity}
                  </div>
                </div>
              </div>
              <h4 className="text-lg mt-10 mb-5">Avg Weather Forcast</h4>
              <div className="flex flex-col">
                {dailyWeather &&
                  dailyWeather?.slice(0, 7)?.map((item: any, i: number) => (
                    <div
                      className={`flex justify-between items-center py-5 ${
                        i === 6 ? "" : "border-b-[0.5px]"
                      } border-white`}
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={WEATHER_ICONS[item?.icon - 1]}
                          className="w-10 h-10"
                          alt=""
                        />
                        <div className="flex flex-col justify-between">
                          <h5>
                            {moment(item.day).format("dddd")},{" "}
                            {moment(item.day).format("MMM D")}
                          </h5>
                          <p>
                            {item?.summary?.split(".")?.[0]?.split(",")?.[0] ||
                              item?.weather}
                          </p>
                        </div>
                      </div>
                      <div className="w-[60px] border-l-2 border-white flex items-center p-2 h-9 whitespace-nowrap">
                        {item?.temperature}° C
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center py-[100px]">
              Select City to view the weather forecast
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
