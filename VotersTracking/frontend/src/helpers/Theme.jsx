import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2737c4",
        },
        secondary: {
            main: "#ff3737",
        },
    },
    typography: {
        fontFamily: ["Poppins"].join(","),
    },
}); 

export default theme;
