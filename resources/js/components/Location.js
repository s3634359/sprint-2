import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocationOn from "@material-ui/icons/LocationOn";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        width: "10%",
        margin: theme.spacing(3, 1, 2)
    },
    list: {
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    listItem: {
        width: "22%"
    },
    listItemHead: {
        width: "28%"
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Location(props) {
    const [locations, setLocations] = React.useState(JSON.parse(props.data));
    const classes = useStyles();
    const [id, setId] = React.useState("");
    const [name, setName] = React.useState("");
    const [x_axis, setx_axis] = React.useState("");
    const [y_axis, sety_axis] = React.useState("");
    const [minTime, setMinTime] = React.useState(0);
    const [description, setDescription] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const [addBtn, setAddBtn] = React.useState(false);
    const [editBtn, setEditBtn] = React.useState(true);
    const [removeBtn, setRemoveBtn] = React.useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleName = event => {
        setName(event.target.value);
    };

    const handleX = event => {
        setx_axis(event.target.value);
    };

    const handleY = event => {
        sety_axis(event.target.value);
    };

    const handleDescription = event => {
        //Presentations: between 100 - 150 wpm for a comfortable pace
        //Assume Robot speaks 2 words every second
        setDescription(event.target.value);
        setMinTime(event.target.value.split(" ").length / 2);
    };

    const add = event => {
        // add
        event.preventDefault();
        setx_axis(parseFloat(x_axis).toFixed(2));
        sety_axis(parseFloat(y_axis).toFixed(2));

        axios
            .post("/locationSubmit", {
                name: name,
                x_axis: x_axis,
                y_axis: y_axis,
                description: description,
                min_time: minTime
            })
            .then(function (response) {
                //List update
                setLocations([
                    ...locations,
                    {
                        id: locations[locations.length - 1].id + 1,
                        name: name,
                        x_axis: x_axis,
                        y_axis: y_axis,
                        description: description,
                        min_time: minTime
                    }
                ]);
            })
            .catch(function (error) {
                console.log(error);
            });

        // change buttons' state
        cancel();
    };

    const edit = () => {
        event.preventDefault();
        setx_axis(parseFloat(x_axis).toFixed(2));
        sety_axis(parseFloat(y_axis).toFixed(2));

        axios
            .post("/locationEdit", {
                id: id,
                name: name,
                x_axis: x_axis,
                y_axis: y_axis,
                description: description,
                min_time: minTime
            })
            .then(function (response) {
                // update the list
                var backup = locations;
                setLocations(locations.filter(location => location.id != id));
                for (let location of backup) {
                    if (location.id == id) {
                        location.name = name;
                        location.x_axis = x_axis;
                        location.y_axis = y_axis;
                        location.description = description;
                        location.min_time = minTime;
                    }
                }
                setLocations(backup);
            })
            .catch(function (error) {
                console.log(error);
            });




        // change buttons' state
        cancel();
    };

    const remove = () => {
        event.preventDefault();

        axios
            .post("/locationRemove", {
                id: id,
            })
            .then(function (response) {
                // update the list (could use setState and filter)
                setLocations(locations.filter(location => location.id != id));
            })
            .catch(function (error) {
                console.log(error);
            });



        // change buttons' state
        cancel();
    };

    const cancel = () => {
        setName("");
        setx_axis("");
        sety_axis("");
        setDescription("");
        setMinTime("");
        setOpen(false);
        setSelectedIndex(0);

        setAddBtn(false);
        setRemoveBtn(true);
        setEditBtn(true);
    };

    const handleListItemClick = (event, i) => {
        setSelectedIndex(i);

        for (const location of locations) {
            if (location.id == i) {
                setId(location.id);
                setName(location.name);
                setx_axis(location.x_axis);
                sety_axis(location.y_axis);
                setDescription(location.description);
                setMinTime(location.min_time);
            }
        }
        setAddBtn(true);
        setRemoveBtn(false);
        setEditBtn(false);
    };

    const list = [
        <ListItem button>
            <ListItemText
                className={classes.listItemHead}
                align="center"
                primary={"Location Name"}
            />
            <ListItemText
                className={classes.listItem}
                align="center"
                primary={"X"}
            />
            <ListItemText
                className={classes.listItem}
                align="center"
                primary={"Y"}
            />
            <ListItemText
                className={classes.listItem}
                align="center"
                primary={"T"}
            />
        </ListItem>
    ];
    for (const location of locations) {
        list.push(
            <ListItem
                button
                selected={selectedIndex === location.id}
                onClick={event => handleListItemClick(event, location.id)}
            >
                <ListItemIcon>
                    <LocationOn />
                </ListItemIcon>
                <ListItemText
                    className={classes.listItem}
                    align="center"
                    primary={location.name}
                />
                <ListItemText
                    className={classes.listItem}
                    align="center"
                    primary={location.x_axis}
                />
                <ListItemText
                    className={classes.listItem}
                    align="center"
                    primary={location.y_axis}
                />
                <ListItemText
                    className={classes.listItem}
                    align="center"
                    primary={location.min_time}
                />
            </ListItem>
        );
    }

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                >
                    Location
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                name="locationName"
                                variant="outlined"
                                required
                                fullWidth
                                id="locationName"
                                onChange={handleName}
                                label="Location Name"
                                autoFocus
                                value={name}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                type="number"
                                inputProps={{ step: "0.01" }}
                                id="x-axis"
                                label="x-axis"
                                name="x-axis"
                                onChange={handleX}
                                value={x_axis}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                type="number"
                                inputProps={{ step: "0.01" }}
                                id="y-axis"
                                label="y-axis"
                                name="y-axis"
                                onChange={handleY}
                                value={y_axis}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                                id="min_time"
                                label="Min. Time (sec)"
                                name="min_time"
                                value={minTime}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                multiline
                                rows="5"
                                rowsMax="6"
                                id="description"
                                label="Description"
                                name="description"
                                onChange={handleDescription}
                                value={description}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        className={classes.submit}
                        variant="outlined"
                        color="inherit"
                        onClick={add}
                        disabled={addBtn}
                    >
                        Add
                    </Button>
                    <Button
                        className={classes.submit}
                        variant="outlined"
                        color="primary"
                        onClick={edit}
                        disabled={editBtn}
                    >
                        Edit
                    </Button>
                    <Button
                        className={classes.submit}
                        variant="outlined"
                        color="secondary"
                        onClick={handleClickOpen}
                        disabled={removeBtn}
                    >
                        Remove
                    </Button>
                    <Button
                        className={classes.submit}
                        variant="outlined"
                        onClick={cancel}
                    >
                        Cancel
                    </Button>

                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            {"Are you sure to delete the location?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={remove} color="primary">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Divider />
                    <div className={classes.list}>
                        <List component="nav" aria-label="locations">
                            {list}
                        </List>
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default Location;

if (document.getElementById("location")) {
    var data = document.getElementById("location").getAttribute("data");
    ReactDOM.render(
        <Location data={data} />,
        document.getElementById("location")
    );
}
