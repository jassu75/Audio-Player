import HomepageSongsList from "./Songlist/HomepageSongs/homepageSongsList";
import songs from "./songs.json"

const Homepage = () => {


    
    return (<HomepageSongsList songsList={songs}/> );
}
 
export default Homepage;