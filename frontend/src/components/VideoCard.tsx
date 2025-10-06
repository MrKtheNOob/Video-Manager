import type { Video } from "../services/api";
import Button from "./Button";
import youtube from "../assets/youtube.png";
import instagram from "../assets/instagram.png";
import tiktok from "../assets/tiktok.png";
interface VideoCardProps {
  video: Video;
  onDelete: () => void;
}

export default function VideoCard({ video, onDelete }: VideoCardProps) {
  const source = () => {
    return video.platform === "www.youtube.com"
      ? youtube
      : video.platform === "www.instagram.com"
      ? instagram
      : tiktok;
  };
  return (
    <div className="w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Whole card is a link */}
      <a href={video.link} target="_blank" rel="noopener noreferrer">
        <img
          src={`/api/proxy-image/?url=${encodeURIComponent(
            video.thumbnail_url
          )}`}
          alt={video.title}
          className="w-full h-55 object-cover"
        />
        <img
          className="relative z-10 left-[85%] bottom-[10%] "
          height={30}
          width={30}
          src={source()}
          alt=""
        />
        <div className="p-3">
          <h2 className="text-lg font-semibold line-clamp-1">{video.title}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{video.uploader}</p>
        </div>
      </a>

      {/* Delete button */}
      <Button textContent="Delete" onClick={onDelete} variant="delete" />
    </div>
  );
}
