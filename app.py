"""
Mahad Hamza — Portfolio Flask App
Run: python app.py
"""

from flask import Flask, render_template, jsonify, request
import os
from dotenv import load_dotenv

load_dotenv()

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

    import smtplib
    from email.mime.text import MIMEText

    subject = data.get('subject', 'Portfolio Contact Form')
    body = f"Name: {name}\nEmail: {email}\nSubject: {subject}\n\n{message}"
    msg = MIMEText(body)
    msg['Subject'] = f'Portfolio Contact: {subject}'
    msg['From'] = 'mahadhamza10@gmail.com'
    msg['To'] = 'mahadhamza10@gmail.com'
    msg['Reply-To'] = email

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('mahadhamza10@gmail.com', os.environ.get('GMAIL_APP_PASSWORD', ''))
            server.send_message(msg)
    except Exception as e:
        print(f'[CONTACT] Email send failed: {e}')

    print(f"[CONTACT] From: {name} <{email}> — {message[:80]}")
    return jsonify({'status': 'ok', 'message': 'Message received!'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
