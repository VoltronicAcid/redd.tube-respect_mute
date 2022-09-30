// ==UserScript==
// @name        Redd.Tube Respect Mute
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     0.4
// @match       https://www.redd.tube/video/*
// @match       https://redd.tube/video/*
// @author      -
// @description Remember if videos should be muted
// ==/UserScript==

(() => {
    const settingKey = 'muteVideo';
    const mutedVal = 'mute';
    const unmutedVal = 'unMute';

    const unpauseVideo = function (video) {
        if (video.paused) {
            video.play()
                .catch(err => console.error('Unable to play video', err));
        }
    }

    document.addEventListener('canplay', (evnt) => {
        const video = evnt.target;
        const vidContainsAudio = video.webkitAudioDecodedByteCount > 0 || video.mozHasAudio;

        if (vidContainsAudio) {
            const currVal = localStorage.getItem(settingKey);

            if (currVal === unmutedVal && video.muted) {
                video.muted = false;
                unpauseVideo(video);
            }
        }

        video.addEventListener('volumechange', () => {
            const settingVal = video.muted || video.volume === 0 ? mutedVal : unmutedVal;
            localStorage.setItem(settingKey, settingVal);
        });

    }, { capture: true, once: true });

    document.addEventListener('click', () => {
        const video = document.querySelector('video');

        if (video.paused) {
            unpauseVideo(video);
        }
    }, { once: true });
})();
