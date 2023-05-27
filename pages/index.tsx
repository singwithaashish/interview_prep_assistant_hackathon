import { useState } from "react";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetch("/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          jobDescription,
        }),
      });
      const res = await data.json();
      console.log(res);
      setResult(res.message.content);

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
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between`}>
      <form
        className="w-full h-screen bg-gray-200 p-24"
        onSubmit={(e) => handleSubmit(e)}
      >
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
          </div>
        </div>
        <button className="bg-gray-900 w-full text-white rounded-lg p-4">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div
        className="flex flex-col items-center justify-center w-full p-24  min-h-screen "
        id="results"
      >
        <h1 className="text-3xl font-bold text-gray-900">Result</h1>
        <p className=" text-gray-900 whitespace-pre-line">
          {result.split("\n").map((item, i) => {
            return (
              <span key={i}>
                {item}
                <br />
              </span>
            );
          })}
        </p>
        <form action="/api/query" method="POST" className="flex w-full">
        <input required type="text" className="rounded-lg p-5 border-2 border-gray-900 w-9/12"  placeholder="Feel free to ask anything" />
        <button className="bg-gray-900 text-white rounded-lg p-4 w-3/12">Submit</button>
        </form>

      </div>
    </main>
  );
}
