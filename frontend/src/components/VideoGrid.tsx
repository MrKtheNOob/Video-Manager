import type { Video } from "../services/api";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  onDelete: () => void;
}

export default function VideoGrid({ videos, onDelete }: VideoGridProps) {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      {videos.map((video, index) => {
        return <VideoCard key={index} video={video} onDelete={onDelete} />;
      })}
    </div>
  );
}
