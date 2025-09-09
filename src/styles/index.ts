import { extendTheme, ThemeConfig, ThemeComponents } from "@chakra-ui/react";
import { color } from "framer-motion";

interface CustomTheme extends ThemeConfig {
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    primary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    error: string;
    warning: string;
    border: string;
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
    };
    dark: {
      primary: string;
      secondary: string;
    };
    white: {
      primary: string;
      secondary: string;
    };
    blue: string;
    rootBackground: string;
  };
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  components: ThemeComponents;
}

const theme = extendTheme({
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  colors: {
    primary: "#359EFF", // primary-blue

    background: "#f5f6fb", // primary-color
    surface: "#ffffff", // secondary-white-color
    textPrimary: "#1e1e1e", // text-gray
    textSecondary: "#757575", // primary-grey-color
    success: "#34A853",
    error: "#EA4335",
    warning: "#FBBC05",
    border: "#E0E0E0",
    gray: {
      50: "#F8F9FB",
      100: "#F2F4F8",
      200: "#E0E0E0",
      300: "#C4C4C4",
      400: "#A0A0A0",
      500: "#757575", // primary-grey-color
      600: "#3C4043",
      700: "#1e1e1e", // text-gray
    },
    blue: {
      50: "#eef8ff",
      100: "#d9efff",
      200: "#bce4ff",
      300: "#8ed5ff",
      400: "#59bbff",
      500: "#359EFF",
      600: "#1b7ef5",
      700: "#1467e1",
      800: "#1752b6",
      900: "#19488f",
      950: "#142c57",
    },
    dark: {
      primary: "#100e1f", // primary-dark-color
      secondary: "#1d293d", // secondary-dark-color
    },
    white: {
      primary: "#fff8fa", // primary-white-color
      secondary: "#ffffff", // secondary-white-color
    },
    rootBackground: "#0F1A24",
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
  shadows: {
    sm: "0 2px 4px rgba(0,0,0,0.05)",
    md: "0 4px 8px rgba(0,0,0,0.1)",
    lg: "0 8px 16px rgba(0,0,0,0.1)",
    xl: "0 12px 24px rgba(0,0,0,0.1)",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "12px",
        fontWeight: "medium",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        _hover: {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      variants: {
        solid: (props: { colorScheme?: string }) => {
          const { colorScheme } = props;
          if (colorScheme === "blue") {
            return {
              bg: "blue.500",
              color: "white",
              _hover: { bg: "blue.600" },
            };
          }
          if (colorScheme === "success") {
            return {
              bg: "success",
              color: "white",
              _hover: { bg: "#258944" },
            };
          }
          if (colorScheme === "error") {
            return {
              bg: "error",
              color: "white",
              _hover: { bg: "#B31412" },
            };
          }
          if (colorScheme === "warning") {
            return {
              bg: "warning",
              color: "#222",
              _hover: { bg: "#E2B203" },
            };
          }
          return {};
        },
        outline: (props: { colorScheme?: string }) => {
          const { colorScheme } = props;
          if (colorScheme === "blue") {
            return {
              color: "blue.500",
              border: "1px solid",
              borderColor: "blue.500",
              bg: "transparent",
              _hover: {
                bg: "blue.50",
                borderColor: "blue.600",
                color: "blue.600",
              },
              _active: {
                bg: "blue.100",
              },
            };
          }
          if (colorScheme === "success") {
            return {
              color: "success",
              border: "1px solid",
              borderColor: "success",
              bg: "transparent",
              _hover: {
                bg: "green.50",
                borderColor: "#258944",
                color: "#258944",
              },
              _active: {
                bg: "green.100",
              },
            };
          }
          if (colorScheme === "error") {
            return {
              color: "error",
              border: "1px solid",
              borderColor: "error",
              bg: "transparent",
              _hover: {
                bg: "red.50",
                borderColor: "#B31412",
                color: "#B31412",
              },
              _active: {
                bg: "red.100",
              },
            };
          }
          if (colorScheme === "warning") {
            return {
              color: "warning",
              border: "1px solid",
              borderColor: "warning",
              bg: "transparent",
              _hover: {
                bg: "yellow.50",
                borderColor: "#E2B203",
                color: "#E2B203",
              },
              _active: {
                bg: "yellow.100",
              },
            };
          }
          return {};
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: "12px",
          fontSize: "14px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          _hover: {
            borderColor: "blue.500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          },
          _focus: {
            borderColor: "blue.500",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          },
        },
        icon: {
          color: "blue.500",
        },
      },
      variants: {
        outline: {
          field: {
            borderColor: "border",
            _hover: {
              borderColor: "blue.500",
            },
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "12px",
          fontSize: "14px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          _focus: {
            borderColor: "primary",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          },
        },
      },
      variants: {
        outline: {
          field: {
            borderColor: "border",
            _hover: {
              borderColor: "gray.400",
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          bg: "surface",
        },
        overlay: {
          bg: "rgba(0, 0, 0, 0.4)",
        },
        header: {
          fontWeight: "bold",
          fontSize: "18px",
          color: "textPrimary",
        },
        closeButton: {
          top: "16px",
          right: "16px",
          _hover: {
            bg: "gray.100",
          },
        },
      },
    },
    Table: {
      baseStyle: {
        th: {
          bg: "background",
          color: "textSecondary",
          fontWeight: "bold",
          fontSize: "15px",
          textTransform: "none",
        },
        td: {
          fontSize: "14px",
        },
      },
      variants: {
        simple: {
          th: {
            borderBottom: "1px solid",
            borderColor: "border",
            bg: "background",
            color: "textSecondary",
          },
          td: {
            borderBottom: "1px solid",
            borderColor: "border",
          },
          tr: {
            _hover: {
              bg: "gray.50",
            },
          },
        },
      },
    },
    Switch: {
      baseStyle: {
        track: {
          bg: "border",
          _checked: { bg: "primary" },
        },
        thumb: {
          bg: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          bg: "surface",
        },
      },
    },
    Radio: {
      baseStyle: {
        control: {
          borderRadius: "full",
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: "",
        },
      },
    },
    Alert: {
      baseStyle: {
        title: {
          color: "white",
        },
        description: {
          color: "white",
        },
      },
      variants: {
        solid: (props: { status?: string }) => {
          const { status } = props;
          console.log("Alert status:", status);

          if (status === "success") {
            return {
              bg: "success",
              color: "white",
              icon: {
                color: "white",
              },
            };
          }
          if (status === "error") {
            return {
              bg: "error",
              color: "white",
              icon: {
                color: "white",
              },
            };
          }
          if (status === "warning") {
            return {
              bg: "warning",
              color: "#222",
              icon: {
                color: "white",
              },
            };
          }
          return {};
        },
      },
      toast: {
        baseStyle: {
          container: {
            bg: "surface",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          },
          title: {
            fontWeight: "bold",
          },
          description: {
            fontSize: "14px",
          },
          icon: {
            color: "white",
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#359EFF",
        color: "textPrimary",
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
      "h1, h2, h3, h4, h5, h6": {
        color: "textPrimary",
        fontWeight: "600",
      },
    },
  },
}) as CustomTheme;

export default theme;
