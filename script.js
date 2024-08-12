const video = document.getElementById('video');
const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const downloadLink = document.getElementById('download-link');

let mediaRecorder;
let recordedChunks = [];
let audioContext;
let gainNode;
let sourceNode;

// Solicita acesso à câmera e microfone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function(stream) {
        // Exibe o vídeo no elemento <video>
        video.srcObject = stream;

        // Configura o contexto de áudio para processamento
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        sourceNode = audioContext.createMediaStreamSource(stream);
        
        // Ajuste de ganho para melhorar a qualidade do áudio
        gainNode = audioContext.createGain();
        gainNode.gain.value = 1; // Ajuste o ganho conforme necessário
        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configura a gravação
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = function() {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            recordedChunks = [];
            downloadLink.href = url;
            downloadLink.style.display = 'block'; // Exibe o link de download
        };

    })
    .catch(function(error) {
        console.error('Erro ao acessar a câmera ou microfone:', error);
        alert('Não foi possível acessar a câmera ou microfone. Verifique as permissões.');
    });

startRecordingButton.addEventListener('click', function() {
    if (mediaRecorder) {
        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    }
});

stopRecordingButton.addEventListener('click', function() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    }
});
