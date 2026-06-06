import RequireFavorites from "./helper/RequireFavorites";
import RequirePlaylistCollection from "./helper/RequirePlaylistCollection";
import RequireUser from "./helper/RequireUser";

const wrappers = {
  user: RequireUser,
  playlistCollection: RequirePlaylistCollection,
  favorites: RequireFavorites,
};

const RequireStates = ({ children, skeleton = null, requires = [] }) => {
  return requires.reduceRight((wrapped, key) => {
    const Wrapper = wrappers[key];
    if (!Wrapper) return wrapped;
    return <Wrapper skeleton={skeleton}>{wrapped}</Wrapper>;
  }, children);
};

export default RequireStates;
