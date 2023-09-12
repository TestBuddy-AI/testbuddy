import React from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  createStyles,
  Fab,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import Icon from "@material-ui/icons/NoteAdd";

it('should return correct styles for root element', () => {
  const theme = {
    spacing: jest.fn().mockReturnValue(4),
    breakpoints: {
      down: jest.fn().mockReturnValue('sm')
    }
  };
  const result = createStyles({ root: { position: "fixed", right: theme.spacing(4), bottom: theme.spacing(4), "& svg": { marginRight: theme.spacing(), }, [theme.breakpoints.down("sm")]: { right: theme.spacing(2), bottom: theme.spacing(2), "& svg": { marginRight: 0, }, }, }, })(theme);
  expect(result.root).toEqual({
    position: "fixed",
    right: 4,
    bottom: 4,
    "& svg": {
      marginRight: 4,
    },
    [theme.breakpoints.down("sm")]: {
      right: 2,
      bottom: 2,
      "& svg": {
        marginRight: 0,
      },
    },
  });
}); it('renders Fab component with root class', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = useMediaQuery(theme.breakpoints.down("sm"));
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.hasClass(classes.root)).toBe(true);
});

it('renders Fab component with round variant when collapse is true', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = true;
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.prop('variant')).toBe("round");
});

it('renders Fab component with extended variant when collapse is false', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = false;
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.prop('variant')).toBe("extended");
});

it('renders Fab component with primary color', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = useMediaQuery(theme.breakpoints.down("sm"));
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.prop('color')).toBe("primary");
});

it('renders Fab component with Link component', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = useMediaQuery(theme.breakpoints.down("sm"));
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.prop('component')).toBe(Link);
});

it('renders Fab component with large size', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = useMediaQuery(theme.breakpoints.down("sm"));
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.prop('size')).toBe("large");
});

it('renders Fab component with Icon component when collapse is false', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = false;
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.find(Icon)).toHaveLength(1);
});

it('does not render Fab component with Icon component when collapse is true', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = true;
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.find(Icon)).toHaveLength(0);
});

it('renders Fab component with "New Note" text when collapse is false', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = false;
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.text()).toBe("New Note");
});

it('does not render Fab component with "New Note" text when collapse is true', () => {
  const classes = useStyles();
  const theme = useTheme();
  const collapse = true;
  const wrapper = shallow(<Fab classes={{ root: classes.root }} variant={collapse ? "round" : "extended"} color="primary" component={Link} to="/create" size="large" />);
  
  expect(wrapper.text()).not.toBe("New Note");
});