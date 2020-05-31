import React from "react";
import ReactDOM from "react-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Slide,
    TextField,
    Typography
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(2)
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
        marginTop: theme.spacing(4)
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8)
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia: {
        paddingTop: "56.25%" // 16:9
    },
    cardContent: {
        flexGrow: 1
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    typeButton: {
        width: "30%",
        margin: theme.spacing(0.3),
        background: "white"
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Tour(props) {
    const [tours, setTours] = React.useState(JSON.parse(props.data));
    const [types, setTypes] = React.useState(JSON.parse(props.type));
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [newTour, setNewTour] = React.useState("");
    const [modalOpen, setModalOpen] = React.useState(false);
    const [tour_id, set_tour_id] = React.useState("");
    const [lastId, setLastId] = React.useState(0);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = event => {
        axios
            .post("/deleteTour", {
                id: tour_id
            })
            .then(function(response) {
                // update the tour list
                setTours(tours.filter(tour => tour.id != tour_id));
            })
            .catch(function(error) {
                console.log(error);
            });

        modalHandleClose();
    };

    const modalHandleOpen = event => {
        set_tour_id(event.currentTarget.value);
        setModalOpen(true);
    };

    const modalHandleClose = () => {
        setModalOpen(false);
    };

    const createNewTour = () => {
        axios
            .post("/newTourSubmit", {
                name: newTour
            })
            .then(function(response) {
                // update the tour list
                setTours([
                    ...tours,
                    {
                        id: lastId + 1,
                        name: newTour,
                        min_time: 0
                    }
                ]);
                setLastId(lastId + 1);
                window.location.href = "/tour_item?id=" + (lastId + 1);
            })
            .catch(function(error) {
                console.log(error);
            });
        handleClose();
    };

    React.useEffect(() => {
        if (tours.length > 0) { 
            setLastId(tours[tours.length - 1].id);
        } else {
            setLastId(-1);
        }
    }, []);

    return (
        <React.Fragment>
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="textPrimary"
                            gutterBottom
                        >
                            Tour
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="textSecondary"
                            paragraph
                        >
                            Built in 1879 for Melbourne’s first International
                            Exhibition, it was chosen as the venue for the
                            opening of the first Commonwealth Parliament of
                            Australia on 9 May 1901, and recently became
                            Australia’s first World Heritage Listed building.
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleOpen}
                                    >
                                        Add a new tour
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {tours.map((tour, index) => (
                            <Grid item key={tour.id} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://picsum.photos/200/300"
                                        title="Image title"
                                    />
                                    <CardContent
                                        className={classes.cardContent}
                                    >
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            {tour.name} ({tour.min_time} sec.)
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                (window.location.href =
                                                    "/tour_item?id=" + tour.id)
                                            }
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                                (window.location.href =
                                                    "/tour_type?id=" + tour.id)
                                            }
                                        >
                                            Type
                                        </Button>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            value={tour.id}
                                            onClick={modalHandleOpen}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            <Dialog
                open={modalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={modalHandleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"Are you sure to delete the tour?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={modalHandleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">New Tour</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Locations can be added after creating a new tour.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tour Name"
                        type="text"
                        value={newTour}
                        onChange={e => setNewTour(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={createNewTour} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default Tour;

if (document.getElementById("tour")) {
    var data = document.getElementById("tour").getAttribute("data");
    var type = document.getElementById("tour").getAttribute("type");
    ReactDOM.render(
        <Tour data={data} type={type} />,
        document.getElementById("tour")
    );
}
