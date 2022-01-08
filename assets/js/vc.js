// Defaults
var agoraAppId = $('#form-appid').val();
var channelName = $('#form-channel').val();
var cameraVideoProfile = '480p_4';
var screenVideoProfile = '480p_2';
var client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
var remoteStreams = {};
var localStreams = {
    camera: {
        id: "",
        stream: {}
    },
    screen: {
        id: "",
        stream: {}
    }
};
var mainStreamId;

// Initialise Agora CDN
function initClientAndJoinChannel(agoraAppId, channelName) {
    client.init(agoraAppId, function () {
        joinChannel(channelName);
    }, function (err) {
    });
}

// Connect New People
client.on('stream-added', function (evt) {
    var stream = evt.stream;
    var streamId = stream.getId();
    if (streamId != localStreams.screen.id) {
        client.subscribe(stream, function (err) {
        });
    }
});
client.on('stream-subscribed', function (evt) {
    var remoteStream = evt.stream;
    var remoteId = remoteStream.getId();
    remoteStreams[remoteId] = remoteStream;
    if ($('#full-screen-video').is(':empty')) {
        mainStreamId = remoteId;
        remoteStream.play('full-screen-video');
    } else {
        addRemoteStreamMiniView(remoteStream);
    }
});

// Remove Local Remote Share
client.on("peer-leave", function (evt) {
    var streamId = evt.stream.getId();
    if (remoteStreams[streamId] != undefined) {
        remoteStreams[streamId].stop();
        delete remoteStreams[streamId];
        if (streamId == mainStreamId) {
            var streamIds = Object.keys(remoteStreams);
            var randomId = streamIds[Math.floor(Math.random() * streamIds.length)];
            remoteStreams[randomId].stop();
            var remoteContainerID = '#' + randomId + '_container';
            $(remoteContainerID).empty().remove();
            remoteStreams[randomId].play('full-screen-video');
            mainStreamId = randomId;
        } else {
            var remoteContainerID = '#' + streamId + '_container';
            $(remoteContainerID).empty().remove();
        }
    }
});

// Toggle Mic Icon
client.on("mute-audio", function (evt) {
    toggleVisibility('#' + evt.uid + '_mute', true);
});
client.on("unmute-audio", function (evt) {
    toggleVisibility('#' + evt.uid + '_mute', false);
});

// Toggle User Avatar
client.on("mute-video", function (evt) {
    var remoteId = evt.uid;
    if (remoteId != mainStreamId) {
        toggleVisibility('#' + remoteId + '_no-video', true);
    }
});
client.on("unmute-video", function (evt) {
    toggleVisibility('#' + evt.uid + '_no-video', false);
});

// Join a Channel
function joinChannel(channelName) {
    disableChannelBtn();
    var token = generateToken();
    var userID = null;
    client.join(token, channelName, userID, function (uid) {
        createCameraStream(uid);
        localStreams.camera.id = uid;
    }, function (err) {
    });
}

// Video Stream
function createCameraStream(uid) {
    var localStream = AgoraRTC.createStream({
        streamID: uid,
        audio: true,
        video: true,
        screen: false
    });
    localStream.setVideoProfile(cameraVideoProfile);
    localStream.init(function () {
        localStream.play('local-video');
        client.publish(localStream, function (err) {
        });
        enableUiControls(localStream);
        localStreams.camera.stream = localStream;
    }, function (err) {
    });
}

// Remote Streams (Local)
function addRemoteStreamMiniView(remoteStream) {
    var streamId = remoteStream.getId();
    $('#remote-streams').append(
        $('<div/>', { 'id': streamId + '_container', 'class': 'remote-stream-container' }).append(
            $('<div/>', { 'id': streamId + '_mute', 'class': 'mute-overlay' }).append(
                $('<i/>', { 'class': 'fas fa-microphone-slash' })
            ),
            $('<div/>', { 'id': streamId + '_no-video', 'class': 'no-video-overlay text-center' }).append(
                $('<i/>', { 'class': 'fas fa-user' })
            ),
            $('<div/>', { 'id': 'agora_remote_' + streamId, 'class': 'remote-video' })
        )
    );
    remoteStream.play('agora_remote_' + streamId);
    var containerId = '#' + streamId + '_container';
    $(containerId).dblclick(function () {
        remoteStreams[mainStreamId].stop();
        addRemoteStreamMiniView(remoteStreams[mainStreamId]);
        $(containerId).empty().remove();
        remoteStreams[streamId].stop()
        remoteStreams[streamId].play('full-screen-video');
        mainStreamId = streamId;
    });
}

// Leave Channel
function leaveChannel() {
    enableChannelBtn();
    client.leave(function () {
        localStreams.camera.stream.stop()
        client.unpublish(localStreams.camera.stream);
        localStreams.camera.stream.close();
        $("#remote-streams").empty()
        $("#mic-btn").prop("disabled", true);
        $("#download-btn").prop("disabled", true);
        $("#video-btn").prop("disabled", true);
        $("#exit-btn").prop("disabled", true);
        toggleVisibility("#mute-overlay", false);
        toggleVisibility("#no-local-video", false);
        $("#modalForm").modal("show");
    }, function (err) {
    });
}

// Generate Token
function generateToken() {
    return null;
}

// Video Call Controls
$("#mic-btn").prop("disabled", true);
$("#video-btn").prop("disabled", true);
$("#exit-btn").prop("disabled", true);
$("#download-btn").prop("disabled", true);

// Loader
$(function () {
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1000);
    };
    loader();
});

console.clear();