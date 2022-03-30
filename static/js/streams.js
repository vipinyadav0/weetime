const APP_ID = "2de72de1883447d3a8a623fb9d2d8e37";

const CHANNEL = sessionStorage.getItem('room');

// const TOKEN = "0062de72de1883447d3a8a623fb9d2d8e37IAC0ae64dA6WnE/yI6XZa7ojiyHjhEc7hT2o6YxsBLE3s2TNKL8AAAAAEAAg4mLWzP5CYgEAAQDM/kJi"

const TOKEN = sessionStorage.getItem('token')

let UID = Number(sessionStorage.getItem('UID'))

let NAME = sessionStorage.getItem('name')

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStram = async () => {
  document.getElementById('room-name').innerText = CHANNEL


  client.on("user-published", handleUserJoined);
  client.on("user-left", handleUserLeft);

  try{
    await client.join(APP_ID, CHANNEL, TOKEN, UID)
  }catch(error){
    console.error(error)

    window.open('/', '_self')
  }

  // UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  let member = await createMember()




  let player = `<div class="video-containers" id="user-container-${UID}">
                    <div class="username-wrapper"> <span class="user-name">${ member.name }</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`;

  document.getElementById("video-streams").insertAdjacentHTML("beforeend", player);

  localTracks[1].play(`user-${UID}`);

  await client.publish([localTracks[0], localTracks[1]]);
};

let handleUserJoined = async (user, mediaType) => {
  remoteUsers[user.UID] = user;
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    let player = document.getElementById(`user-container-${user.UID}`);




    if (player != null) {
      player.remove();
    }

    let member = await getMember(user)

    player = `<div class="video-containers" id="user-container-${user.UID}">
                    <div class="username-wrapper"> <span class="user-name">${member.name}</span></div>
                    <div class="video-player" id="user-${user.UID}"></div>
                </div>`;

    document.getElementById("video-streams").insertAdjacentHTML("beforeend", player);

    user.videoTrack.play(`user-${user.UID}`);
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

let handleUserLeft = async (user) => {
  delete remoteUsers[user.UID];
  document.getElementById(`user-container-${user.UID}`).remove();
};

let leaveAndRemoveLocalStream = async () => {
  for (let i = 0; localTracks.length > i; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }

  await client.leave();

  deleteMember()
  
  window.open("/", "_self");
};

let toggleCamera = async () => {
  if(localTracks[1].muted){
    await localTracks[1].setMuted(false)
    // else.target.style.backgroundColor
  } else{
    await localTracks[1].setMuted(true)
  }
};

let toggleMic = async () => {
  if(localTracks[0].muted){
    await localTracks[0].setMuted(false)
    // else.target.style.backgroundColor
  } else{
    await localTracks[0].setMuted(true)
  }
};

let createMember = async () => {
  let response = await fetch('/create_member/' , {
    method : 'POST' ,
    headers: {
      'Content-Type' :'application/json'
    },
    body : JSON.stringify({'name': NAME , 'room_name': CHANNEL, 'UID': UID})
  })

  let member = await response.json()
  return member
}

let getMember  = async (user) => {
  let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`)
  let data = response.json
  return member
}

let deleteMember = async () => {
  let response = await fetch('/delete_member/' , {
    method : 'POST' ,
    headers: {
      'Content-Type' :'application/json'
    },
    body : JSON.stringify({'name': NAME , 'room_name': CHANNEL, 'UID': UID})
  })

  let member = await response.json()
}


joinAndDisplayLocalStram();

window.addEventListener('beforeunload', deleteMember)

document.getElementById("leave-btn").addEventListener("click", leaveAndRemoveLocalStream);
document.getElementById("camera-btn").addEventListener("click", toggleCamera)
document.getElementById("mic-btn").addEventListener("click", toggleMic)

