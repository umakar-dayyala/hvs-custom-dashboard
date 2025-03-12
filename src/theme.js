import { extendTheme } from "@chakra-ui/react";

const hitachiTheme = extendTheme({
  colors: {
    brand: {
      50: "#f2f6fb",
      100: "#d9e4f4",
      200: "#b0c9e8",
      300: "#80a6d6",
      400: "#5381c3",
      500: "#2c5aa8", // Primary brand color
      600: "#1e4180",
      700: "#142c5c",
      800: "#0c1b3b",
      900: "#050d1c",
    },
    text: {
      primary: "#262626",
      secondary: "#4D4D4D",
      disabled: "#B3B3B3",
    },
    background: {
      light: "#F5F5F5",
      dark: "#282828",
    },
    status: {
      success: "#28A745",
      warning: "#FFC107",
      error: "#DC3545",
      info: "#17A2B8",
    },
  },
  fonts: {
    heading: "Arial, sans-serif",
    body: "Arial, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "4px",
        fontWeight: "bold",
      },
      sizes: {
        md: {
          px: 6,
          py: 3,
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
        outline: {
          borderColor: "brand.500",
          color: "brand.500",
          _hover: {
            bg: "brand.50",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        borderRadius: "6px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        p: 4,
      },
    },
  },
});

export default hitachiTheme;
