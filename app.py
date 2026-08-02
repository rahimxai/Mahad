"""
Mahad Hamza — Portfolio Flask App
Run: python app.py
"""

from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission."""
    data = request.get_json(silent=True) or request.form
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()

    if not all([name, email, message]):
        return jsonify({'status': 'error', 'message': 'All fields required'}), 400

    # TODO: Hook up email sending (e.g. Flask-Mail, SendGrid, etc.)
    print(f"[CONTACT] From: {name} <{email}> — {message[:80]}")
    return jsonify({'status': 'ok', 'message': 'Message received!'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
