// Modern Control Bar Functionality

// State management
let audioEnabled = true;
let videoEnabled = true;
let screenSharing = false;

// Initialize controls when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeControls();
});

function initializeControls() {
    // Audio toggle
    const audioBtn = document.getElementById('toggleAudio');
    if (audioBtn) {
        audioBtn.addEventListener('click', toggleAudio);
    }

    // Video toggle
    const videoBtn = document.getElementById('toggleVideo');
    if (videoBtn) {
        videoBtn.addEventListener('click', toggleVideo);
    }

    // Screen share
    const shareBtn = document.getElementById('shareScreen');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareScreen);
    }

    // More options
    const moreBtn = document.getElementById('moreOptions');
    if (moreBtn) {
        moreBtn.addEventListener('click', showMoreOptions);
    }
}

// Toggle Audio (Microphone)
function toggleAudio() {
    const btn = document.getElementById('toggleAudio');
    const icon = btn.querySelector('i');
    const localVideo = document.getElementById('localVideo');
    
    if (localVideo && localVideo.srcObject) {
        const audioTracks = localVideo.srcObject.getAudioTracks();
        
        audioEnabled = !audioEnabled;
        
        audioTracks.forEach(track => {
            track.enabled = audioEnabled;
        });
        
        if (audioEnabled) {
            icon.className = 'bi bi-mic-fill';
            btn.classList.remove('active');
            btn.title = 'Mute';
        } else {
            icon.className = 'bi bi-mic-mute-fill';
            btn.classList.add('active');
            btn.title = 'Unmute';
        }
    }
}

// Toggle Video (Camera)
function toggleVideo() {
    const btn = document.getElementById('toggleVideo');
    const icon = btn.querySelector('i');
    const localVideo = document.getElementById('localVideo');
    
    if (localVideo && localVideo.srcObject) {
        const videoTracks = localVideo.srcObject.getVideoTracks();
        
        videoEnabled = !videoEnabled;
        
        videoTracks.forEach(track => {
            track.enabled = videoEnabled;
        });
        
        if (videoEnabled) {
            icon.className = 'bi bi-camera-video-fill';
            btn.classList.remove('active');
            btn.title = 'Stop Video';
        } else {
            icon.className = 'bi bi-camera-video-off-fill';
            btn.classList.add('active');
            btn.title = 'Start Video';
        }
    }
}

// Share Screen
async function shareScreen() {
    const btn = document.getElementById('shareScreen');
    const icon = btn.querySelector('i');
    
    if (!screenSharing) {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false
            });
            
            // Create a new video element for screen share
            const videoContainer = document.getElementById('videos');
            const screenDiv = document.createElement('div');
            screenDiv.className = 'video-tile screen-share-tile';
            screenDiv.id = 'screenShareTile';
            
            const screenVideo = document.createElement('video');
            screenVideo.className = 'video-element';
            screenVideo.autoplay = true;
            screenVideo.muted = true;
            screenVideo.srcObject = stream;
            
            const overlay = document.createElement('div');
            overlay.className = 'video-overlay';
            overlay.innerHTML = `
                <div class="participant-name">
                    <i class="bi bi-display"></i> Your Screen
                </div>
            `;
            
            screenDiv.appendChild(screenVideo);
            screenDiv.appendChild(overlay);
            videoContainer.appendChild(screenDiv);
            
            screenSharing = true;
            icon.className = 'bi bi-stop-circle-fill';
            btn.classList.add('active');
            btn.title = 'Stop Sharing';
            
            // Handle when user stops sharing from browser
            stream.getVideoTracks()[0].addEventListener('ended', () => {
                stopScreenShare();
            });
            
        } catch (err) {
            console.error('Error sharing screen:', err);
            showNotification('Failed to share screen');
        }
    } else {
        stopScreenShare();
    }
}

function stopScreenShare() {
    const screenTile = document.getElementById('screenShareTile');
    if (screenTile) {
        const video = screenTile.querySelector('video');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        screenTile.remove();
    }
    
    const btn = document.getElementById('shareScreen');
    const icon = btn.querySelector('i');
    screenSharing = false;
    icon.className = 'bi bi-display';
    btn.classList.remove('active');
    btn.title = 'Share Screen';
}

// Show more options
function showMoreOptions() {
    // Placeholder for more options menu
    const options = [
        'Settings',
        'Speaker View',
        'Gallery View',
        'Blur Background',
        'Recording'
    ];
    
    console.log('More options:', options);
    showNotification('More options coming soon!');
}

// Update participant count in navbar
function updateParticipantCount(count) {
    const navCounter = document.getElementById('viewer-count-nav');
    if (navCounter) {
        navCounter.textContent = count;
    }
}

// Show notification helper
function showNotification(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            position: 'top-end',
            text: message,
            showConfirmButton: false,
            timer: 2000,
            width: '250px',
            toast: true
        });
    } else {
        // Fallback to custom toast
        const notification = document.createElement('div');
        notification.className = 'toast-notification show';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D: Toggle audio
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleAudio();
    }
    
    // Ctrl/Cmd + E: Toggle video
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleVideo();
    }
    
    // Ctrl/Cmd + Shift + E: Toggle chat
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        if (typeof toggleChat === 'function') {
            toggleChat();
        }
    }
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.toggleAudio = toggleAudio;
    window.toggleVideo = toggleVideo;
    window.shareScreen = shareScreen;
    window.updateParticipantCount = updateParticipantCount;
}
