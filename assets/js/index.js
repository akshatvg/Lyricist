// Join Channel Modal
$("#join-channel").click(function (event) {
    var agoraAppId = $('#form-appid').val();
    var channelName = $('#form-channel').val();
    initClientAndJoinChannel(agoraAppId, channelName);
    $("#modalForm").modal("hide");
});

// Enable After Join
function enableUiControls(localStream) {
    $("#mic-btn").prop("disabled", false);
    $("#video-btn").prop("disabled", false);
    $("#exit-btn").prop("disabled", false);
    $("#download-btn").prop("disabled", false);
    $("#mic-btn").click(function () {
        toggleMic(localStream);
    });
    $("#video-btn").click(function () {
        toggleVideo(localStream);
    });
    $("#exit-btn").click(function () {
        leaveChannel();
    });

    // Shortcuts
    $(document).keypress(function (e) {
        switch (e.key) {
            case "m":
                toggleMic(localStream);
                break;
            case "v":
                toggleVideo(localStream);
                break;
            case "q":
                leaveChannel();
                break;
            default:
        }
    });
}

// Toggle
function toggleBtn(btn) {
    btn.toggleClass('btn-dark').toggleClass('btn-danger');
}
function toggleVisibility(elementID, visible) {
    if (visible) {
        $(elementID).attr("style", "display:block");
    } else {
        $(elementID).attr("style", "display:none");
    }
}

// Toggle Audio
function toggleMic(localStream) {
    toggleBtn($("#mic-btn"));
    $("#mic-icon").toggleClass('fa-microphone').toggleClass('fa-microphone-slash');
    if ($("#mic-icon").hasClass('fa-microphone')) {
        localStream.unmuteAudio();
        toggleVisibility("#mute-overlay", false);
    } else {
        localStream.muteAudio();
        toggleVisibility("#mute-overlay", true);
    }
}

// Toggle Video
function toggleVideo(localStream) {
    toggleBtn($("#video-btn"));
    $("#video-icon").toggleClass('fa-video').toggleClass('fa-video-slash');
    if ($("#video-icon").hasClass('fa-video')) {
        localStream.unmuteVideo();
        toggleVisibility("#no-local-video", false);
    } else {
        localStream.muteVideo();
        toggleVisibility("#no-local-video", true);
    }
}

// Disable Channel Btn
function disableChannelBtn() {
    $('#join-channel').attr('disabled', true);
    $('#form-channel').attr('disabled', true);
    $("#join-channel").html("Channel Already Chosen");
}

// Enable Channel Btn
function enableChannelBtn() {
    $('#join-channel').attr('disabled', false);
    $('#form-channel').attr('disabled', false);
    $("#join-channel").html("Join Channel");
}

// Keypress Join Channel
$(document).keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $("#join-channel").trigger('click');
    }
});

// Remove default video style tag
$(document).ready(function () {
    $('video').removeAttr('style');
    $("video").css("style", "");
});

// Disable Btns
$("#mic-btn").prop("disabled", true);
$("#video-btn").prop("disabled", true);
$("#exit-btn").prop("disabled", true);
$("#download-btn").prop("disabled", true);

// Show Form on Page Load
$(document).ready(function () {
    $("#modalForm").modal("show");
});

console.clear();
