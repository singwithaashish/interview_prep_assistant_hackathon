import { useState } from "react";
import useLLM from "usellm";
import Dropzone from "react-dropzone";
import pdfParse from "pdf-parse";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<{ role: string; content: any }[]>([]);

  const [file, setFile] = useState<File | null>(null);

  const llm = useLLM({ serviceUrl: "/api/llm" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const data = await fetch("/api/job", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     resume,
      //     jobDescription,
      //   }),
      // });
      // const res = await data.json();
      // console.log(res);
      // setResult(res.message.content);

      llm.chat({
        messages: [
          {
            role: "system",
            content:
              "you are interviewprep assistant. You take in a job description and resume from potential client and prepare all the possible relavant questions for that job description along with some resources to prepare. You also give the client a list of skills that they need to learn to get the job and also how likely they are to get the job.",
          },
          {
            role: "user",
            content: `resume ${resume} job description ${jobDescription}`,
          },
        ],
        stream: true,
        onStream: ({ message }) => {
          setResult(message.content);
        },
      });

      const element = document.getElementById("results");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      } else {
        // handle the case where the element was not found, if necessary
      }

      // console.log(res);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // const summarisePreviousConvo = async (
  //   e: React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const data = await fetch("/api/summarise", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         previousResponse: `resume ${resume} jobDescription ${jobDescription} result ${result}`,
  //       }),
  //     });
  //     const res = await data.json();
  //     console.log(res);
  //     // setResult(res.message.content);
  //     setLoading(false);
  //     return res;
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //     return err;
  //   }
  // };

  const askQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const data = await fetch("/api/inquiry", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     previousResponse:
      //     currentQuery: query,
      //   }),
      // });
      // const res = await data.json();
      // console.log(res);
      // setResult((prev) => prev + "\n ---- \n" + res.message.content);
      // // setLoading(false);
      // // return res;
      // console.log(history);
      // if (history.length === 0) {

      //   setHistory([
          // {
          //   role: "user",
          //   content: `this was your previous response and users will ask questions based on that ${result}`,
          // },
      //   ]);
      //   console.log("history was empty");
      // }
      console.log(history);

      const newHistory = [...history, { role: "user", content: query }];
      setHistory(newHistory);
      setQuery("");

      llm.chat({
        messages: [{
          role: "user",
          content: `this was your previous response and users will ask questions based on that ${result}`,
        }, ...newHistory],
        stream: true,
        onStream: ({ message }) => setHistory([...newHistory, message]),
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between`}>
      <form
        className="w-full h-screen bg-gray-200 px-24 py-10"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Interview prep Assistant
        </h1>
        <div className="flex mb-10">
          <div className="flex flex-col w-1/2 mr-4">
            <label className=" text-gray-900">Enter Job Description</label>
            <textarea
              className=" border-2 border-gray-900 rounded-lg p-4"
              rows={10}
              required
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
            ></textarea>
          </div>
          <div className="flex flex-col w-1/2">
            <label className=" text-gray-900">Enter Resume</label>
            <textarea
              className="border-2 border-gray-900 rounded-lg p-4"
              onChange={(e) => setResume(e.target.value)}
              value={resume}
              required
              rows={10}
            ></textarea>
            <Dropzone
              onDrop={async (acceptedFiles: File[]) => {
                const file = acceptedFiles[0];
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });
                const data = await response.json();
                setResume(data.text);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag n drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        </div>
        <button className="bg-gray-900 w-full text-white rounded-lg p-4">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div
        className={`flex flex-col items-center justify-center w-full p-24  min-h-screen `}
        id="results"
      >
        <h1 className="text-3xl font-bold text-gray-900">{
        loading? "Loading..." : "Results"
        }</h1>
        <p className=" text-gray-900 whitespace-pre-line">
          {result.split("\n").map((item, i) => {
            return (
              <span key={i}>
                {item}
                <br />
              </span>
            );
          })}
          {history.map((message, idx) => {
            if(idx === 0)
            {
              return (<h1 key={idx} className="text-3xl font-bold text-gray-900">Conversation begins</h1>)
            }
            return (
              <div key={idx} className="my-4">
                <div className="font-semibold text-gray-800">
                  {message.role.toUpperCase()}
                </div>
                <div className="text-gray-600">{message.content}</div>
              </div>
            );
          })}
        </p>
        <form onSubmit={(e) => askQuestion(e)} className="flex w-full mt-3">
          <input
            required
            type="text"
            className="rounded-lg p-5 border-2 border-gray-900 w-9/12"
            placeholder="Feel free to ask anything"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <button className="bg-gray-900 text-white rounded-lg p-4 w-3/12 ml-5">
            Submit
          </button>
          {/* <button onClick={() => setHistory([])} className="bg-gray-900 text-white rounded-lg p-4 w-3/12 ml-5">
            Stop
          </button> */}
        </form>
      </div>
    </main>
  );
}
