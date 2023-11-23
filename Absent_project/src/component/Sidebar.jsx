import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import HistoryIcon from "@mui/icons-material/History";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {" "}
        <Link to="/">
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <ListItem button>
          <ListItemIcon>
            <ExploreIcon />
          </ListItemIcon>
          <ListItemText primary="Explore" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SubscriptionsIcon />
          </ListItemIcon>
          <ListItemText primary="Subscriptions" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LibraryAddIcon />
          </ListItemIcon>
          <ListItemText primary="Library" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      </List>
      <List>
        <ListItem button>
          <ListItemIcon>
            <VideoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Your videos" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <WatchLaterIcon />
          </ListItemIcon>
          <ListItemText primary="Watch later" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText primary="Liked videos" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
