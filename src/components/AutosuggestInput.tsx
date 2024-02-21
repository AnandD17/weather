import React, { useEffect, useState } from "react";
import { CommonAPI } from "../apis/commonApi";
import { Suggestion } from "../interfaces";

type Props = {
  handleSubmit: (name: Suggestion) => void;
};

const AutosuggestInput = (props: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>();
  const [text, setText] = useState<string>("");

  const submitRef = React.useRef<HTMLButtonElement>(null);

  const onTextChange = async (text: string) => {
    try {
      const params = {
        text,
        language: "en",
      };
      const res = await CommonAPI.getSuggestions(params);
      if (res) {
        setSuggestions(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (suggestions && suggestions.length > 0) {
      props.handleSubmit(suggestions[0]);
      setSuggestions([]);
      setText("");
    }
  };

  useEffect(() => {
    if (text && text.length > 2) onTextChange(text);
    else setSuggestions([]);
  }, [text]);

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        if (submitRef.current) submitRef.current.click();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="w-[100%] relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search"
        className="w-full p-3 rounded-md border border-gray-300 h-[40px] focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out bg-transparent text-white placeholder-white"
      />
      <button
        className="none"
        ref={submitRef}
        onClick={() => handleSubmit()}
      ></button>
      {suggestions && text && suggestions.length > 0 ? (
        <div className="absolute w-full top-10 left-0 p-3 bg-[rgba(0,0,0,0.4)] shadow-lg rounded-xl">
          <div className=" max-h-[400px] overflow-y-auto">
            {suggestions?.map((suggestion: any) => (
              <div
                key={suggestion.id}
                className="p-2 bg-gray-800 rounded-md mt-1 cursor-pointer hover:bg-gray-700 transition-all duration-300 ease-in-out"
                onClick={() => {
                  props.handleSubmit(suggestion);
                  setSuggestions([]);
                  setText("");
                }}
              >
                {suggestion.name}, {suggestion.adm_area2},{" "}
                {suggestion.adm_area1}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AutosuggestInput;
