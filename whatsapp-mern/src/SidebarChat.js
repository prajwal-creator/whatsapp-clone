import React from 'react';
import "./SidebarChat.css";
import { Avatar, IconButton } from '@material-ui/core';

function SidebarChat(props) {
    return (
        <div className="sidebarChat">
            <Avatar/>
            <div className="sidebarChat__info">
                <h3> room name</h3>
                <p>this is message</p>
            </div>
        </div>
    )
}

SidebarChat.propTypes = {

}

export default SidebarChat;

