// Handle video play
export const handlePlay = (id, creatorId, ws) => {
  const payload = {
    method: "play",
    partyId: id,
    clientId: creatorId,
  };

  ws.current.send(JSON.stringify(payload));
};

// Handle video pause
export const handlePause = (id, creatorId, ws) => {
  const payload = {
    method: "pause",
    partyId: id,
    clientId: creatorId,
  };

  ws.current.send(JSON.stringify(payload));
};

// Handle video seek
export const handleSeeked = (id, creatorId, ws) => {
  const vid = document.getElementById("video");
  const playhead = vid.currentTime;

  const payload = {
    method: "seeked",
    partyId: id,
    clientId: creatorId,
    playhead: playhead,
  };

  ws.current.send(JSON.stringify(payload));
};

// Load start position of video
export const loadStartPosition = (playheadStart) => {
  const vid = document.getElementById("video");
  if (!vid) return;
  vid.currentTime = playheadStart.toString();
};

// Periodically update playhead status
export const updatePlayhead = (partyId, ws) => {
  const vid = document.getElementById("video");
  if (!vid) return;
  const playhead = vid.currentTime;

  const payload = {
    method: "update",
    partyId: partyId,
    playhead: playhead,
  };

  ws.current.send(JSON.stringify(payload));

  setTimeout(() => updatePlayhead(partyId, ws), 400);
};

export const keepAlive = (userId, ws) => {
  const payload = {
    method: "keepAlive",
    clientId: userId,
  };

  ws.current.send(JSON.stringify(payload));

  setTimeout(() => keepAlive(userId, ws), 25000);
};
