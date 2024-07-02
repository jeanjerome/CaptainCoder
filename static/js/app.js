document.addEventListener('DOMContentLoaded', function() {
    const vscode = acquireVsCodeApi();

    document.getElementById('send-button').addEventListener('click', () => {
        const question = document.getElementById('question-input').value;
        vscode.postMessage({ command: 'askQuestion', question });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.answer) {
            document.getElementById('response').innerText = message.answer;
        }
    });
});
