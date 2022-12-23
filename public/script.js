const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host:'/',
    port:'3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({video:true, audio:true}).then( stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStrem => {
            addVideoStream( video, userVideoStrem)
        })
    })

    socket.on('user-connected', userId => {
        connetToNewUser(userId, stream)
    })
})
//peerjs --port 3001

socket.on('user-disconnected', userId => {
   if(peers[userId]) peers[userId].close()
})


myPeer.on('open', id => {
   socket.emit( 'join-room', ROOM_ID, id)
})

function connetToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStrem => {
        addVideoStream( video, userVideoStrem)
    } )

    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}