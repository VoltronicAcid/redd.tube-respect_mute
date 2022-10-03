// ==UserScript==
// @name        Redd.Tube Respect Mute
// @description Remember if videos should be muted on Redd.Tube
// @author      VoltronicAcid
// @namespace   https://github.com/VoltronicAcid/
// @homepageURL https://github.com/VoltronicAcid/redd.tube-respect_mute
// @downloadURL https://github.com/VoltronicAcid/redd.tube-respect_mute
// @version     0.6
// @match       https://www.redd.tube/video/*
// @match       https://redd.tube/video/*
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
        console.warn(`%c${evnt.type} event fired`, 'color:goldenrod; font-weight:bolder; font-size: 14px;');
        const video = evnt.target;
        const vidContainsAudio = video.webkitAudioDecodedByteCount > 0 || video.mozHasAudio;

        if (localStorage.getItem(settingKey) === null) {
            localStorage.setItem(settingKey, mutedVal);
        }
        const currMuteVal = localStorage.getItem(settingKey);

        if (vidContainsAudio) {
            if (currMuteVal === unmutedVal && video.muted) {
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
