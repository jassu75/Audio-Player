import RequireFavorites from "./helpers/RequireFavorites";
import RequirePlaylistCollection from "./helpers/RequirePlaylistCollection";
import RequireUser from "./helpers/RequireUser";

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
