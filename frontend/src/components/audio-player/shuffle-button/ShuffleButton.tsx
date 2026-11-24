import ShuffleIcon from "@mui/icons-material/Shuffle";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import IconButton from "@mui/material/IconButton";
import type { ShuffleButtonProps } from "./types/ShuffleButton.types";
import styles from "./shuffleButton.module.css";

const ShuffleButton = ({ enabled, onClick }: ShuffleButtonProps) => (
  <IconButton
    aria-label="Shuffle"
    aria-pressed={enabled}
    title={enabled ? "Shuffle On" : "Shuffle Off"}
    onClick={onClick}
    className={styles.button}
  >
    {enabled ? <ShuffleOnIcon /> : <ShuffleIcon />}
  </IconButton>
);

export default ShuffleButton;
