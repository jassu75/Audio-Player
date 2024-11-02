import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const PlaySong = () => {
    const id = useParams();
    const songId = id.id;
        const songs = useSelector((state) => state.songs.songs); // Accessing the songs from the global state

    
    return (  <div>Hello</div>);
}
 
export default PlaySong;