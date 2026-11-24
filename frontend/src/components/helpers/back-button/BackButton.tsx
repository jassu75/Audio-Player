import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import styles from "./backButton.module.css";

const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    const historyIndex: unknown = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <nav className={styles.container} aria-label="Page navigation">
      <IconButton
        type="button"
        aria-label="Back"
        onClick={handleBack}
        className={styles.button}
      >
        <ArrowBackIcon />
      </IconButton>
    </nav>
  );
};

export default BackButton;
