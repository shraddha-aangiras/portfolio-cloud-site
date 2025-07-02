from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import firestore
import os
import hashlib
import datetime

app = Flask(__name__)
CORS(app)
db = firestore.Client()

# Timeframe for considering a visitor unique again
UNIQUE_VISITOR_WINDOW_HOURS = 24

def get_visitor_count():
    try:
        doc_ref = db.collection('stats').document('visitor_count')
        doc = doc_ref.get()

        if doc.exists:
            return doc.to_dict().get('count', 0)
        else:
            doc_ref.set({'count': 0})
            return 0
    except Exception as e:
        print(f"Error getting visitor count: {e}")
        return 0

def increment_visitor_count():
    try:
        doc_ref = db.collection('stats').document('visitor_count')
        doc = doc_ref.get()

        if doc.exists:
            current_count = doc.to_dict().get('count', 0)
            new_count = current_count + 1
            doc_ref.update({'count': new_count})
            return new_count
        else:
            doc_ref.set({'count': 1})
            return 1
    except Exception as e:
        print(f"Error incrementing visitor count: {e}")
        return None

def hash_ip(ip):
    """Create a SHA-256 hash of the IP address for privacy"""
    return hashlib.sha256(ip.encode('utf-8')).hexdigest()

def is_unique_visitor(hashed_ip):
    """Check if the visitor is unique in the defined timeframe"""
    visitor_ref = db.collection('unique_visitors').document(hashed_ip)
    visitor_doc = visitor_ref.get()

    now = datetime.datetime.utcnow()

    if visitor_doc.exists:
        last_visit_str = visitor_doc.to_dict().get('last_visit')
        if last_visit_str:
            last_visit = datetime.datetime.fromisoformat(last_visit_str)
            elapsed = now - last_visit
            if elapsed.total_seconds() < UNIQUE_VISITOR_WINDOW_HOURS * 3600:
                return False
            else:
                visitor_ref.update({'last_visit': now.isoformat()})
                return True
        else:
            visitor_ref.set({'last_visit': now.isoformat()})
            return True
    else:
        visitor_ref.set({'last_visit': now.isoformat()})
        return True

@app.route('/')
def hello():
    return jsonify({'message': 'Visitor Counter API is running!'})

@app.route('/visitor-count', methods=['GET'])
def get_count():
    """Get current visitor count"""
    count = get_visitor_count()
    return jsonify({'count': count})

@app.route('/visitor-count', methods=['POST'])
def increment_count():
    """Increment unique visitor count only if visitor is unique"""
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)

    if not ip:
        # fallback IP if none found
        ip = '0.0.0.0'

    hashed_ip = hash_ip(ip)

    try:
        if is_unique_visitor(hashed_ip):
            new_count = increment_visitor_count()
            if new_count is not None:
                return jsonify({'count': new_count})
            else:
                return jsonify({'error': 'Failed to increment count'}), 500
        else:
            count = get_visitor_count()
            return jsonify({'count': count, 'message': 'Repeat visitor'})
    except Exception as e:
        print(f"Error processing visitor: {e}")
        return jsonify({'error': 'Internal error'}), 500

@app.route('/health-check')
def health_check():
    return 'OK', 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
