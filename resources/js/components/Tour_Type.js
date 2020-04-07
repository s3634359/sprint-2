import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction,
    Checkbox
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { FormGroup, FormControlLabel } from '@material-ui/core';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";
import LocationOn from "@material-ui/icons/LocationOn";
import DeleteOutline from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    typeButton: {
        height: '40%',
        margin: theme.spacing(0.3),
        background: 'white',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightgrey' : 'white',
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Tour_Item(props) {
    const classes = useStyles();
    const [tour_id, set_tour_id] = React.useState(props.data);
    const [locations, setLocations] = React.useState(JSON.parse(props.location));
    const [location_list, set_location_list] = React.useState(JSON.parse(props.location_list));
    const [types, setTypes] = React.useState(JSON.parse(props.type));
    const [type_list, set_type_list] = React.useState(JSON.parse(props.type_list));
    const [open, setOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [location_id, set_location_id] = React.useState('');
    const [total, setTotal] = React.useState(locations.length);

    const handleChange = (event) => {
        for (const selected of location_list) {
            if (selected.id == event.target.value) {
                for (const location of locations) {
                    if (location.id == event.target.value) {
                        alert("Already included!");
                        return false;
                    }
                }
                locations.push(selected);

                setTotal(total + 1);

                let index = 1;
                for (const location of locations) {
                    location.order = index;
                    index += 1;
                }
            }
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalHandleOpen = (event) => {
        set_location_id(event.currentTarget.value);
        setModalOpen(true);
    };

    const modalHandleClose = () => {
        setModalOpen(false);
    };

    const handleCancel = () => {
        window.location.href = "/tour";
    };

    const handleSave = (event) => {
        event.preventDefault();

        for (const location of locations) {
            axios.post('/tourSubmitLocation', {
                id: tour_id,
                location_id: location.id,
                location_order: location.order,
            })
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        window.location.href = "/tour";
    };

    const handleDelete = (event) => {
        axios.post('/tourDeleteLocation', {
            id: tour_id,
            location_id: location_id,
        })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

        window.location.reload();
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const tempLocations = reorder(
            locations,
            result.source.index,
            result.destination.index
        );

        let index = 1;
        for (const location of tempLocations) {
            location.order = index;
            index += 1;
        }
        setLocations(tempLocations);
    };

    React.useEffect(() => {
        
    }, []);


    const location_items = [];
    for (const location of location_list) {
        location_items.push(<MenuItem value={location.id}>{location.name}</MenuItem>);
    }

    return (
        <React.Fragment>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    {/* <IconButton edge="start" color="inherit" onClick={handleCancel} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>Tour Detail</Typography>

                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-controlled-open-select-label">Locations</InputLabel>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={location_id}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {location_items}
                        </Select>
                    </FormControl>
                    <Button autoFocus color="inherit" onClick={handleSave}>
                        save
                        </Button> */}
                </Toolbar>
            </AppBar>
            {/* <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <RootRef rootRef={provided.innerRef}>
                            <List style={getListStyle(snapshot.isDraggingOver)}>
                                {locations.map((location, index) => (
                                    <Draggable key={location.id} draggableId={location.name} index={index}>
                                        {(provided, snapshot) => (
                                            <ListItem
                                                ContainerComponent="li"
                                                ContainerProps={{ ref: provided.innerRef }}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <ListItemIcon>
                                                    <LocationOn />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={location.name}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton value={location.id} onClick={modalHandleOpen}>
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </RootRef>
                    )}
                </Droppable>
            </DragDropContext>
            <Dialog
                open={modalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={modalHandleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Are you sure to delete the location?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={modalHandleClose} color="secondary">
                        Cancel
                            </Button>
                    <Button onClick={handleDelete} color="primary">
                        Yes
                            </Button>
                </DialogActions>
            </Dialog> */}
        </React.Fragment>
    );
}

export default Tour_Item;

if (document.getElementById('tour_item')) {
    var data = document.getElementById('tour_item').getAttribute('tour_id');
    var type = document.getElementById('tour_item').getAttribute('type');
    var type_list = document.getElementById('tour_item').getAttribute('type_list');
    ReactDOM.render(<Tour_Type data={data} type={type} type_list={type_list} />, document.getElementById('tour_item'));
}