import { useEffect, useMemo, useState } from "react";

import { getVideos, searchVideos, type Video } from "../services/api";
import SearchBar from "../components/SearchBar";
import VideoGrid from "../components/VideoGrid";
import { InputPopup } from "../components/InputPopup";
import Button from "../components/Button";

function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  // const [loading,setLoading]=useState<boolean>(false)

  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await getVideos();
      console.log(videos);
      console.log(videos);
      console.log(videos);
      console.log(videos);
      setVideos(videos);
    };
    fetchVideos();
  }, []);

  const handleOnClose = () => {
    setOpen(false);
  };
  const handleOnSubmit = () => {
    console.log("Submitted value:", inputValue);
    // setLoading(true)
    fetch("/api/videos/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: inputValue }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // ✅ return promise
      })
      .then((data) => {
        console.log("Server response:", data); // ✅ now logs parsed JSON
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setOpen(false);
    // setLoading(false)
  };

  const handleOnDelete = () => {
    return;
  };
  const debouncedSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;

    return (query: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        searchVideos(query).then((videos) => {
          setVideos(videos);
        });
      }, 500);
    };
  }, []);

  const handleOnChange = (query: string) => {
    debouncedSearch(query);
  };
  return (
    <>
      <header className="flex flex-col items-center mt-10 mb-5">
        <h1 className="text-center">Videos</h1>
        <SearchBar onChange={handleOnChange} />
      </header>
      <main className="flex-col justify-center m-[5em]">
        <VideoGrid videos={videos} onDelete={handleOnDelete} />
      </main>
      {open && (
        <InputPopup
          isOpen={open}
          onClose={handleOnClose}
          onSubmit={handleOnSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      )}
      <span className="fixed left-[50%] bottom-0.5">
        <Button
          onClick={() => {
            setOpen(true);
          }}
          textContent="Add video"
        />
      </span>
    </>
  );
}

export default Home;
