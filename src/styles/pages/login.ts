import {
  createStyles
} from "@mantine/core";


export const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    maxWidth: 450,
    minWidth: 350,
    paddingTop: 80,
    borderRadius: 0,
    padding: 30,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: "Griffy",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 50
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  input: {
    [`.mantine-textInput-input:focus`]: {
      border: "1px solid #7f7fff"
    },
    [`.mantine-PasswordInput-input:focus-within`]: {
      border: "1px solid #7f7fff",
    },
  },

  button: {
    background: "#ced4da",
    webkitTransition: "all 0.3s ease",
    mozTransition: "all 0.3s ease",
    oTransition: "all 0.3s ease",
    transition: "all  0.3s ease",
    marginTop: 40
  },

  divider: {
    marginTop: 40
  },

  avatar: {
    borderRadius: 50,
    margin: "auto",
    textAlign: "center",
    webkitTransition: "all 0.3s ease",
    mozTransition: "all 0.3s ease",
    oTransition: "all 0.3s ease",
    transition: "all  0.3s ease",
    ":hover": {
      transform: "scale(1.3, 1.3)",
    },
  },

  span: {
    marginTop: 20,
    fontSize: 12
  },

  link: {
    marginTop: 10,
    fontSize: 12
  }
}));
