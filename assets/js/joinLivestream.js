// Defaults
var client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });

// Join Channel Modal
$("#watch-live-btn").click(function (event) {
  var agoraAppId = $('#form-appid').val();
  var channelName = $('#form-channel').val();
  initClientAndJoinChannel(agoraAppId, channelName);
  $("#modalForm").modal("hide");
});

// Initialise Agora CDN
function initClientAndJoinChannel(agoraAppId, channelName) {
  client.init(agoraAppId, function () {
    joinChannel(channelName);
  }, function (err) {
  });
}

// Publish Stream
client.on('stream-published', function (evt) {
});

// Connect New People
client.on('stream-added', function (evt) {
  var stream = evt.stream;
  client.subscribe(stream, function (err) {
  });
});
client.on('stream-subscribed', function (evt) {
  var remoteStream = evt.stream;
  var remoteId = remoteStream.getId();
  if ($('#full-screen-video').is(':empty')) {
    mainStreamId = remoteId;
    remoteStream.play('full-screen-video');
  } else {
    addRemoteStreamMiniView(remoteStream);
  }
});

// Stop Stream
client.on('stream-removed', function (evt) {
  var stream = evt.stream;
  stream.stop();
  stream.close();
});

// Stop Stream When Leaving
client.on('peer-leave', function (evt) {
  evt.stream.stop();
});

// Join Channel
function joinChannel(channelName) {
  disableChannelBtn();
  var token = generateToken();
  client.setClientRole('audience', function () {
  }, function (e) {
  });
  client.join(token, channelName, 0, function (uid) {
  }, function (err) {
  });
}

// Leave Channel
function leaveChannel() {
  enableChannelBtn();
  client.leave(function () {
    $('#exit-btn').prop('disabled', true);
  }, function (err) {
  });
}

// Generate Token
function generateToken() {
  return null;
}

// Disable Channel Btn
function disableChannelBtn() {
  $('#watch-live-btn').attr('disabled', true);
  $('#form-channel').attr('disabled', true);
  $("#watch-live-btn").html("Channel Already Chosen");
}

// Enable Channel Btn
function enableChannelBtn() {
  $('#watch-live-btn').attr('disabled', false);
  $('#form-channel').attr('disabled', false);
  $("#watch-live-btn").html("Join Channel");
}

// Show Form on Page Load
$(document).ready(function () {
  $("#modalForm").modal("show");
});

// Keypress Join Channel
$(document).keypress(function (event) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if (keycode == '13') {
    $("#watch-live-btn").trigger('click');
  }
});

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