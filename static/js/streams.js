const APP_ID = '2de72de1883447d3a8a623fb9d2d8e37'

const CHANNEL = 'main'

const TOKEN = '0062de72de1883447d3a8a623fb9d2d8e37IACSYT/Zo6fHC+EhxPBqd2xFlzJ4vsBzNpz/700zg0hjJWTNKL8AAAAAEADR1hyrQr9AYgEAAQBCv0Bi'

let UID;

const client = AgoraRTC.createClient({mode:'rtc', codec : 'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStram = async () =>{
    UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-containers" id="user-container-${UID}">
                    <div class="username-wrapper"> <span class="user-name"></span>My Name</div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`
    
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1]])

}

joinAndDisplayLocalStram()