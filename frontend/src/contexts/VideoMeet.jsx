import { useScrollTrigger } from '@mui/material';
import React, { useRef, useState } from 'react'

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnection = {
    "iceServers": [
        {
            "urls": "stun:stun.l.google.com:19302"
        }
    ]
}

export default function VideoMeet() {
    var socketRef = useRef();

    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videAvailable, setvideoAvailable] = useState(true);

    let [audioAvailable, setaudioAvailable] = useState(true);

    let [video, setVideo] = useState();

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setShowModal] = useState();

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])
    return (
        <div>VideoMeet</div>
    )
}
